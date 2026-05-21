const API_BASE = 'http://127.0.0.1:5000';
let currentPage = 'dashboard';
let detectionFilter = 'all';
let cameraActive = false;
let cameraLoaded = false;
let cameraStatusInterval = null;
let cameraLoadTimer = null;
let cameraErrorVisible = false;

window.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    createFloatingParticles();
    initializeCursorTrail();
    document.addEventListener('DOMContentLoaded', () => {
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const snapBtn = document.getElementById('snapBtn');
        const cameraStream = document.getElementById('cameraStream');
        const loader = document.getElementById('cameraLoader');
        const errorBox = document.getElementById('cameraError');
        const fpsEl = document.getElementById('fps');
        const objectCountEl = document.getElementById('objectCount');

        let fpsCounter = { last: performance.now(), frames: 0 };
        let started = false;
        let fpsInterval = null;

        async function startCamera() {
            startBtn.disabled = true;
            loader.style.display = 'flex';
            errorBox.style.display = 'none';
            try {
                const res = await fetch(API_BASE + '/start_camera', { method: 'POST' });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Unable to start camera');
                started = true;
                cameraStream.src = API_BASE + '/video_feed?cachebust=' + Date.now();

                // wait up to 8s for image load, then show error
                const t = setTimeout(() => {
                    if (!cameraStream.complete || cameraStream.naturalWidth === 0) {
                        loader.style.display = 'none';
                        showCameraError('Camera did not respond.');
                    }
                }, 8000);

                cameraStream.onload = () => {
                    loader.style.display = 'none';
                    clearTimeout(t);
                };

                // start fps counter
                if (!fpsInterval) {
                    fpsInterval = setInterval(() => {
                        fpsEl.innerText = fpsCounter.frames.toString();
                        fpsCounter.frames = 0;
                    }, 1000);
                }
            } catch (e) {
                loader.style.display = 'none';
                showCameraError(e.message || String(e));
            } finally {
                startBtn.disabled = false;
            }
        }

        async function stopCamera() {
            stopBtn.disabled = true;
            try {
                await fetch(API_BASE + '/stop_camera', { method: 'POST' });
            } catch (e) {
                console.error(e);
            } finally {
                cameraStream.src = '';
                loader.style.display = 'none';
                started = false;
                stopBtn.disabled = false;
                if (fpsInterval) { clearInterval(fpsInterval); fpsInterval = null; fpsEl.innerText = '0'; }
            }
        }

        function showCameraError(msg) {
            errorBox.innerText = msg;
            errorBox.style.display = 'block';
        }

        startBtn.addEventListener('click', startCamera);
        stopBtn.addEventListener('click', stopCamera);

        cameraStream.addEventListener('load', () => {
            fpsCounter.frames++;
        });

        snapBtn.addEventListener('click', captureScreenshot);

        async function captureScreenshot() {
            try {
                const canvas = document.createElement('canvas');
                const w = cameraStream.naturalWidth || 1280;
                const h = cameraStream.naturalHeight || 720;
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(cameraStream, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                const res = await fetch(API_BASE + '/api/screenshot', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: dataUrl })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Save failed');
                alert('Screenshot saved: ' + data.path);
            } catch (e) {
                alert('Screenshot error: ' + (e.message || e));
            }
        }

        // cursor star trail
        const trail = document.getElementById('cursor-trail');
        function spawnStar(x, y) {
            const s = document.createElement('div'); s.className = 'star';
            s.style.left = (x - 4) + 'px'; s.style.top = (y - 4) + 'px';
            trail.appendChild(s);
            setTimeout(() => { try { s.remove(); } catch(_){} }, 700);
        }
        window.addEventListener('mousemove', (e) => spawnStar(e.clientX, e.clientY));
        window.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) spawnStar(t.clientX, t.clientY); }, { passive: true });
    });

    element.addEventListener('dragleave', event => {
        event.preventDefault();
        element.classList.remove('dragover');
    });
    element.addEventListener('drop', event => {
        event.preventDefault();
        element.classList.remove('dragover');
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            callback(files[0]);
        }
    });
}

function navigateTo(page, event) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(page);
    if (target) target.classList.add('active');
    currentPage = page;

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    document.getElementById('navMenu').classList.remove('active');

    if (page === 'dashboard') loadDashboard();
    if (page === 'history') loadHistory();
    if (page !== 'camera' && cameraActive) {
        stopCamera();
    }
}

