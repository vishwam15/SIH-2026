@echo off
title DisasterShield AI - Master Launcher
echo =====================================================================
echo       DISASTERSHIELD AI (SIH 2026) - MASTER SYSTEM LAUNCHER
echo =====================================================================
echo.
echo [1/3] Launching FastAPI Python Backend on http://localhost:8000 ...
start "DisasterShield FastAPI (Port 8000)" cmd /k "start_backend.bat"

echo [2/3] Launching Node.js Express Backend on http://localhost:5002 ...
start "DisasterShield Node Server (Port 5002)" cmd /k "start_node_server.bat"

echo [3/3] Launching Vite Frontend on http://localhost:5173 ...
start "DisasterShield Frontend (Vite)" cmd /k "npm run dev"

echo.
echo =====================================================================
echo  All 3 services launched in dedicated terminal windows!
echo.
echo  * Frontend Web App:        http://localhost:5173
echo  * FastAPI Swagger Docs:    http://localhost:8000/docs
echo  * FastAPI Health:          http://localhost:8000/api/v1/health
echo  * Node.js Server Status:   http://localhost:5002/api/status
echo  * Node.js Health:          http://localhost:5002/health
echo  * Live Telemetry Mesh:     http://localhost:8000/api/v1/live-telemetry-mesh
echo =====================================================================
timeout /t 5
