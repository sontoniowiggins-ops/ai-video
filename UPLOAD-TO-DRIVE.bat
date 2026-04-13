@echo off
title Return of Judah - Upload to Google Drive
color 0A
echo.
echo ========================================
echo   Return of Judah - Google Drive Upload
echo ========================================
echo.

:: Check that Node is available
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Install it from nodejs.org
    pause
    exit /b 1
)

:: Run the upload script
node scripts/upload-to-drive.js

if %errorlevel% neq 0 (
    echo.
    echo Upload failed. Check the error above.
    echo Run "node scripts/drive-setup-check.js" to diagnose.
    pause
    exit /b 1
)

echo.
pause