async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/api/dashboard`);
        const data = await response.json();
        document.getElementById('totalDetections').textContent = data.total_detections;
        document.getElementById('personCount').textContent = data.class_counts.person || 0;
        document.getElementById('mobileCount').textContent = data.class_counts['cell phone'] || 0;
        document.getElementById('bottleCount').textContent = data.class_counts.bottle || 0;
        document.getElementById('avgConfidence').textContent = `${(data.avg_confidence * 100).toFixed(1)}%`;
        const detectionsList = document.getElementById('detectionsList');
        if (data.recent_logs.length > 0) {
            detectionsList.innerHTML = data.recent_logs.map(log => `
                <div class="detection-item">
                    <div class="detection-item-class">${log.class || log.type}</div>
                    <div class="detection-item-conf">${log.timestamp}</div>
                </div>
            `).join('');
        } else {
            detectionsList.innerHTML = '<p class="empty-state">No detections yet</p>';
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function startCamera() {
    if (cameraActive) return;
    showCameraLoading();
    hideCameraError();
    clearTimeout(cameraLoadTimer);
    cameraLoaded = false;

    try {
        const response = await fetch(`${API_BASE}/api/camera/start`, { method: 'POST' });
        const data = await response.json();
        if (!data.success) {
            showCameraError(data.error || 'Unable to start camera.');
            return;
        }

        const streamImage = document.getElementById('cameraStream');
        streamImage.src = `${API_BASE}/video_feed?cachebust=${Date.now()}`;
        cameraActive = true;

        cameraLoadTimer = setTimeout(() => {
            if (!cameraLoaded) {
                showCameraError('Camera stream did not load within 8 seconds. Please retry.');
            }
        }, 8000);

        if (cameraStatusInterval) clearInterval(cameraStatusInterval);
        cameraStatusInterval = setInterval(updateCameraStatus, 1200);
        showAlert('Camera starting…', 'success');
    } catch (error) {
        console.error('Error starting camera:', error);
        showCameraError('Unable to connect to camera endpoint.');
    }
}

async function stopCamera() {
    if (!cameraActive) {
        clearStreamingImage();
        return;
    }

    cameraActive = false;
    clearTimeout(cameraLoadTimer);
    if (cameraStatusInterval) clearInterval(cameraStatusInterval);
    hideCameraLoading();
    clearStreamingImage();
    updateCameraStats(0, 0);

    try {
        await fetch(`${API_BASE}/api/camera/stop`, { method: 'POST' });
    } catch (error) {
        console.error('Error stopping camera:', error);
    }
    showAlert('Camera stopped', 'warning');
}

function clearStreamingImage() {
    const streamImage = document.getElementById('cameraStream');
    if (streamImage) {
        streamImage.src = '';
    }
}

function showCameraLoading() {
    const loading = document.getElementById('cameraLoading');
    if (loading) loading.classList.add('active');
}

function hideCameraLoading() {
    const loading = document.getElementById('cameraLoading');
    if (loading) loading.classList.remove('active');
}

function showCameraError(message) {
    hideCameraLoading();
    cameraErrorVisible = true;
    cameraActive = false;
    clearStreamingImage();
    if (cameraStatusInterval) clearInterval(cameraStatusInterval);
    fetch(`${API_BASE}/api/camera/stop`, { method: 'POST' }).catch(() => {});
    const errorBox = document.getElementById('cameraError');
    if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = 'flex';
        errorBox.classList.add('active');
    }
}

function hideCameraError() {
    const errorBox = document.getElementById('cameraError');
    if (errorBox) {
        errorBox.style.display = 'none';
        errorBox.classList.remove('active');
    }
}

async function updateCameraStatus() {
    if (!cameraActive) return;
    try {
        const response = await fetch(`${API_BASE}/api/camera/status`);
        const data = await response.json();
        if (data.success && data.status) {
            const { fps, total_objects, alerts } = data.status;
            updateCameraStats(fps, total_objects);
            if (alerts && alerts.length > 0) {
                showAlerts(alerts);
            }
        }
    } catch (error) {
        console.error('Error updating camera status:', error);
    }
}

function updateCameraStats(fps, objectCount) {
    const fpsField = document.getElementById('fps');
    const objectField = document.getElementById('objectCount');
    if (fpsField) fpsField.textContent = fps;
    if (objectField) objectField.textContent = objectCount;
}

function updateRealtimeDetections(detections) {
    const list = document.getElementById('realtimeDetectionsList');
    let filtered = detections;
    if (detectionFilter !== 'all') {
        filtered = detections.filter(d => d.class === detectionFilter);
    }
    if (filtered.length > 0) {
        list.innerHTML = filtered.map(d => `
            <div class="detection-item-full">
                <div class="detection-info">
                    <div class="detection-class">${d.class}</div>
                    <div class="detection-conf">Confidence: ${(d.confidence * 100).toFixed(1)}%</div>
                </div>
                <div class="detection-accuracy">${(d.confidence * 100).toFixed(1)}%</div>
            </div>
        `).join('');
    } else {
        list.innerHTML = '<p class="empty-state">No detections</p>';
    }
}

function setDetectionFilter(filter, event) {
    detectionFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

function captureScreenshot() {
    const streamImage = document.getElementById('cameraStream');
    if (!streamImage || !streamImage.src) {
        showAlert('Camera stream not active. Start camera first.', 'danger');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = streamImage.naturalWidth || 1280;
    canvas.height = streamImage.naturalHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(streamImage, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    fetch(`${API_BASE}/api/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Screenshot saved successfully!', 'success');
        } else {
            showAlert('Failed to save screenshot', 'danger');
        }
    })
    .catch(error => {
        console.error('Error saving screenshot:', error);
        showAlert('Error saving screenshot', 'danger');
    });
}

