@echo off
title DisasterShield Node.js Backend (Port 5002)
echo ===================================================
echo Starting DisasterShield Express / Socket.IO Server
echo ===================================================

cd /d "%~dp0server"
node server.js
pause
