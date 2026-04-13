// scripts/drive-setup-check.js
// Run this to verify your Google Drive service account is configured correctly.
// Usage: node scripts/drive-setup-check.js

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function check() {
  let passed = 0;
  let failed = 0;

  function ok(msg)   { console.log(`  [OK]   ${msg}`); passed++; }
  function fail(msg) { console.log(`  [FAIL] ${msg}`); failed++; }
  function info(msg) { console.log(`         ${msg}`); }

  console.log('\n=== Google Drive Setup Check ===\n');

  // 1. Check env vars
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (keyFile) {
    ok('.env has GOOGLE_SERVICE_ACCOUNT_KEY_FILE');
  } else {
    fail('GOOGLE_SERVICE_ACCOUNT_KEY_FILE not set in .env');
    info('Add: GOOGLE_SERVICE_ACCOUNT_KEY_FILE=credentials/service-account.json');
  }

  if (folderId) {
    ok('.env has GOOGLE_DRIVE_FOLDER_ID');
  } else {
    fail('GOOGLE_DRIVE_FOLDER_ID not set in .env');
    info('Open target Drive folder in browser and copy the ID from the URL');
  }

  // 2. Check key file exists
  if (keyFile) {
    const keyPath = path.resolve(__dirname, '..', keyFile);
    if (fs.existsSync(keyPath)) {
      ok(`Service account key file found: ${keyFile}`);
      // 3. Try authenticating
      try {
        const auth = new google.auth.GoogleAuth({
          keyFile: keyPath,
          scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        if (token.token) {
          ok('Service account authentication successful');
        } else {
          fail('Authentication returned no token');
        }
      } catch (err) {
        fail(`Authentication failed: ${err.message}`);
        info('Check that the Drive API is enabled in Google Cloud Console');
      }

      // 4. Try listing the target folder
      if (folderId) {
        try {
          const auth = new google.auth.GoogleAuth({
            keyFile: keyPath,
            scopes: ['https://www.googleapis.com/auth/drive.file'],
          });
          const drive = google.drive({ version: 'v3', auth });
          const res = await drive.files.list({
            q: `'${folderId}' in parents`,
            pageSize: 1,
            fields: 'files(id,name)',
          });
          ok(`Drive folder is accessible (${res.data.files.length} file(s) visible)`);
        } catch (err) {
          fail(`Cannot access Drive folder: ${err.message}`);
          info('Make sure you shared the folder with the service account email.');
          info('Find the email in your service-account.json under "client_email".');
        }
      }
    } else {
      fail(`Key file not found: ${keyPath}`);
      info('Download the service account JSON from Google Cloud Console');
      info('and place it at the path above.');
    }
  }

  console.log('');
  console.log(`Result: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('\nAll checks passed! Ready to upload with:');
    console.log('  node scripts/upload-to-drive.js');
  } else {
    console.log('\nFix the issues above, then run this check again.');
    console.log('See credentials/README.md for full setup instructions.');
  }
  console.log('');
}

check().catch(err => {
  console.error('Check failed unexpectedly:', err.message);
  process.exit(1);
});