async function uploadImage(file) {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    document.getElementById('uploadLoading').style.display = 'grid';
    const start = Date.now();
    try {
        const response = await fetch(`${API_BASE}/api/detect/image`, { method: 'POST', body: formData });
        const data = await response.json();
        document.getElementById('uploadLoading').style.display = 'none';
        if (data.success) {
            showUploadResults(data, 'image', ((Date.now() - start) / 1000).toFixed(1));
            showAlert(`Detected ${data.total_objects} objects`, 'success');
        } else {
            showAlert(`Upload failed: ${data.error}`, 'danger');
        }
    } catch (error) {
        document.getElementById('uploadLoading').style.display = 'none';
        console.error('Error uploading image:', error);
        showAlert('Error uploading image', 'danger');
    }
}

async function uploadVideo(file) {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    document.getElementById('uploadLoading').style.display = 'grid';
    const start = Date.now();
    try {
        const response = await fetch(`${API_BASE}/api/detect/video`, { method: 'POST', body: formData });
        const data = await response.json();
        document.getElementById('uploadLoading').style.display = 'none';
        if (data.success) {
            showUploadResults(data, 'video', ((Date.now() - start) / 1000).toFixed(1));
            showAlert(`Processed video - ${data.total_detections} objects detected`, 'success');
        } else {
            showAlert(`Upload failed: ${data.error}`, 'danger');
        }
    } catch (error) {
        document.getElementById('uploadLoading').style.display = 'none';
        console.error('Error uploading video:', error);
        showAlert('Error uploading video', 'danger');
    }
}

function showUploadResults(data, type, duration) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    document.getElementById('resultsDetections').textContent = type === 'image' ? data.total_objects : data.total_detections;
    document.getElementById('resultsTime').textContent = `${duration}s`;

    if (type === 'image') {
        document.getElementById('imageResultsDiv').style.display = 'block';
        document.getElementById('videoResultsDiv').style.display = 'none';
        document.getElementById('originalImage').src = data.original_image;
        document.getElementById('detectedImage').src = data.output_image;
    } else {
        document.getElementById('imageResultsDiv').style.display = 'none';
        document.getElementById('videoResultsDiv').style.display = 'block';
        const video = document.getElementById('processedVideo');
        video.src = data.output_video;
        video.load();
    }

    const detectionsList = document.getElementById('detectionsFull');
    if (data.detections && data.detections.length > 0) {
        detectionsList.innerHTML = '<h4>Detected Objects:</h4>' + data.detections.map(d => `
            <div class="detection-item-full">
                <div class="detection-info">
                    <div class="detection-class">${d.class}</div>
                    <div class="detection-conf">Confidence: ${(d.confidence * 100).toFixed(1)}%</div>
                </div>
                <div class="detection-accuracy">${(d.confidence * 100).toFixed(1)}%</div>
            </div>
        `).join('');
    }
}

async function loadHistory() {
    await loadDetectionLogs();
    await loadScreenshots();
}

async function loadDetectionLogs() {
    try {
        const response = await fetch(`${API_BASE}/api/history`);
        const data = await response.json();
        const logsContainer = document.getElementById('logsContainer');
        if (data.history.length > 0) {
            logsContainer.innerHTML = data.history.map(log => `
                <div class="log-entry">
                    <div class="log-timestamp">${log.timestamp}</div>
                    <div class="log-details">${log.class ? `${log.class} (${(log.confidence * 100).toFixed(1)}%)` : log.type}</div>
                </div>
            `).join('');
        } else {
            logsContainer.innerHTML = '<p class="empty-state">No detection logs</p>';
        }
    } catch (error) {
        console.error('Error loading logs:', error);
    }
}

async function loadScreenshots() {
    try {
        const response = await fetch(`${API_BASE}/api/screenshots`);
        const data = await response.json();
        const grid = document.getElementById('screenshotsGrid');
        if (data.screenshots.length > 0) {
            grid.innerHTML = data.screenshots.map(ss => `
                <div class="screenshot-item">
                    <img src="${ss.path}" alt="Screenshot" class="screenshot-image">
                    <div class="screenshot-info">
                        <div class="screenshot-time">${formatTimestamp(ss.timestamp)}</div>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<p class="empty-state">No screenshots</p>';
        }
    } catch (error) {
        console.error('Error loading screenshots:', error);
    }
}

function switchHistoryTab(tab, event) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    document.getElementById(`${tab}Tab`).classList.add('active');
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alertsContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<div class="alert-message">${message}</div>`;
    container.appendChild(alert);
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 3200);
}

function showAlerts(alerts) {
    alerts.forEach(alert => showAlert(alert.message, alert.type));
}

function formatTimestamp(ts) {
    return ts.replace(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/, '$3/$2/$1 $4:$5:$6');
}
