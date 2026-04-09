@echo off
title Finding your images and rendering...
color 0A
echo.
echo  ==========================================
echo    Searching for your images...
echo  ==========================================
echo.

set "DEST=%~dp0public\images"
set "FOUND=0"

REM Search all old project folders in Downloads
for /d %%F in ("%USERPROFILE%\Downloads\ai-video-claude-sephardic-history-prompts*") do (
    if exist "%%F\public\images\scene-02-jerusalem.png" (
        echo  Found images in %%F
        copy "%%F\public\images\scene-*.png" "%DEST%\" >nul 2>&1
        copy "%%F\public\images\scene-*.jpg" "%DEST%\" >nul 2>&1
        set "FOUND=1"
    )
    if exist "%%F\public\images\scene-02-jerusalem.jpg" (
        echo  Found images in %%F
        copy "%%F\public\images\scene-*.jpg" "%DEST%\" >nul 2>&1
        set "FOUND=1"
    )
    if exist "%%F\public\images\scene-04-westafrica.png" (
        echo  Found images in %%F
        copy "%%F\public\images\scene-*.png" "%DEST%\" >nul 2>&1
        copy "%%F\public\images\scene-*.jpg" "%DEST%\" >nul 2>&1
        set "FOUND=1"
    )
)

if "%FOUND%"=="1" (
    echo.
    echo  Images copied! Starting render now...
    echo.
    start "Image Server" /min cmd /k "node image-server.js"
    timeout /t 3 /nobreak >nul
    npx remotion render src/index.jsx SephardicYouTube out/youtube.mp4
    echo.
    if %errorlevel%==0 (
        echo  ==========================================
        echo    DONE! Video saved to: out\youtube.mp4
        echo  ==========================================
        start "" "%~dp0out"
    ) else (
        echo  Something went wrong. See error above.
    )
) else (
    echo.
    echo  Could not find images automatically.
    echo  Opening images folder - please drag your images in manually.
    echo.
    start "" "%DEST%"
)
echo.
pause
