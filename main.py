#!/usr/bin/env python3
"""
AFXX Vision AI - Web Platform Launcher

This script has been replaced with a modern Flask web application.
Please use app.py instead for the web-based interface.

To run the new web platform:
    python app.py

Then open your browser to: http://127.0.0.1:5000

Features:
- Live webcam detection
- Image/Video upload analysis
- Real-time detection dashboard
- Screenshot system
- Premium dark futuristic UI
- Mobile responsive design

For more information, see README.md
"""

import sys
import webbrowser
from subprocess import Popen

def main():
    print("=" * 60)
    print("AFXX Vision AI - Web Platform")
    print("=" * 60)
    print()
    print("🚀 Starting AFXX Vision AI...")
    print()
    
    try:
        # Start Flask app
        from app import app
        
        print("✅ Flask server starting...")
        print("🌐 URL: http://127.0.0.1:5000")
        print()
        print("Press CTRL+C to stop the server")
        print()
        
        # Open browser
        try:
            webbrowser.open('http://127.0.0.1:5000')
            print("🌍 Opening browser automatically...")
        except:
            print("📍 Please open your browser to: http://127.0.0.1:5000")
        
        # Run Flask app
        app.run(
            host='127.0.0.1',
            port=5000,
            debug=True,
            threaded=True
        )
    
    except ImportError:
        print("❌ Error: Flask not installed!")
        print("💾 Install dependencies with: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
        img,
        "Press S: Screenshot | Press Q: Quit",
        (20, 90),
        scale=1,
        thickness=2,
        offset=8
    )

    cv2.imshow("AFXX Vision AI - Object Detection", img)

    key = cv2.waitKey(1) & 0xFF

    if key == ord("s"):
        screenshot_count += 1
        path = f"screenshots/detection_{screenshot_count}.png"
        cv2.imwrite(path, img)
        print(f"Screenshot saved: {path}")

    if key == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()