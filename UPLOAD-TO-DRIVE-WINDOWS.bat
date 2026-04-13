@echo off
title Return of Judah - Upload to Google Drive
color 0A

echo.
echo ==========================================
echo   Return of Judah - Upload to Google Drive
echo ==========================================
echo.

:: Check Node is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed.
    echo Download it from https://nodejs.org and install it first.
    pause
    exit /b 1
)

:: Read credentials from drive-credentials.env
set GOOGLE_CLIENT_ID=
set GOOGLE_CLIENT_SECRET=
set GOOGLE_REFRESH_TOKEN=
set GOOGLE_DRIVE_FOLDER_ID=

if not exist "%~dp0drive-credentials.env" (
    echo ERROR: drive-credentials.env not found.
    echo.
    echo Create a file called drive-credentials.env in this folder with:
    echo   GOOGLE_CLIENT_ID=your-client-id
    echo   GOOGLE_CLIENT_SECRET=your-client-secret
    echo   GOOGLE_REFRESH_TOKEN=your-refresh-token
    echo   GOOGLE_DRIVE_FOLDER_ID=your-folder-id
    pause
    exit /b 1
)

for /f "tokens=1,2 delims==" %%a in (%~dp0drive-credentials.env) do (
    set %%a=%%b
)

if "%GOOGLE_CLIENT_ID%"=="" (
    echo ERROR: GOOGLE_CLIENT_ID missing from drive-credentials.env
    pause
    exit /b 1
)

:: Run the upload
node -e "
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const FOLDER_ID     = process.env.GOOGLE_DRIVE_FOLDER_ID;

const locations = [
  path.join(os.homedir(), 'Downloads', 'return-of-judah.mp4'),
  path.join(process.cwd(), 'out', 'return-of-judah.mp4'),
  path.join(process.cwd(), 'return-of-judah.mp4'),
];

let videoPath = null;
for (const loc of locations) {
  if (fs.existsSync(loc)) { videoPath = loc; break; }
}

if (!videoPath) {
  console.error('ERROR: return-of-judah.mp4 not found.');
  console.error('Download it from http://192.168.1.216:8080/return-of-judah.mp4 first.');
  process.exit(1);
}

const sizeMB = (fs.statSync(videoPath).size / 1024 / 1024).toFixed(1);
console.log('Found: ' + videoPath + ' (' + sizeMB + ' MB)');

function post(hostname, path, data) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams(data).toString();
    const req = https.request({ hostname, path, method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

async function main() {
  console.log('Getting access token...');
  const tokenRes = await post('oauth2.googleapis.com', '/token', {
    client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN, grant_type: 'refresh_token'
  });

  if (!tokenRes.access_token) {
    console.error('ERROR: Could not get access token:', JSON.stringify(tokenRes));
    process.exit(1);
  }

  const token = tokenRes.access_token;
  const datestamp = new Date().toISOString().slice(0, 10);
  const fileName = 'return-of-judah-' + datestamp + '.mp4';
  console.log('Uploading ' + fileName + '...');

  const meta = JSON.stringify({ name: fileName, mimeType: 'video/mp4', parents: [FOLDER_ID] });
  const fileSize = fs.statSync(videoPath).size;

  const fileData = await new Promise((resolve, reject) => {
    const initReq = https.request({
      hostname: 'www.googleapis.com',
      path: '/upload/drive/v3/files?uploadType=resumable&fields=id,webViewLink',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(meta),
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': fileSize
      }
    }, res => {
      if (res.statusCode !== 200) {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => reject(new Error('Init failed ' + res.statusCode + ': ' + d)));
        return;
      }
      const uploadUrl = res.headers.location;
      const uploadHost = new URL(uploadUrl).hostname;
      const uploadPath = uploadUrl.replace('https://' + uploadHost, '');
      const uploadReq = https.request({
        hostname: uploadHost, path: uploadPath, method: 'PUT',
        headers: { 'Content-Type': 'video/mp4', 'Content-Length': fileSize }
      }, res2 => {
        let d = ''; res2.on('data', c => d += c);
        res2.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(new Error(d)); } });
      });
      uploadReq.on('error', reject);
      fs.createReadStream(videoPath).pipe(uploadReq);
    });
    initReq.on('error', reject);
    initReq.write(meta); initReq.end();
  });

  if (!fileData.id) { console.error('Upload failed:', JSON.stringify(fileData)); process.exit(1); }

  const permBody = JSON.stringify({ role: 'reader', type: 'anyone' });
  await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/drive/v3/files/' + fileData.id + '/permissions',
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(permBody) }
    }, res => { res.on('data', () => {}); res.on('end', resolve); });
    req.on('error', reject);
    req.write(permBody); req.end();
  });

  console.log('');
  console.log('Done!');
  console.log('File: ' + fileData.name || fileName);
  console.log('Link: ' + fileData.webViewLink);
  console.log('');
}

main().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
"

if %errorlevel% neq 0 (
    echo.
    echo Upload failed.
    pause
    exit /b 1
)

pause
