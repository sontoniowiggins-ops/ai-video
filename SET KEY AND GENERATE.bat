@echo off
title Generate Images - API Key Setup
color 0A
echo.
echo  ==========================================
echo    IMAGE GENERATOR - API KEY SETUP
echo  ==========================================
echo.
echo  Paste your OpenAI API key below and press Enter.
echo  (It starts with sk-proj-)
echo.
set /p OPENAI_API_KEY=  API Key:
echo.
echo  Starting image generation...
echo  This will take about 15 minutes.
echo  DO NOT close this window.
echo.
node scripts/generate-images.js
echo.
echo  ==========================================
if %errorlevel%==0 (
    echo    DONE! Check your public\images folder.
) else (
    echo    Something went wrong. See error above.
)
echo  ==========================================
echo.
pause
