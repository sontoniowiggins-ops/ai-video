@echo off
title Image Test
echo.
echo  Opening image test in your browser...
echo  You should see your images load directly.
echo  If they show = images are working in Remotion
echo  If you get an error = server issue
echo.
start http://localhost:3000/images/scene-02-jerusalem.png
timeout /t 2 /nobreak >nul
start http://localhost:3000/images/scene-04-westafrica.png
echo.
pause
