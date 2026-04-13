# Google Drive Service Account Setup

This folder holds your Google service account key file.
**The JSON key file is in .gitignore and will NEVER be committed to GitHub.**

---

## One-Time Setup (15 minutes)

### Step 1 — Create a Google Cloud Project
1. Go to https://console.cloud.google.com
2. Click the project dropdown at the top → "New Project"
3. Name it "Return of Judah" → Create

### Step 2 — Enable the Google Drive API
1. In your project, go to "APIs & Services" → "Enable APIs and Services"
2. Search for "Google Drive API" → Enable it

### Step 3 — Create a Service Account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: "return-of-judah-uploader" → Create and Continue → Done
4. Click the service account you just created
5. Go to the "Keys" tab → "Add Key" → "Create new key" → JSON → Create
6. A JSON file downloads automatically — rename it `service-account.json`
7. Move it into this `credentials/` folder

### Step 4 — Share a Drive Folder with the Service Account
1. Open Google Drive in your browser
2. Create a folder (e.g., "Return of Judah Videos") or use an existing one
3. Right-click the folder → "Share"
4. Open `credentials/service-account.json` and find `"client_email"` — it looks like:
   `return-of-judah-uploader@your-project.iam.gserviceaccount.com`
5. Paste that email into the Share dialog → set role to "Editor" → Send

### Step 5 — Get the Folder ID
1. Open the folder in Drive in your browser
2. The URL looks like: `https://drive.google.com/drive/folders/THIS_IS_YOUR_FOLDER_ID`
3. Copy the ID at the end

### Step 6 — Update Your .env File
Open `.env` (copy from `.env.example` if it doesn't exist) and set:
```
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=credentials/service-account.json
GOOGLE_DRIVE_FOLDER_ID=paste-your-folder-id-here
```

### Step 7 — Verify
```
node scripts/drive-setup-check.js
```
All checks should pass.

---

## Usage
After rendering a video, upload it with:
```
node scripts/upload-to-drive.js
```

Or render + upload in one command:
```
npm run render:upload
```

Or double-click `UPLOAD-TO-DRIVE.bat` on Windows.
