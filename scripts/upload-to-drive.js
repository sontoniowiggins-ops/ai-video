// scripts/upload-to-drive.js
// Uploads out/return-of-judah.mp4 to Google Drive using a service account.
// Run after render: node scripts/upload-to-drive.js
//
// Required .env variables:
//   GOOGLE_SERVICE_ACCOUNT_KEY_FILE=credentials/service-account.json
//   GOOGLE_DRIVE_FOLDER_ID=your-folder-id-from-drive-url

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const VIDEO_PATH = path.join(__dirname, '..', 'out', 'return-of-judah.mp4');

async function uploadToDrive() {
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!keyFile) {
    console.error('ERROR: GOOGLE_SERVICE_ACCOUNT_KEY_FILE is not set in .env');
    console.error('See credentials/README.md for setup instructions.');
    process.exit(1);
  }

  const keyPath = path.resolve(__dirname, '..', keyFile);
  if (!fs.existsSync(keyPath)) {
    console.error(`ERROR: Service account key not found at: ${keyPath}`);
    console.error('Download your service account JSON from Google Cloud Console.');
    console.error('See credentials/README.md for setup instructions.');
    process.exit(1);
  }

  if (!folderId) {
    console.error('ERROR: GOOGLE_DRIVE_FOLDER_ID is not set in .env');
    console.error('Open your target Drive folder in a browser and copy the ID from the URL.');
    console.error('Example: https://drive.google.com/drive/folders/THIS_PART_IS_THE_ID');
    process.exit(1);
  }

  if (!fs.existsSync(VIDEO_PATH)) {
    console.error(`ERROR: Video not found at ${VIDEO_PATH}`);
    console.error('Render the video first:');
    console.error('  npx remotion render src/index.jsx SephardicYouTube out/return-of-judah.mp4');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

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

  // Make the file viewable by anyone with the link
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
