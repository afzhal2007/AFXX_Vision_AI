@echo off
echo.
echo =========================================================
echo AFXX Vision AI - Quick Start Script
echo =========================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org
    pause
    exit /b 1
)

echo Python version:
python --version
echo.

REM Create virtual environment
echo Creating virtual environment...
if not exist venv (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Start the application
echo.
echo =========================================================
echo Starting AFXX Vision AI...
echo =========================================================
echo.
echo Opening browser at http://127.0.0.1:5000
echo Press CTRL+C to stop the server
echo.

python app.py

pause
