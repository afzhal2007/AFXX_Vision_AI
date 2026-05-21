# AFXX Vision AI - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

### Windows
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Then open: http://127.0.0.1:5000

### macOS/Linux
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```
Then open: http://127.0.0.1:5000

---

## 📋 File Structure

```
AFXX_Vision_AI/
├── app.py                       # Flask backend (main application)
├── detector.py                  # YOLOv8 detection engine
├── main.py                      # Launcher script
├── requirements.txt             # Python dependencies
├── README.md                    # Full documentation
├── FEATURES.md                  # Feature documentation
├── INSTALL.md                   # Installation guide
├── QUICKREF.md                  # This file
├── run.bat / run.sh             # Quick start scripts
├── .gitignore                   # Git ignore rules
├── .env.example                 # Environment template
│
├── templates/
│   └── index.html              # Main HTML (all pages)
│
└── static/
    ├── style.css               # Premium CSS styling
    ├── script.js               # JavaScript functionality
    ├── uploads/                # Image/video uploads
    ├── screenshots/            # Captured screenshots
    └── assets/                 # Additional assets
```

---

## 🎮 Page Navigation

| Page | Purpose |
|------|---------|
| **Dashboard** | View statistics & recent detections |
| **Camera** | Live webcam detection |
| **Upload** | Image/video analysis |
| **History** | Detection logs & screenshots |
| **About** | Project information |

---

## ⌨️ Keyboard Shortcuts

- `ESC` - Stop camera
- `CTRL+K` - Focus camera page
- `CTRL+U` - Focus upload page

---

## 📱 Mobile Usage

- ✅ Full responsive design
- ✅ Touch-optimized buttons
- ✅ Mobile hamburger menu
- ✅ Vertical stack layout
- ✅ Optimized camera preview

---

## 🎯 Common Tasks

### Task: Change Primary Color
File: `static/style.css`
```css
--primary-color: #YOUR_COLOR;
```

### Task: Adjust Detection Sensitivity
File: `app.py` line 45
```python
result = detector.detect_frame(frame, conf_threshold=0.50)  # Lower = more detections
```

### Task: Use Faster Model
File: `detector.py` line 14
```python
self.model = YOLO("yolov8n.pt")  # Use nano for speed
```

### Task: Clear Uploads
```bash
rm -rf static/uploads/*  # macOS/Linux
del static\uploads\*    # Windows
```

---

## 🔍 Debugging

### Browser Console (F12)
- Check for JavaScript errors
- View network requests
- See camera permissions

### Terminal/Console
- See Flask debug messages
- View error tracebacks
- Monitor server status

### Check Port Usage
```bash
netstat -ano | findstr :5000   # Windows
lsof -i :5000                  # macOS/Linux
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Camera not working | Check browser permissions |
| Port already in use | Kill process on port 5000 |
| Slow performance | Close other apps, use yolov8n |
| Module not found | Run `pip install -r requirements.txt` |
| CORS error | Restart Flask server |

---

## 📊 API Endpoints

```
GET  /                              # Dashboard page
POST /api/camera/start              # Start camera
POST /api/camera/stop               # Stop camera
GET  /api/camera/frame              # Get frame
POST /api/detect/image              # Detect image
POST /api/detect/video              # Detect video
POST /api/screenshot                # Save screenshot
GET  /api/screenshots               # List screenshots
GET  /api/history                   # Get detection logs
GET  /api/dashboard                 # Get statistics
```

---

## 🎨 UI Customization

### Change Theme Color
```css
--primary-color: #00d4ff;
--secondary-color: #ff006e;
--accent-color: #8000ff;
```

### Disable Animations
```css
* { animation: none !important; }
```

### Adjust Card Styling
Edit `.stat-card`, `.chart-card`, `.upload-card` in `style.css`

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Flask | 3.0 | Web framework |
| ultralytics | 8.0.195 | YOLOv8 model |
| opencv-python | 4.8.1.78 | Image processing |
| numpy | 1.24.3 | Numerical computing |
| Pillow | 10.0.0 | Image handling |

---

## 🚀 Performance Tips

1. **Use nano model** for faster detection
2. **Close other apps** to free RAM
3. **Disable animations** for better responsiveness
4. **Reduce video resolution** for faster processing
5. **Use wired camera** for stable connection

---

## 🔐 Security Considerations

- ✅ All processing is local
- ✅ No cloud upload
- ✅ Browser handles permissions
- ✅ Files stored locally
- ✅ No external API calls

---

## 📞 Support Resources

- **Documentation**: [README.md](README.md)
- **Features**: [FEATURES.md](FEATURES.md)
- **Installation**: [INSTALL.md](INSTALL.md)
- **This Guide**: QUICKREF.md

---

## 🎓 Learning Resources

- YOLOv8 Documentation: https://docs.ultralytics.com
- Flask Documentation: https://flask.palletsprojects.com
- OpenCV Documentation: https://docs.opencv.org
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

---

## 📈 Version Info

- **Version**: 1.0.0
- **Status**: Production Ready ✅
- **License**: AGPL-3.0 (YOLOv8)
- **Last Updated**: 2024

---

## 🏆 AFXX Vision AI

*Premium Object Detection Platform*

🤖 Powered by YOLOv8 | 🌐 Built with Flask | 💻 Modern Web Tech

---

**Ready to detect? Open http://127.0.0.1:5000** 🚀
