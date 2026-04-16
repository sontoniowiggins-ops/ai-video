// scripts/drive-auth.js
// Run this ONE TIME to connect your Google account.
// Usage: node scripts/drive-auth.js
//
// After this runs successfully, upload-to-drive.js will work automatically.

const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const ENV_PATH = path.join(__dirname, '..', '.env');

async function question(rl, prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('');
  console.log('=== Google Drive One-Time Setup ===');
  console.log('');
  console.log('You need a Client ID and Client Secret from Google Cloud Console.');
  console.log('');
  console.log('How to get them:');
  console.log('  1. Go to console.cloud.google.com');
  console.log('  2. APIs & Services → Credentials');
  console.log('  3. Click "+ CREATE CREDENTIALS" → "OAuth client ID"');
  console.log('  4. Application type: Desktop app');
  console.log('  5. Name: Return of Judah');
  console.log('  6. Click CREATE');
  console.log('  7. Copy the Client ID and Client Secret shown');
  console.log('');

  const clientId     = await question(rl, 'Paste your Client ID here:     ');
  const clientSecret = await question(rl, 'Paste your Client Secret here: ');

  const auth = new google.auth.OAuth2(
    clientId.trim(),
    clientSecret.trim(),
    'urn:ietf:wg:oauth:2.0:oob'
  );

  const authUrl = auth.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  console.log('');
  console.log('Now open this URL in your browser:');
  console.log('');
  console.log(authUrl);
  console.log('');
  console.log('Sign in with your Google account → click Allow → copy the code shown.');
  console.log('');

  const code = await question(rl, 'Paste the code here: ');
  rl.close();

  const { tokens } = await auth.getToken(code.trim());

  if (!tokens.refresh_token) {
    console.error('');
    console.error('ERROR: No refresh token received.');
    console.error('Go to https://myaccount.google.com/permissions and remove');
    console.error('"Return of Judah", then run this script again.');
    process.exit(1);
  }

  // Save credentials to .env
  let env = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';

  const vars = {
    GOOGLE_CLIENT_ID:     clientId.trim(),
    GOOGLE_CLIENT_SECRET: clientSecret.trim(),
    GOOGLE_REFRESH_TOKEN: tokens.refresh_token,
  };

  for (const [key, value] of Object.entries(vars)) {
    if (env.match(new RegExp(`^${key}=`, 'm'))) {
      env = env.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=${value}`);
    } else {
      env += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(ENV_PATH, env.trim() + '\n');

  console.log('');
  console.log('Done! Credentials saved to .env');
  console.log('');
  console.log('Now set your Drive folder ID in .env:');
  console.log('  GOOGLE_DRIVE_FOLDER_ID=paste-your-folder-id-here');
  console.log('');
  console.log('Then upload any time with:');
  console.log('  node scripts/upload-to-drive.js');
  console.log('');
}

main().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
