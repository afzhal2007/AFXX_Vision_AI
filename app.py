from flask import Flask, render_template, Response, request, jsonify, send_from_directory
import cv2
import threading
import time
import os
import base64
from datetime import datetime
from pathlib import Path

try:
    from ultralytics import YOLO
except Exception as e:
    raise RuntimeError('ultralytics package required. Install via `pip install ultralytics`')

app = Flask(__name__)

# Camera globals
camera_lock = threading.Lock()
camera_cap = None
camera_active = False

# Load model (require yolov8s.pt present)
MODEL_PATH = 'yolov8s.pt'
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError('Model file yolov8s.pt not found in project root')

model = YOLO(MODEL_PATH)


def draw_boxes(frame, results):
    """Draw cyan bounding boxes with label background and readable text."""
    color = (255, 255, 0)  # BGR cyan-like
    for r in results:
        boxes = getattr(r, 'boxes', None)
        if boxes is None:
            continue
        for box in boxes:
            try:
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                conf = float(box.conf[0]) if hasattr(box, 'conf') else 0.0
                cls = int(box.cls[0]) if hasattr(box, 'cls') else 0
                label = r.names.get(cls, str(cls)) if hasattr(r, 'names') else str(cls)

                # Draw rectangle
                thickness = 3
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, thickness)

                text = f"{label} {conf:.2f}"
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = 0.8
                font_thickness = 2

                (tw, th), _ = cv2.getTextSize(text, font, font_scale, font_thickness)
                pad = 6
                # background rectangle for text
                rx1, ry1 = x1, max(0, y1 - th - pad)
                rx2, ry2 = x1 + tw + pad * 2, y1
                cv2.rectangle(frame, (rx1, ry1), (rx2, ry2), color, -1)
                cv2.putText(frame, text, (x1 + pad, y1 - pad // 2), font, font_scale, (10, 10, 10), font_thickness, cv2.LINE_AA)
            except Exception:
                continue
    return frame


def generate_frames():
    global camera_cap, camera_active
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
    while camera_active:
        if camera_cap is None or not camera_cap.isOpened():
            break

        ret, frame = camera_cap.read()
        if not ret:
            time.sleep(0.01)
            continue

        # Flip horizontally for mirror view
        frame = cv2.flip(frame, 1)

        # Run YOLOv8s prediction
        try:
            results = model(frame, conf=0.45, imgsz=640, verbose=False)
        except Exception:
            results = []

        # Draw clean boxes
        try:
            frame = draw_boxes(frame, results)
        except Exception:
            pass

        # Encode as JPEG
        ret2, jpg = cv2.imencode('.jpg', frame, encode_param)
        if not ret2:
            continue
        data = jpg.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + data + b'\r\n')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/start_camera', methods=['POST'])
def start_camera():
    global camera_cap, camera_active
    with camera_lock:
        if camera_active and camera_cap is not None and camera_cap.isOpened():
            return jsonify({'success': True, 'message': 'Camera already running'})

        try:
            camera_cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        except Exception:
            camera_cap = cv2.VideoCapture(0)

        # Set quality
        camera_cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        camera_cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        camera_cap.set(cv2.CAP_PROP_FPS, 30)

        time.sleep(0.5)
        if not camera_cap.isOpened():
            camera_cap = None
            return jsonify({'success': False, 'error': 'Unable to open camera'}), 500

        # warm-up frame
        ret, _ = camera_cap.read()
        if not ret:
            camera_cap.release()
            camera_cap = None
            return jsonify({'success': False, 'error': 'Camera opened but no frame'}), 500

        camera_active = True
        return jsonify({'success': True, 'message': 'Camera started'})


@app.route('/stop_camera', methods=['POST'])
def stop_camera():
    global camera_cap, camera_active
    with camera_lock:
        if camera_cap is not None:
            try:
                camera_cap.release()
            except Exception:
                pass
        camera_cap = None
        camera_active = False
    return jsonify({'success': True, 'message': 'Camera stopped'})


@app.route('/video_feed')
def video_feed():
    if not camera_active:
        return jsonify({'success': False, 'error': 'Camera not started'}), 503
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)


@app.route('/api/screenshot', methods=['POST'])
def api_screenshot():
    try:
        data = request.get_json(force=True)
        imgdata = data.get('image') if data else None
        if not imgdata:
            return jsonify({'success': False, 'error': 'No image data'}), 400

        header, encoded = imgdata.split(',', 1) if ',' in imgdata else (None, imgdata)
        binary = base64.b64decode(encoded)
        screenshots_dir = Path('static/screenshots')
        screenshots_dir.mkdir(parents=True, exist_ok=True)
        fname = datetime.now().strftime('screenshot_%Y%m%d_%H%M%S.jpg')
        fpath = screenshots_dir / fname
        with open(fpath, 'wb') as f:
            f.write(binary)

        return jsonify({'success': True, 'filename': fname, 'path': f'/static/screenshots/{fname}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    print('AFXX Vision AI - running at http://127.0.0.1:5000')
    app.run(host='127.0.0.1', port=5000, debug=True)
