// Generates movie trailer voiceover using OpenAI TTS
// Run: node scripts/generate-voiceover.js
// Requires OPENAI_API_KEY in .env

import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const OUTPUT_DIR = path.join('public', 'audio');

// Exact narration lines from the production plan
// Voice: onyx = deepest, most cinematic OpenAI voice
// Speed: 0.80 = slow, authoritative, movie trailer pacing
const NARRATIONS = [
  {
    filename: 'scene-02.mp3',
    scene: 'Jerusalem 70 AD',
    text: 'In seventy AD… Jerusalem fell. And the children of Judah were taken… into captivity.',
  },
  {
    filename: 'scene-03.mp3',
    scene: 'Spain / Portugal',
    text: 'They were scattered… into Spain… and Portugal… where they lived… until they were driven out again.',
  },
  {
    filename: 'scene-04.mp3',
    scene: 'West Africa',
    text: 'They settled… in the lands beyond the rivers of Ethiopia… where kingdoms rose… and Judah lived among the nations.',
  },
  {
    filename: 'scene-05.mp3',
    scene: 'The Maps',
    text: 'The maps recorded it… Not once… Not twice… But for over two hundred years… Judah… was there.',
  },
  {
    filename: 'scene-06.mp3',
    scene: 'Slavery / Prophecy',
    text: 'And the Lord said… they would go into Egypt again… with ships… and yokes of iron… upon their neck.',
  },
];

async function generateAudio(item, index) {
  const outputPath = path.join(OUTPUT_DIR, item.filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${item.filename} already exists`);
    return;
  }

  console.log(`\n[${index + 1}/${NARRATIONS.length}] ${item.scene}`);
  console.log(`  "${item.text.substring(0, 70)}…"`);

  try {
    const mp3 = await client.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'onyx',     // Deepest, most dramatic voice
      input: item.text,
      speed: 0.80,       // Slow, calm, authoritative — movie trailer pacing
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`  ✓ Saved → ${outputPath}`);

    if (index < NARRATIONS.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (err) {
    console.error(`  ✗ ERROR: ${err.message}`);
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('\nERROR: OPENAI_API_KEY not set.');
    console.error('Run: cp .env.example .env  and add your key.\n');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('╔══════════════════════════════════════╗');
  console.log('║  RETURN OF JUDAH — Voiceover Gen     ║');
  console.log('║  Voice: Onyx  |  Speed: 0.80         ║');
  console.log('╚══════════════════════════════════════╝\n');

  for (let i = 0; i < NARRATIONS.length; i++) {
    await generateAudio(NARRATIONS[i], i);
  }

  console.log('\n✅ All audio files saved to:', OUTPUT_DIR);
  console.log('Next: npm start  →  preview in browser');
}

main();
