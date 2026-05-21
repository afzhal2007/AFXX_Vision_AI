#!/usr/bin/env python3
"""
AFXX Vision AI - Startup Verification Script
This script verifies that all files are in place and helps you start the app
"""

import os
import sys
import subprocess

def check_files():
    """Check if all required files exist"""
    required_files = [
        'app.py',
        'detector.py',
        'requirements.txt',
        'templates/index.html',
        'static/style.css',
        'static/script.js',
        'README.md',
    ]
    
    print("🔍 Checking required files...\n")
    all_exist = True
    
    for file in required_files:
        exists = os.path.exists(file)
        status = "✅" if exists else "❌"
        print(f"  {status} {file}")
        if not exists:
            all_exist = False
    
    return all_exist

def check_python():
    """Check Python version"""
    print(f"\n🐍 Python version: {sys.version}")
    
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print("   ✅ Python version is compatible")
        return True
    else:
        print("   ❌ Python 3.8+ required")
        return False

def check_dependencies():
    """Check if dependencies are installed"""
    print("\n📦 Checking dependencies...\n")
    
    try:
        import flask
        print("   ✅ Flask installed")
    except:
        print("   ❌ Flask not installed - Run: pip install -r requirements.txt")
        return False
    
    try:
        import ultralytics
        print("   ✅ Ultralytics installed")
    except:
        print("   ❌ Ultralytics not installed - Run: pip install -r requirements.txt")
        return False
    
    try:
        import cv2
        print("   ✅ OpenCV installed")
    except:
        print("   ❌ OpenCV not installed - Run: pip install -r requirements.txt")
        return False
    
    return True

def main():
    print("=" * 60)
    print("AFXX Vision AI - Startup Verification")
    print("=" * 60)
    print()
    
    # Check files
    if not check_files():
        print("\n❌ Some required files are missing!")
        sys.exit(1)
    
    # Check Python
    if not check_python():
        print("\n❌ Python version requirement not met!")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        print("\n⚠️  Installing dependencies...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
            print("\n✅ Dependencies installed successfully!")
        except:
            print("\n❌ Failed to install dependencies")
            sys.exit(1)
    
    # All checks passed
    print("\n" + "=" * 60)
    print("✅ All checks passed! Ready to start AFXX Vision AI")
    print("=" * 60)
    print()
    
    # Ask to start
    print("Starting AFXX Vision AI...\n")
    print("🚀 Application will start at: http://127.0.0.1:5000")
    print("📖 Check README.md for documentation")
    print("💡 Use QUICKREF.md for quick reference")
    print()
    print("Press CTRL+C to stop the server\n")
    
    try:
        # Import and run Flask app
        from app import app
        
        app.run(
            host='127.0.0.1',
            port=5000,
            debug=True,
            threaded=True
        )
    
    except Exception as e:
        print(f"\n❌ Error starting application: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
