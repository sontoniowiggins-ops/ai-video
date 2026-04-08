// Generates one image at a time using DALL-E 3
// Run: node scripts/generate-images.js
// Requires OPENAI_API_KEY in .env

import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OUTPUT_DIR = path.join('public', 'images');

// All scene image prompts — edit these to adjust each scene
const IMAGES = [
  {
    filename: 'scene-00-scroll.png',
    prompt:
      'Ancient worn parchment scroll, Hebrew-style script visible, realistic ink texture, ' +
      'warm golden light from the side, deep shadows, dust particles in air, cinematic slow ' +
      'pan composition, sacred tone, no fantasy glow, photorealistic texture, aged fibers, ' +
      'historical authenticity, 8k detail, wide cinematic landscape orientation',
  },
  {
    filename: 'scene-01-capture.png',
    prompt:
      'Ultra-realistic cinematic film still, 70 AD destruction of Jerusalem, Roman soldiers ' +
      'in armor surrounding captured Black Hebrew men and women, African phenotype (deep brown ' +
      'to dark skin tones, not ambiguous), ancient Hebrew clothing in earth tones (linen robes, ' +
      'head coverings), emotional expressions of fear, exhaustion, and captivity, smoke and fire ' +
      'in background, burning city, ash in air, dramatic lighting with orange fire glow and dark ' +
      'shadows, high detail skin texture, cinematic depth of field, slight motion blur for realism, ' +
      'handheld camera feel, gritty historical realism, no fantasy, no stylization, looks like a ' +
      'scene from a historical war film, 8k detail, natural lighting, realistic proportions, serious ' +
      'tone, documentary style, not artistic painting, not cartoon',
  },
  {
    filename: 'scene-02-arrival.png',
    prompt:
      'Ultra-realistic cinematic film still, 1st century AD, dark-skinned Hebrew prisoners ' +
      '(African phenotype, deep brown to dark skin tones) arriving chained on a Roman cargo ' +
      'ship at an Iberian coastline, iron shackles on wrists and necks, being watched by ' +
      'dark-complexioned Phoenician-Jewish merchants already settled on shore, Mediterranean ' +
      'coast at golden hour, warm amber and orange light on dark skin, wooden dock and Roman ' +
      'vessel in background, ocean waves, worn linen clothing and sandals, expressions of ' +
      'exhaustion and uncertainty, high detail skin texture, cinematic depth of field, ' +
      'handheld camera feel, gritty historical realism, no stylization, looks like a scene ' +
      'from a historical epic film, 8k detail, documentary style, serious tone',
  },
  {
    filename: 'scene-03-flourishing.png',
    prompt:
      'Ultra-realistic cinematic film still, 12th century medieval Iberia, prosperous ' +
      'dark-skinned Jewish nobleman (African phenotype, deep brown to dark skin tone) standing ' +
      'in a stone palace courtyard, wearing fine robes in deep burgundy and gold trim, Hebrew ' +
      'manuscripts open on a carved wooden table beside him, Portuguese stone arched architecture, ' +
      'warm afternoon sunlight through stone windows casting long shadows, dignified and confident ' +
      'expression, gold ring and bracelet visible, beard well-groomed, high detail skin texture, ' +
      'cinematic depth of field, slight background bokeh, looks like a scene from a historical ' +
      'prestige drama, 8k detail, documentary style, no fantasy elements, serious tone',
  },
  {
    filename: 'scene-04-reclassification.png',
    prompt:
      'Ultra-realistic cinematic film still, 15th century Spanish Inquisition era royal court, ' +
      'a solemn dark-skinned Sephardic elder (African phenotype, deep brown skin tone) standing ' +
      'before Spanish court officials dressed in black robes and white collars, a scribe seated ' +
      'at a heavy oak desk writing the word "Negro" in a large leather ledger, stone throne room ' +
      'with high vaulted ceilings, torchlight casting dramatic shadows, chiaroscuro lighting with ' +
      'deep blacks and warm amber, the elder\'s expression dignified but grave, tension visible ' +
      'between figures, high detail skin texture, cinematic depth of field, handheld camera feel, ' +
      'gritty historical realism, looks like a scene from a historical drama film, 8k detail, ' +
      'documentary style, serious tone',
  },
  {
    filename: 'scene-05-sunset.png',
    prompt:
      'Ultra-realistic cinematic film still, golden sunset over a calm ocean, silhouettes of ' +
      'several people standing on a rocky coastline looking toward the horizon, dramatic warm ' +
      'orange and amber sky with low clouds, light reflecting off the water, hopeful and ' +
      'redemptive atmosphere, cinematic wide angle composition, no faces visible, symbolic, ' +
      'documentary style, 8k detail, serious tone, photorealistic',
  },
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateImage(item, index) {
  const outputPath = path.join(OUTPUT_DIR, item.filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${item.filename} already exists`);
    return;
  }

  console.log(`\n[${index + 1}/${IMAGES.length}] Generating: ${item.filename}`);
  console.log('  Sending to DALL-E 3...');

  try {
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: item.prompt,
      n: 1,
      size: '1792x1024', // 16:9 — best for both YouTube and TikTok (crop for vertical)
      quality: 'hd',
      style: 'natural',  // natural = photorealistic, not painterly
    });

    const imageUrl = response.data[0].url;
    console.log(`  Downloading...`);
    await downloadImage(imageUrl, outputPath);
    console.log(`  Saved to ${outputPath}`);

    // Pause between requests to avoid rate limits
    if (index < IMAGES.length - 1) {
      console.log('  Waiting 3 seconds before next image...');
      await new Promise((r) => setTimeout(r, 3000));
    }
  } catch (err) {
    console.error(`  ERROR generating ${item.filename}:`, err.message);
    if (err.status === 400) {
      console.error('  DALL-E rejected this prompt. Try rephrasing it.');
    }
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

  console.log('=== Sephardic History — Image Generator ===');
  console.log(`Generating ${IMAGES.length} images, one at a time...\n`);

  for (let i = 0; i < IMAGES.length; i++) {
    await generateImage(IMAGES[i], i);
  }

  console.log('\n=== Done! ===');
  console.log(`All images saved to: ${OUTPUT_DIR}`);
  console.log('Next step: run "npm run generate:voice" to create the voiceover');
}

main();
