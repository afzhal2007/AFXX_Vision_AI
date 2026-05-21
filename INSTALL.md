# AFXX Vision AI - Installation Guide

## ✅ Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Webcam for live detection (optional)
- 2GB+ RAM
- 500MB free disk space

## 🔧 Step-by-Step Installation

### 1. Navigate to Project Directory
```bash
cd AFXX_Vision_AI
```

### 2. Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
# Option 1: Using app.py
python app.py

# Option 2: Using main.py (launcher)
python main.py
```

### 5. Open in Browser
```
http://127.0.0.1:5000
```

## 📋 First Time Setup Checklist

- [ ] Python installed (check: `python --version`)
- [ ] Virtual environment created
- [ ] Dependencies installed (check: `pip list`)
- [ ] Webcam connected (for camera detection)
- [ ] Port 5000 is available
- [ ] Browser supports WebGL (most modern browsers do)

## 🚀 Running the Application

### Development Mode
```bash
python app.py
```
- Includes debug mode
- Auto-reloads on code changes
- Shows detailed errors

### Production Mode
```bash
pip install gunicorn
gunicorn app:app --workers=4
```

## 🎯 First Launch

1. Open http://127.0.0.1:5000 in your browser
2. Go to "Dashboard" to see statistics
3. Go to "Camera Detection" to test webcam
4. Try uploading an image to test detection
5. Check "Detection History" for logs

## 🔍 Troubleshooting

### Port 5000 Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Camera Not Working
1. Check browser permissions for camera
2. Ensure no other app is using camera
3. Try different browser
4. Check webcam in system settings

### Slow Performance
- Close other applications
- Use faster YOLOv8 model (yolov8n)
- Reduce camera resolution

### Memory Issues
- Clear screenshots: `static/screenshots/`
- Clear uploads: `static/uploads/`
- Restart application

## 📚 Next Steps

1. Read [README.md](README.md) for full documentation
2. Explore all pages: Dashboard, Camera, Upload, History, About
3. Try different detection scenarios
4. Customize UI colors in `static/style.css`
5. Configure detection settings in `app.py`

## 🆘 Getting Help

- Check README.md for comprehensive documentation
- Review error messages in browser console (F12)
- Check Flask server logs in terminal
- Ensure all dependencies are installed

---

**Enjoy AFXX Vision AI!** 🎉
