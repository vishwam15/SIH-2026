@echo off
echo ===================================================
echo Starting Urban Flood Nowcasting API Backend
echo ===================================================

SET "PYTHON_DIR=C:\Users\comp\AppData\Local\Python\pythoncore-3.14-64"
SET "PATH=%PYTHON_DIR%;%PYTHON_DIR%\Scripts;%PATH%"

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
