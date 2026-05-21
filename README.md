# AFXX Vision AI - Premium Object Detection Platform

![AFXX Vision AI](https://img.shields.io/badge/AFXX-Vision%20AI-00d4ff?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-3776ab?style=for-the-badge)
![Flask](https://img.shields.io/badge/Flask-3.0-000?style=for-the-badge)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-FFD21E?style=for-the-badge)

A cutting-edge, premium dark-themed web platform for real-time object detection using YOLOv8 and OpenCV. Features live webcam detection, image/video upload analysis, tracking, alerts, and beautiful animations.

## 🌟 Features

### Core Detection
- **Live Camera Detection** - Real-time webcam stream with bounding boxes
- **Object Detection** - Detect 80+ COCO classes (person, car, bottle, phone, etc.)
- **Object Tracking** - Assign unique IDs to tracked objects
- **Confidence Scoring** - Display detection confidence percentages

### Advanced Features
- **Image Upload Detection** - Analyze images for object detection
- **Video Upload Detection** - Process videos and generate annotated output
- **Screenshot System** - Capture and save detection screenshots
- **Security Alerts** - Automatic warnings for dangerous objects (knives, etc.)

### Dashboard & Analytics
- **Real-time Dashboard** - Total detections, FPS, detection statistics
- **Detection History** - Complete log of all detections with timestamps
- **Screenshot Gallery** - View all captured screenshots
- **Statistics** - Average confidence, class distribution, trends

### UI/UX
- **Premium Dark Theme** - Futuristic, modern interface
- **Smooth Animations** - Page transitions, hover effects, floating particles
- **Cursor Trail Effects** - Interactive star trail following cursor
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Gradient Borders** - Animated gradient effects on cards
- **Glow Effects** - Neon-style glow on interactive elements

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Webcam (for live detection)
- 2GB+ RAM (for YOLOv8 model)

### Installation

1. **Clone or navigate to project:**
   ```bash
   cd AFXX_Vision_AI
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open in browser:**
   ```
   http://127.0.0.1:5000
   ```

## 📁 Project Structure

```
AFXX_Vision_AI/
│
├── app.py                    # Flask application & routes
├── detector.py               # YOLOv8 detection logic
├── requirements.txt          # Python dependencies
├── README.md                 # This file
│
├── templates/
│   └── index.html           # Main HTML template (all pages)
│
├── static/
│   ├── style.css            # CSS styling & animations
│   ├── script.js            # JavaScript functionality
│   ├── uploads/             # Uploaded images/videos
│   ├── screenshots/         # Captured screenshots
│   └── assets/              # Additional assets
│
└── yolov8n.pt              # YOLOv8 Nano model (auto-downloaded)
```

## 🎮 Usage Guide

### Dashboard
- View real-time statistics
- Check total detections, detection by class
- See average confidence scores
- Review recent detection logs

### Live Camera Detection
1. Click **"Start Camera"** to begin streaming
2. See real-time detections with bounding boxes
3. Filter by object class (Person, Mobile, Bottle, etc.)
4. Capture screenshots with **"Capture Screenshot"** button
5. Click **"Stop Camera"** to end streaming

### Image Detection
1. Go to **"Upload"** tab
2. Click or drag image into the image detection area
3. Supported formats: PNG, JPG, JPEG, GIF
4. View annotated image with detections
5. See detection statistics

### Video Detection
1. Go to **"Upload"** tab
2. Click or drag video into the video detection area
3. Supported formats: MP4, AVI, MOV
4. Processing time depends on video length
5. Download processed video with annotations

### Detection History
- **Logs** - Complete history of all detections
- **Screenshots** - Gallery of captured screenshots
- Click any screenshot to view full size

## 🤖 Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Python Flask 3.0 |
| **AI Model** | YOLOv8 (Ultralytics) |
| **Computer Vision** | OpenCV 4.8 |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Real-time** | Socket.io |
| **Web Server** | Flask Development Server |

## 📊 Supported Object Classes

AFXX Vision AI detects 80+ object classes from the COCO dataset:

**People & Animals**
- Person, Dog, Cat, Bird, Horse, Cow, Elephant, Bear, Zebra, Giraffe

**Vehicles**
- Car, Bicycle, Motorcycle, Bus, Truck, Train, Aeroplane, Boat

**Common Objects**
- Bottle, Cup, Fork, Knife, Spoon, Bowl, Cell Phone, Laptop, Mouse, Keyboard

**And 60+ more...**

## 🔒 Security & Privacy

- **Local Processing**: All video and image processing happens on your local machine
- **No Cloud Upload**: Your data never leaves your computer
- **Webcam Privacy**: Camera access controlled by browser permissions
- **Screenshot Storage**: Saves locally in `static/screenshots/` folder

## ⚙️ Configuration

### Performance Tuning

In `app.py`, adjust detection parameters:

```python
detector = YOLODetector("yolov8n.pt")  # Can use: yolov8s, yolov8m, yolov8l, yolov8x
```

Models sorted by speed (fast to slow):
- `yolov8n.pt` - Nano (fastest)
- `yolov8s.pt` - Small
- `yolov8m.pt` - Medium
- `yolov8l.pt` - Large
- `yolov8x.pt` - Extra Large (slowest, most accurate)

### Confidence Threshold

In camera or upload functions:
```python
result = detector.detect_frame(frame, conf_threshold=0.45)
```

Lower threshold = more detections, higher = fewer but more confident

## 🎨 UI Customization

### Change Primary Color

Edit `static/style.css`:
```css
--primary-color: #00d4ff;  /* Change to desired color */
```

### Disable Animations

Add to `static/style.css`:
```css
* {
    animation: none !important;
}
```

## 📱 API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Camera
- `POST /api/camera/start` - Start camera streaming
- `POST /api/camera/stop` - Stop camera streaming
- `GET /api/camera/frame` - Get current frame with detections

### Detection
- `POST /api/detect/image` - Upload and detect image
- `POST /api/detect/video` - Upload and detect video

### Screenshots
- `POST /api/screenshot` - Save screenshot
- `GET /api/screenshots` - Get all screenshots

### History
- `GET /api/history` - Get detection logs

## 🐛 Troubleshooting

### Camera not working
- Check browser permissions for camera access
- Ensure camera is not used by another application
- Try a different browser

### Slow detection
- Use a faster model (e.g., yolov8n instead of yolov8x)
- Reduce image/video resolution
- Close other applications to free up RAM

### Memory issues
- Clear screenshot folder: `static/screenshots/`
- Clear uploads folder: `static/uploads/`
- Restart the application

### CORS errors
- CORS is enabled for local development
- For production, configure CORS properly in `app.py`

## 📈 Performance Metrics

With YOLOv8 Nano on standard hardware:
- **FPS**: 15-30 FPS (depends on hardware)
- **Latency**: 30-100ms per frame
- **Memory**: 300-500 MB
- **Model Size**: 3.3 MB (Nano)

## 🔧 Advanced Usage

### Custom Model Training

To use your own trained YOLOv8 model:

1. Train your model with Ultralytics
2. Place `.pt` file in project root
3. Modify `detector.py`:
   ```python
   self.model = YOLO("your_model.pt")
   ```

### Webhook Integration

Extend `app.py` to send alerts:
```python
if knife_detected:
    requests.post('https://your-webhook.com', json={"alert": "knife_detected"})
```

## 🌐 Deployment

### Production Deployment

For production use, consider:

1. **Replace Flask dev server**
   ```bash
   pip install gunicorn
   gunicorn app:app --workers=4
   ```

2. **Enable HTTPS**
   ```bash
   pip install flask-talisman
   ```

3. **Configure reverse proxy** (Nginx, Apache)

4. **Set environment variables**
   ```bash
   export FLASK_ENV=production
   export FLASK_DEBUG=0
   ```

## 📝 License

This project uses YOLOv8 which is licensed under AGPL-3.0.

## 🤝 Support & Contributing

For issues, suggestions, or contributions:
1. Check existing issues
2. Create detailed bug reports
3. Submit feature requests
4. Fork and create pull requests

## 🎯 Roadmap

- [ ] WebRTC for remote streaming
- [ ] Database integration for history
- [ ] Multi-user support
- [ ] Custom model management UI
- [ ] API key authentication
- [ ] Performance analytics dashboard
- [ ] Real-time alerts via WebSocket
- [ ] Mobile app (React Native)

## 🏆 AFXX Brand

AFXX Vision AI - Pushing the boundaries of computer vision.

---

**Made with ❤️ using YOLOv8, Flask, and modern web technologies**

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅
