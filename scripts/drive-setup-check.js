// scripts/drive-setup-check.js
// Run this to verify your Google Drive OAuth2 is configured correctly.
// Usage: node scripts/drive-setup-check.js

const { google } = require('googleapis');
require('dotenv').config();

async function check() {
  let passed = 0;
  let failed = 0;

  function ok(msg)   { console.log(`  [OK]   ${msg}`); passed++; }
  function fail(msg) { console.log(`  [FAIL] ${msg}`); failed++; }
  function info(msg) { console.log(`         ${msg}`); }

  console.log('\n=== Google Drive Setup Check ===\n');

  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const folderId     = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (clientId)     { ok('.env has GOOGLE_CLIENT_ID'); }
  else              { fail('GOOGLE_CLIENT_ID not set — run: node scripts/drive-auth.js'); }

  if (clientSecret) { ok('.env has GOOGLE_CLIENT_SECRET'); }
  else              { fail('GOOGLE_CLIENT_SECRET not set — run: node scripts/drive-auth.js'); }

  if (refreshToken) { ok('.env has GOOGLE_REFRESH_TOKEN'); }
  else              { fail('GOOGLE_REFRESH_TOKEN not set — run: node scripts/drive-auth.js'); }

  if (folderId)     { ok('.env has GOOGLE_DRIVE_FOLDER_ID'); }
  else              { fail('GOOGLE_DRIVE_FOLDER_ID not set in .env'); info('Open your Drive folder in browser and copy the ID from the URL'); }

  if (clientId && clientSecret && refreshToken && folderId) {
    try {
      const auth = new google.auth.OAuth2(clientId, clientSecret);
      auth.setCredentials({ refresh_token: refreshToken });
      const drive = google.drive({ version: 'v3', auth });
      const res = await drive.files.list({ q: `'${folderId}' in parents`, pageSize: 1, fields: 'files(id)' });
      ok(`Connected to Google Drive folder (${res.data.files.length} file(s) found)`);
    } catch (err) {
      fail(`Could not connect to Drive: ${err.message}`);
    }
  }

  console.log('');
  console.log(`Result: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('\nAll checks passed! Ready to upload with:');
    console.log('  node scripts/upload-to-drive.js');
  } else {
    console.log('\nFix the issues above, then run this check again.');
  }
  console.log('');
}

check().catch(err => {
  console.error('Check failed:', err.message);
  process.exit(1);
});
