// Generates movie trailer voiceover using OpenAI TTS
// Run: node scripts/generate-voiceover.js
// Requires OPENAI_API_KEY in .env

import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OUTPUT_DIR = path.join('public', 'audio');

// Narration lines for each scene — deep, slow, dramatic delivery
// Voice: "onyx" = the deepest, most cinematic OpenAI voice
// Speed: 0.82 = slightly slower than normal for trailer feel
const NARRATIONS = [
  {
    filename: 'scene-01.mp3',
    text: 'In 70 AD... the city fell. Jerusalem was consumed by fire. And the children of Judah... were taken.',
  },
  {
    filename: 'scene-02.mp3',
    text: 'Bound in chains... they were driven across the sea... and unloaded on the shores of Iberia.',
  },
  {
    filename: 'scene-03.mp3',
    text: 'But they did not break. For centuries... they built. They remembered who they were.',
  },
  {
    filename: 'scene-04.mp3',
    text: 'Then came the Inquisition. A scribe lifted his pen... and with one word... erased a people from their own history.',
  },
  {
    filename: 'scene-05.mp3',
    text: 'But the prophecy did not end in captivity. It was never meant to. It ends... with return.',
  },
];

async function generateAudio(item, index) {
  const outputPath = path.join(OUTPUT_DIR, item.filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${item.filename} already exists`);
    return;
  }

  console.log(`\n[${index + 1}/${NARRATIONS.length}] Generating: ${item.filename}`);
  console.log(`  "${item.text.substring(0, 60)}..."`);

  try {
    const mp3 = await client.audio.speech.create({
      model: 'tts-1-hd',     // HD quality
      voice: 'onyx',          // Deepest, most dramatic voice
      input: item.text,
      speed: 0.82,            // Slower = more cinematic/trailer feel
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`  Saved to ${outputPath}`);

    // Small pause between requests
    if (index < NARRATIONS.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (err) {
    console.error(`  ERROR generating ${item.filename}:`, err.message);
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY not found in .env file');
    console.error('Create a .env file with: OPENAI_API_KEY=your-key-here');
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('=== Sephardic History — Voiceover Generator ===');
  console.log('Voice: Onyx (deep, dramatic movie trailer)');
  console.log(`Generating ${NARRATIONS.length} audio clips...\n`);

  for (let i = 0; i < NARRATIONS.length; i++) {
    await generateAudio(NARRATIONS[i], i);
  }

  console.log('\n=== Done! ===');
  console.log(`All audio saved to: ${OUTPUT_DIR}`);
  console.log('Next step: run "npm start" to preview the video in your browser');
}

main();
