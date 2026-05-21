#!/bin/bash

echo ""
echo "==========================================================="
echo "AFXX Vision AI - Quick Start Script"
echo "==========================================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3 from https://www.python.org"
    exit 1
fi

echo "Python version:"
python3 --version
echo ""

# Create virtual environment
echo "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo ""

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
echo ""

# Start the application
echo ""
echo "==========================================================="
echo "Starting AFXX Vision AI..."
echo "==========================================================="
echo ""
echo "Opening browser at http://127.0.0.1:5000"
echo "Press CTRL+C to stop the server"
echo ""

python3 app.py
