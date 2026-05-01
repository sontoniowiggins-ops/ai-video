@echo off
title Generate Your Images
color 0A
cls
echo.
echo  ==========================================
echo    RETURN OF JUDAH - Image Generator
echo  ==========================================
echo.
echo  Welcome Elder Wiggins!
echo.
echo  You will need your OpenAI API Key.
echo  It starts with: sk-proj-
echo.
echo  Step 1: Copy your API key from platform.openai.com
echo  Step 2: Come back here and paste it below
echo  Step 3: Press Enter and walk away!
echo.
echo  ==========================================
echo.
set /p "OPENAI_API_KEY=  PASTE YOUR KEY HERE and press Enter: "
echo.

if "%OPENAI_API_KEY%"=="" (
    echo  ERROR: No key entered. Please try again.
    pause
    exit /b
)

if not "%OPENAI_API_KEY:sk-proj=%"=="%OPENAI_API_KEY%" (
    echo  Key looks good! Starting...
) else (
    echo  WARNING: Key doesn't start with sk-proj-
    echo  Make sure you copied the full key.
    echo  Press any key to try anyway, or close this window to cancel.
    pause
)

echo.
echo  ==========================================
echo   Generating your images now...
echo   This will take about 15 minutes.
echo   You will see each image appear below.
echo   DO NOT close this window!
echo  ==========================================
echo.

node scripts/generate-images.js

echo.
if %errorlevel%==0 (
    echo  ==========================================
    echo   SUCCESS! All images have been generated!
    echo   They are saved in: public\images\
    echo
    echo   Next step: Double-click ONE CLICK RENDER.bat
    echo   to build your video!
    echo  ==========================================
) else (
    echo  ==========================================
    echo   Something went wrong.
    echo   Take a photo of this screen and
    echo   send it to Claude.
    echo  ==========================================
)
echo.
pause
