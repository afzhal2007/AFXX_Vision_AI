import os
os.environ.setdefault('YOLO_VERBOSE', '0')

import cv2
import numpy as np
from ultralytics import YOLO
import cvzone
import math
import time
from collections import defaultdict

class YOLODetector:
    def __init__(self, model_path='yolov8s.pt'):
        self.model_path = self._locate_model(model_path)
        self.model = YOLO(self.model_path, verbose=False)

        self.class_names = [
            'person', 'bicycle', 'car', 'motorbike', 'aeroplane', 'bus', 'train', 'truck',
            'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench',
            'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra',
            'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
            'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove',
            'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup',
            'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
            'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'sofa',
            'pottedplant', 'bed', 'diningtable', 'toilet', 'tvmonitor', 'laptop', 'mouse',
            'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
            'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier',
            'toothbrush'
        ]

        self.track_history = defaultdict(list)
        self.prev_time = time.time()
        self.detection_history = []
        self.max_history = 1000

    def _locate_model(self, model_path):
        candidates = [model_path, 'yolov8s.pt', 'yolov8n.pt']
        for candidate in candidates:
            if os.path.exists(candidate):
                return candidate
        return model_path

    def detect_frame(self, frame, conf_threshold=0.35, imgsz=640, filter_class=None):
        results = self.model(frame, stream=True, conf=conf_threshold, imgsz=imgsz, verbose=False, show=False)

        detections = []
        alerts = []
        knife_detected = False
        person_detected = False

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                w, h = x2 - x1, y2 - y1
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                current_class = self.class_names[cls]

                if conf >= conf_threshold:
                    if current_class == 'knife':
                        knife_detected = True
                    if current_class == 'person':
                        person_detected = True

                    if filter_class is None or current_class == filter_class:
                        detection = {
                            'class': current_class,
                            'confidence': conf,
                            'bbox': [x1, y1, x2, y2],
                            'width': w,
                            'height': h,
                            'center': [x1 + w // 2, y1 + h // 2]
                        }
                        detections.append(detection)

        if knife_detected:
            alerts.append({'type': 'danger', 'message': '⚠️ KNIFE DETECTED - SECURITY ALERT!'})
        if person_detected:
            alerts.append({'type': 'warning', 'message': '👤 Person detected'})

        current_time = time.time()
        fps = 1 / (current_time - self.prev_time) if self.prev_time != 0 else 0
        self.prev_time = current_time

        annotated_frame = frame.copy()
        for detection in detections:
            x1, y1, x2, y2 = detection['bbox']
            cvzone.cornerRect(annotated_frame, (x1, y1, detection['width'], detection['height']), l=20, rt=3)
            label = f"{detection['class']} {detection['confidence']:.2f}"
            cvzone.putTextRect(
                annotated_frame,
                label,
                (max(0, x1), max(35, y1)),
                scale=1,
                thickness=2,
                offset=8
            )

        cvzone.putTextRect(
            annotated_frame,
            f"AFXX Vision AI | FPS: {int(fps)} | Objects: {len(detections)}",
            (20, 40),
            scale=1.5,
            thickness=2,
            offset=10
        )

        return {
            'frame': annotated_frame,
            'detections': detections,
            'fps': fps,
            'total_objects': len(detections),
            'alerts': alerts,
            'knife_detected': knife_detected,
            'person_detected': person_detected
        }

    def detect_image(self, image_path, conf_threshold=0.35, filter_class=None):
        frame = cv2.imread(image_path)
        if frame is None:
            return {'error': 'Could not read image'}
        return self.detect_frame(frame, conf_threshold, 640, filter_class)

    def detect_video(self, video_path, conf_threshold=0.35):
        cap = cv2.VideoCapture(video_path)
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            result = self.detect_frame(frame, conf_threshold, 640)
            frames.append(result)
        cap.release()
        return frames

    def add_to_history(self, detections, class_name=None):
        for detection in detections:
            if class_name is None or detection['class'] == class_name:
                entry = {
                    'class': detection['class'],
                    'confidence': detection['confidence'],
                    'timestamp': time.time()
                }
                self.detection_history.append(entry)
        if len(self.detection_history) > self.max_history:
            self.detection_history = self.detection_history[-self.max_history:]

    def get_detection_stats(self):
        stats = {'total_detections': len(self.detection_history), 'class_counts': defaultdict(int), 'avg_confidence': 0}
        if not self.detection_history:
            return stats
        total_conf = 0
        for entry in self.detection_history:
            stats['class_counts'][entry['class']] += 1
            total_conf += entry['confidence']
        stats['avg_confidence'] = total_conf / len(self.detection_history)
        stats['class_counts'] = dict(stats['class_counts'])
        return stats
