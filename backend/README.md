# Linux Joystick Backend for Gamepad Mapper

This backend service enables the Gamepad Mapper web application to work with Linux joysticks that are accessible through `/dev/input/js*` devices.

## Requirements

- Python 3.7 or higher
- `websockets` Python package
- Access to `/dev/input/js*` devices (usually requires being in the `input` group)

## Installation

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Ensure you have access to joystick devices:
   ```bash
   # Add your user to the input group
   sudo usermod -a -G input $USER
   
   # Verify the joystick is detected
   ls -l /dev/input/js*
   ```

   Note: You may need to log out and log back in for the group changes to take effect.

## Usage

1. Start the WebSocket server:
   ```bash
   python linux_joystick.py
   ```

2. The server will automatically:
   - Look for a joystick at `/dev/input/js0`
   - Start a WebSocket server at `ws://localhost:8765`
   - Reconnect automatically if the joystick is disconnected
   - Send joystick state updates at ~60Hz

3. Open the Gamepad Mapper web application in your browser. It will automatically:
   - Connect to the WebSocket server
   - Detect the Linux joystick
   - Display joystick input in real-time

## Troubleshooting

1. If the joystick is not detected:
   - Check if the device exists: `ls /dev/input/js*`
   - Verify permissions: `ls -l /dev/input/js0`
   - Ensure you're in the input group: `groups`
   - Try unplugging and replugging the joystick

2. If the WebSocket connection fails:
   - Check if the server is running: `ps aux | grep linux_joystick.py`
   - Verify the port is available: `netstat -an | grep 8765`
   - Check browser console for connection errors

## Custom Device Path

To use a different joystick device, you can specify the path when starting the server:

```bash
python linux_joystick.py --device /dev/input/js1
```

## Security Note

The WebSocket server only accepts connections from localhost by default. If you need to accept connections from other machines, you'll need to modify the host parameter in the code (not recommended for production use without proper security measures). 