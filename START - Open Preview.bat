@echo off
title RETURN OF JUDAH - Preview
color 0A
echo.
echo  ==========================================
echo    RETURN OF JUDAH - Live Preview
echo  ==========================================
echo.
echo  Welcome Elder Wiggins!
echo.
echo  Step 1: Getting Claude's latest updates...
git pull
echo.
echo  Step 2: Installing any new packages...
npm install --legacy-peer-deps
echo.
echo  Step 3: Starting live preview...
echo  Your browser will open automatically.
echo  DO NOT close this window!
echo.
start "Image Server" /min cmd /k "node image-server.js"
timeout /t 3 /nobreak >nul
start http://localhost:3000
call npm start
pause
