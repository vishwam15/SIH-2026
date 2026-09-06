@echo off
title DisasterShield AI - Master Launcher
echo =====================================================================
echo       DISASTERSHIELD AI (SIH 2026) - MASTER SYSTEM LAUNCHER
echo =====================================================================
echo.
echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "DisasterShield Backend (FastAPI)" cmd /k "start_backend.bat"

echo [2/2] Launching Vite Frontend on http://localhost:5173 ...
start "DisasterShield Frontend (Vite)" cmd /k "npm run dev"

echo.
echo =====================================================================
echo  Both services launched in dedicated terminal windows!
echo.
echo  * Frontend Web App:     http://localhost:5173
echo  * Backend API Health:   http://localhost:8000/api/v1/health
echo  * Swagger API Docs:     http://localhost:8000/docs
echo  * Live Telemetry Mesh:  http://localhost:8000/api/v1/live-telemetry-mesh
echo =====================================================================
timeout /t 5
