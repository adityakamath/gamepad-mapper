#!/usr/bin/env python3

import asyncio
import json
import struct
import websockets
import os
import fcntl
import array
import argparse

class LinuxJoystick:
    """Linux Joystick reader class"""
    
    # ioctls
    JSIOCGAXES = 0x80016a11
    JSIOCGBUTTONS = 0x80016a12
    JSIOCGNAME = 0x81006a13
    JSIOCGID = 0x80086a02

    def __init__(self, device_path="/dev/input/js0"):
        self.device_path = device_path
        self.device = None
        self.num_axes = 0
        self.num_buttons = 0
        self.name = ""
        self.device_id = None
        self.axes = []
        self.buttons = []
        self.connected = False

    async def connect(self):
        """Connect to the joystick device"""
        try:
            self.device = open(self.device_path, "rb")
            
            # Get number of axes
            buf = array.array('B', [0])
            fcntl.ioctl(self.device, self.JSIOCGAXES, buf)
            self.num_axes = buf[0]
            
            # Get number of buttons
            buf = array.array('B', [0])
            fcntl.ioctl(self.device, self.JSIOCGBUTTONS, buf)
            self.num_buttons = buf[0]
            
            # Get device name (up to 128 chars)
            buf = array.array('B', [0] * 128)
            fcntl.ioctl(self.device, self.JSIOCGNAME, buf)
            self.name = buf.tobytes().decode('utf-8').rstrip('\x00')
            
            # Initialize axes and buttons arrays
            self.axes = [0.0] * self.num_axes
            self.buttons = [0] * self.num_buttons
            
            self.connected = True
            print(f"Connected to {self.name}")
            print(f"Axes: {self.num_axes}, Buttons: {self.num_buttons}")
            
            # Set non-blocking mode
            os.set_blocking(self.device.fileno(), False)
            
            return True
        except (FileNotFoundError, PermissionError) as e:
            print(f"Error connecting to joystick: {e}")
            self.connected = False
            return False

    async def read_event(self):
        """Read a single joystick event"""
        try:
            event = self.device.read(8)
            if event:
                time, value, type_and_number, init = struct.unpack('IhBB', event)
                type_and_number = bin(type_and_number)
                event_type = int(type_and_number[-1])
                event_number = int(type_and_number[2:-1], 2)

                # Handle axis events
                if event_type == 2:
                    self.axes[event_number] = value / 32767.0  # Normalize to [-1, 1]
                # Handle button events
                elif event_type == 1:
                    self.buttons[event_number] = value

                return True
        except (OSError, IOError):
            pass
        return False

    def get_state(self):
        """Get current joystick state"""
        return {
            'connected': self.connected,
            'name': self.name,
            'axes': self.axes,
            'buttons': [{'pressed': bool(v), 'touched': bool(v), 'value': float(v)} for v in self.buttons],
            'id': f"Linux Joystick: {self.name}",
            'index': 0,
            'mapping': 'standard',
            'timestamp': 0  # Updated by the frontend
        }

    def close(self):
        """Close the joystick device"""
        if self.device:
            self.device.close()
            self.connected = False

class JoystickServer:
    """WebSocket server for joystick data"""
    
    def __init__(self, device_path="/dev/input/js0", host="localhost", port=8765):
        self.host = host
        self.port = port
        self.joystick = LinuxJoystick(device_path)
        self.clients = set()

    async def handle_client(self, websocket):
        """Handle a client WebSocket connection"""
        try:
            self.clients.add(websocket)
            print(f"Client connected. Total clients: {len(self.clients)}")
            
            # Keep the connection alive and send updates
            while True:
                if not self.joystick.connected:
                    await self.joystick.connect()
                    if not self.joystick.connected:
                        await asyncio.sleep(1)
                        continue

                # Read events and broadcast state
                event_read = await self.joystick.read_event()
                if event_read or len(self.clients) > 0:
                    state = self.joystick.get_state()
                    try:
                        await websocket.send(json.dumps(state))
                    except websockets.exceptions.ConnectionClosed:
                        break
                
                await asyncio.sleep(0.016)  # ~60Hz update rate

        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected")
        finally:
            self.clients.remove(websocket)
            if len(self.clients) == 0:
                self.joystick.close()

    async def start(self):
        """Start the WebSocket server"""
        async with websockets.serve(self.handle_client, self.host, self.port):
            print(f"Joystick WebSocket server running at ws://{self.host}:{self.port}")
            await asyncio.Future()  # run forever

def parse_args():
    parser = argparse.ArgumentParser(description='Linux Joystick WebSocket Server')
    parser.add_argument('--device', default='/dev/input/js0',
                      help='Joystick device path (default: /dev/input/js0)')
    parser.add_argument('--host', default='localhost',
                      help='WebSocket server host (default: localhost)')
    parser.add_argument('--port', type=int, default=8765,
                      help='WebSocket server port (default: 8765)')
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_args()
    print(f"Starting server with device: {args.device}")
    print(f"WebSocket server will run at ws://{args.host}:{args.port}")
    
    server = JoystickServer(device_path=args.device, host=args.host, port=args.port)
    try:
        asyncio.run(server.start())
    except KeyboardInterrupt:
        print("\nShutting down server...")
    finally:
        server.joystick.close() 