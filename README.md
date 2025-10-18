# Hand Gesture Portfolio

A Next.js portfolio with Python-based hand gesture navigation using MediaPipe and OpenCV.

## Architecture

- **Frontend**: Next.js with TypeScript
- **Backend**: Python Flask with MediaPipe hand detection
- **Communication**: WebSocket (Socket.IO)
- **Deployment**: Docker containers

## Features

- Real-time hand gesture detection
- Navigation via hand movements
- Production-ready deployment
- Responsive design

## Quick Start

### Development

1. **Start Python backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

2. **Start Next.js frontend:**
```bash
npm install
npm run dev
```

### Production

```bash
docker-compose up --build
```

## Hand Gestures

- **Point Left**: Go back
- **Point Right**: Navigate to about page
- **Point Up**: Scroll to top
- **Point Down**: Scroll to bottom
- **Peace Sign**: Cycle through sections
- **Fist**: Reload page
- **Open Hand**: Cycle through sections

## API Endpoints

- `GET /health` - Health check
- `WebSocket /` - Real-time gesture detection

## Deployment

The application is containerized and ready for deployment on any Docker-compatible platform.