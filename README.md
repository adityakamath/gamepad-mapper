# Gamepad Mapper

A web-based gamepad mapping application built with Flask that allows users to test and configure their gamepad inputs in real-time. test

## Features

- Real-time gamepad input detection
- Visual representation of button presses and axis movements
- Cross-platform compatibility
- Simple and intuitive web interface
- CORS enabled for API access

## Tech Stack

- Backend: Flask (Python)
- Frontend: HTML, JavaScript
- CORS handling: Flask-CORS
- Deployment: Vercel

## Installation

1. Clone the repository:
```bash
git clone https://github.com/adityakamath/gamepad-mapper.git
cd gamepad-mapper
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running Locally

1. Start the Flask server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

## Deployment

This application is configured for deployment on Vercel. The necessary configuration files (`vercel.json`) are included in the repository.

To deploy:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

## API Endpoints

- `GET /`: Main application interface
- `GET /api/gamepad`: Status check endpoint for gamepad functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.