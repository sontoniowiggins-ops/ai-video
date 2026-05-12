// Animates scene images into 5-second video clips using Higgsfield DoP (image-to-video)
// Run: npm run generate:higgsfield-video
// Requires HIGGSFIELD_API_KEY in .env AND image-server.js running on port 3001
// Run first: node image-server.js  (in a separate terminal)

import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const API_BASE = 'https://platform.higgsfield.ai';
const IMAGES_DIR = path.join('public', 'images');
const VIDEOS_DIR = path.join('public', 'videos');
const IMAGE_SERVER_URL = 'http://localhost:3001';

// Slow, atmospheric motion per scene — documentary feel, no fast movement
const SCENE_MOTIONS = {
  'scene-01-scroll.png': {
    output: 'scene-01-scroll.mp4',
    name: 'Opening Scroll',
    motion:
      'Slow cinematic zoom into the ancient parchment scroll, ' +
      'gentle dust particles drifting in golden light, camera slowly pushes forward, ' +
      'atmospheric and sacred, no sudden movement',
  },
  'scene-02-jerusalem.png': {
    output: 'scene-02-jerusalem.mp4',
    name: 'Fall of Jerusalem',
    motion:
      'Slow dolly left across the captivity scene, ' +
      'smoke and embers drifting in air, fire flickering in background, ' +
      'camera moves through chaos slowly, heavy and emotional atmosphere',
  },
  'scene-03-spain.png': {
    output: 'scene-03-spain.mp4',
    name: 'Arrival in Sepharad',
    motion:
      'Slow push toward the ship and dock, ocean waves gently moving, ' +
      'chained figures standing still, heavy atmosphere, ' +
      'late golden hour light shifting slowly across the scene',
  },
  'scene-04-westafrica.png': {
    output: 'scene-04-westafrica.mp4',
    name: 'West African Kingdoms',
    motion:
      'Gentle pan across the marketplace and palace, ' +
      'warm golden light with dust particles in air, ' +
      'people slowly moving in background, dignified and cinematic',
  },
  'scene-05-maps.png': {
    output: 'scene-05-maps.mp4',
    name: 'Historical Maps',
    motion:
      'Slow cinematic zoom into the map revealing the label JUDA on the West African coast, ' +
      'parchment texture filling the frame, candlelight flickering at edges, ' +
      'scholarly and reverent, slow reveal',
  },
  'scene-06-slavery.png': {
    output: 'scene-06-slavery.mp4',
    name: 'Slavery Prophecy',
    motion:
      'Slow drift forward toward the iron yokes and chained figures, ' +
      'cold blue-gray atmosphere, waves crashing in background, ' +
      'heavy and mournful, no fast movement',
  },
};

async function poll(generationId, headers, maxWaitMs = 180000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await fetch(`${API_BASE}/v1/generations/${generationId}`, { headers });
    if (!res.ok) { process.stdout.write('.'); continue; }
    const data = await res.json();
    if (data.status === 'completed' && data.output_url) return data.output_url;
    if (data.status === 'failed') throw new Error(`Generation failed: ${data.error || 'unknown'}`);
    process.stdout.write('.');
  }
  throw new Error('Timed out waiting for video generation (3 min)');
}

async function downloadFile(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  fs.writeFileSync(filepath, Buffer.from(await res.arrayBuffer()));
}

async function generateVideo(imageFile, sceneData, index, total, headers) {
  const outputPath = path.join(VIDEOS_DIR, sceneData.output);
  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${sceneData.output} already exists`);
    return;
  }

  const imageUrl = `${IMAGE_SERVER_URL}/images/${imageFile}`;
  console.log(`\n[${index + 1}/${total}] ${sceneData.name}`);
  console.log(`  Source: ${imageUrl}`);
  console.log('  Sending to Higgsfield DoP (image-to-video)…');

  const res = await fetch(`${API_BASE}/v1/image2video/dop`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: sceneData.motion,
      image_url: imageUrl,
      duration: 5,
      aspect_ratio: '16:9',
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }

  const json = await res.json();
  const generationId = json.generation_id || json.id;

  let videoUrl = json.output_url || json.video_url || json.url;
  if (!videoUrl) {
    console.log(`  Waiting for video (id: ${generationId})…`);
    videoUrl = await poll(generationId, headers);
  }

  console.log('\n  Downloading…');
  await downloadFile(videoUrl, outputPath);
  console.log(`  ✓ Saved → ${outputPath}`);
}

async function main() {
  if (!process.env.HIGGSFIELD_API_KEY) {
    console.error('\nERROR: HIGGSFIELD_API_KEY not set.');
    console.error('Run: cp .env.example .env  and add your key.');
    console.error('Get your key at: https://platform.higgsfield.ai → API Keys\n');
    process.exit(1);
  }

  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  const headers = { Authorization: `Bearer ${process.env.HIGGSFIELD_API_KEY}` };

  const sceneFiles = Object.keys(SCENE_MOTIONS).filter((f) =>
    fs.existsSync(path.join(IMAGES_DIR, f))
  );

  if (sceneFiles.length === 0) {
    console.error(`\nERROR: No scene images found in ${IMAGES_DIR}`);
    console.error('Run: npm run generate:higgsfield-images  first\n');
    process.exit(1);
  }

  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  RETURN OF JUDAH — Higgsfield Video Generator  ║');
  console.log(`║  Animating ${sceneFiles.length} scenes via DoP image-to-video     ║`);
  console.log('╚════════════════════════════════════════════════╝');
  console.log('\nNOTE: image-server.js must be running on port 3001');
  console.log('      In a separate terminal: node image-server.js\n');

  let success = 0;
  let failed = 0;

  for (let i = 0; i < sceneFiles.length; i++) {
    const imageFile = sceneFiles[i];
    try {
      await generateVideo(imageFile, SCENE_MOTIONS[imageFile], i, sceneFiles.length, headers);
      success++;
    } catch (err) {
      console.error(`\n  ✗ ERROR on ${imageFile}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n════════════════════════════════════════════════');
  console.log(`✅ Done: ${success} videos generated, ${failed} failed`);
  console.log(`Videos saved to: ${VIDEOS_DIR}`);
}

main();
