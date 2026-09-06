@echo off
echo ===================================================
echo Testing Urban Flood Hydraulic Engine & Safe Routing
echo ===================================================

SET "PYTHON_DIR=C:\Users\comp\AppData\Local\Python\pythoncore-3.14-64"
SET "PATH=%PYTHON_DIR%;%PYTHON_DIR%\Scripts;%PATH%"

python test_backend.py
pause
