# HOW TO SET UP GOOGLE DRIVE UPLOAD
# Do this ONE TIME. Then videos upload automatically.

================================================================
PART 1 — GET YOUR CLIENT ID AND SECRET (4 steps)
================================================================

STEP 1: Go to console.cloud.google.com
   Sign in with your Google account.
   Make sure "My First Project" is selected at the top.

----------------------------------------------------------------

STEP 2: Create an OAuth Client ID
   - Tap the three lines (menu) top left
   - Tap "APIs & Services"
   - Tap "Credentials"
   - Tap "+ CREATE CREDENTIALS" near the top
   - Choose "OAuth client ID"

   NOTE: If it asks you to configure a Consent Screen first,
   tap "Configure Consent Screen" and follow STEP 2B below.
   Otherwise skip to STEP 3.

----------------------------------------------------------------

STEP 2B (only if asked): Set up the Consent Screen
   - Choose "External" → CREATE
   - App name: Return of Judah
   - User support email: (your email)
   - Scroll to the bottom → Developer contact: (your email)
   - Tap SAVE AND CONTINUE
   - Tap SAVE AND CONTINUE again (skip Scopes)
   - Tap ADD USERS → add your own Gmail address → ADD
   - Tap SAVE AND CONTINUE → BACK TO DASHBOARD
   - Now go back to Credentials and do STEP 2 again

----------------------------------------------------------------

STEP 3: Create the OAuth Client ID
   - Application type: choose "Desktop app"
   - Name: Return of Judah
   - Tap CREATE
   - A popup shows your Client ID and Client Secret
   - COPY BOTH — you will need them in STEP 5

----------------------------------------------------------------

STEP 4: Create a Google Drive folder
   - Go to drive.google.com
   - Create a new folder called "Return of Judah Videos"
   - Open that folder
   - Look at the browser address bar:
     https://drive.google.com/drive/folders/COPY_THIS_PART
   - Copy the ID at the end of the URL

================================================================
PART 2 — RUN THE SETUP SCRIPT ON YOUR COMPUTER (1 step)
================================================================

STEP 5: Open a terminal/command prompt in the ai-video folder
   and run:

   node scripts/drive-auth.js

   It will ask you to paste:
     - Your Client ID   (from STEP 3)
     - Your Client Secret (from STEP 3)

   Then it gives you a URL. Open that URL in your browser,
   sign in with your Google account, click Allow, copy the code,
   paste it back in the terminal.

   Done. Your credentials are saved automatically.

----------------------------------------------------------------

STEP 6: Add your folder ID to .env
   Open the .env file in Notepad and find this line:
     GOOGLE_DRIVE_FOLDER_ID=

   Paste the folder ID you copied in STEP 4 after the = sign.
   Save the file.

================================================================
YOU ARE DONE WITH SETUP
================================================================

To upload a video to Drive, double-click:
   UPLOAD-TO-DRIVE.bat

Or run in terminal:
   node scripts/upload-to-drive.js
