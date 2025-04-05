# Gamepad Mapper

A simple web application to test gamepad inputs using the Gamepad API and Flask.

## Features

- Real-time gamepad input detection
- Display of button states and axis values
- Visual feedback for pressed buttons and active axes
- Support for multiple gamepad types

## Setup

1. Navigate to the GamepadMapper directory:
```bash
cd GamepadMapper
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

5. Open your web browser and navigate to `http://localhost:3000`

## Usage

1. Connect your gamepad to your computer
2. Open the web application in your browser
3. Press any button on your gamepad to start seeing the inputs
4. The display will show:
   - Button states (pressed/released) with pressure values
   - Axis positions with their current values
   - Connected gamepad information

## Requirements

- Python 3.6+
- Flask
- A web browser that supports the Gamepad API
- A compatible gamepad/controller

## Notes

- The Gamepad API is only available in secure contexts (HTTPS) or localhost
- Some browsers may require you to press a button on the gamepad before it's detected
- Different gamepads may have different button/axis layouts 