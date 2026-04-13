// scripts/upload-to-drive.js
// Uploads out/return-of-judah.mp4 to Google Drive using OAuth2.
// First-time setup: node scripts/drive-auth.js
// Then upload any time: node scripts/upload-to-drive.js

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const VIDEO_PATH = path.join(__dirname, '..', 'out', 'return-of-judah.mp4');

async function uploadToDrive() {
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const folderId     = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error('ERROR: Google Drive credentials missing from .env');
    console.error('Run this first:  node scripts/drive-auth.js');
    process.exit(1);
  }

  if (!folderId) {
    console.error('ERROR: GOOGLE_DRIVE_FOLDER_ID is not set in .env');
    console.error('Open your Drive folder in a browser and copy the ID from the URL.');
    console.error('Example URL: https://drive.google.com/drive/folders/COPY_THIS_PART');
    process.exit(1);
  }

  if (!fs.existsSync(VIDEO_PATH)) {
    console.error('ERROR: Video not found. Render it first:');
    console.error('  npx remotion render src/index.jsx SephardicYouTube out/return-of-judah.mp4');
    process.exit(1);
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: 'v3', auth });

  const fileSize = fs.statSync(VIDEO_PATH).size;
  const sizeMB = (fileSize / 1024 / 1024).toFixed(1);
  const datestamp = new Date().toISOString().slice(0, 10);
  const fileName = `return-of-judah-${datestamp}.mp4`;

  console.log(`Uploading ${fileName} (${sizeMB} MB) to Google Drive...`);

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: 'video/mp4',
      parents: [folderId],
    },
    media: {
      mimeType: 'video/mp4',
      body: fs.createReadStream(VIDEO_PATH),
    },
    fields: 'id,name,webViewLink',
  });

  const file = response.data;

  // Make file viewable by anyone with the link
  await drive.permissions.create({
    fileId: file.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  console.log('');
  console.log('Upload complete!');
  console.log(`  File : ${file.name}`);
  console.log(`  Link : ${file.webViewLink}`);
  console.log('');
}

uploadToDrive().catch(err => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
