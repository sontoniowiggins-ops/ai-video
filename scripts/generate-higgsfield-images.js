// Generates all 6 scene images using Higgsfield Soul 2.0
// Run: npm run generate:higgsfield-images
// Requires HIGGSFIELD_API_KEY in .env
// Get key: https://platform.higgsfield.ai → API Keys

import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const API_BASE = 'https://platform.higgsfield.ai';
const OUTPUT_DIR = path.join('public', 'images');

const STYLE_LOCK =
  'ultra-realistic cinematic film still, 8k detail, photorealistic, ' +
  'African phenotype, deep brown to dark skin tones, ' +
  'no painting, no illustration, no cartoon, no fantasy, no AI smoothness, ' +
  'film grain, professional color grading, serious tone, documentary style, ' +
  'wide cinematic composition, 16:9 aspect ratio';

const SCENES = [
  {
    filename: 'scene-01-scroll.png',
    name: 'Opening — Parchment Scroll',
    prompt:
      'Ancient worn parchment scroll laying on a dark wooden table, ' +
      'Hebrew-style script clearly visible, aged ink, frayed edges, realistic fiber texture, ' +
      'warm golden side lighting, deep shadows, dust particles floating in air, ' +
      'shallow depth of field, dramatic cinematic lighting, no glow effects, ' +
      'historically grounded, sacred atmosphere, extremely detailed, ' + STYLE_LOCK,
  },
  {
    filename: 'scene-02-jerusalem.png',
    name: 'The Capture — 70 AD Jerusalem',
    prompt:
      'Ultra-realistic cinematic film still, 70 AD destruction of Jerusalem, Roman soldiers ' +
      'in armor surrounding captured Black Hebrew men and women, African phenotype (deep brown ' +
      'to dark skin tones), ancient Hebrew clothing in earth tones (linen robes, head coverings), ' +
      'emotional expressions of fear, exhaustion, and captivity, smoke and fire in background, ' +
      'burning city, ash in air, dramatic lighting with orange fire glow and dark shadows, ' +
      'high detail skin texture, cinematic depth of field, slight motion blur for realism, ' +
      'handheld camera feel, gritty historical realism, no fantasy, ' +
      'looks like a scene from a historical war film, ' + STYLE_LOCK,
  },
  {
    filename: 'scene-03-spain.png',
    name: 'Arrival in Sepharad — Iberian Coast',
    prompt:
      'Ultra-realistic cinematic film still, 1st century AD, dark-skinned Hebrew prisoners ' +
      '(African phenotype, deep brown to dark skin tones) arriving chained on a Roman cargo ' +
      'ship at an Iberian coastline, iron shackles on wrists and necks, ' +
      'Mediterranean coast at golden hour, warm amber and orange light on dark skin, ' +
      'wooden dock and Roman vessel in background, ocean waves, worn linen clothing and sandals, ' +
      'expressions of exhaustion and uncertainty, high detail skin texture, ' +
      'cinematic depth of field, handheld camera feel, gritty historical realism, ' + STYLE_LOCK,
  },
  {
    filename: 'scene-04-westafrica.png',
    name: 'Settlement — West African Kingdoms',
    prompt:
      'Ultra-realistic cinematic film still, 15th century West African kingdom, ' +
      'dark-skinned Hebrew-descended community (African phenotype, deep brown skin tones) ' +
      'living prosperously, grand mud-brick palace architecture in Mali or Songhai style, ' +
      'market with vibrant textiles and gold, elders wearing fine robes, dignified expressions, ' +
      'warm golden hour light, dust in the air, rich cultural scene, ' +
      'documentary camera angle, high detail skin texture, ' + STYLE_LOCK,
  },
  {
    filename: 'scene-05-maps.png',
    name: 'Historical Maps — Judah Documented',
    prompt:
      'Ultra-realistic close-up of aged historical European maps from the 16th-17th century, ' +
      'parchment texture, handwritten labels clearly reading IUDA and REGNO DE IUDA ' +
      'on the West African coastline near Guinea, compass roses, Latin text, ' +
      'aged cartography ink on cream parchment, dramatic side lighting revealing texture, ' +
      'deep shadows, dust and age patina, cinematic macro photography, ' +
      '8k detail, photorealistic texture, scholarly and solemn tone, documentary style',
  },
  {
    filename: 'scene-06-slavery.png',
    name: 'Slavery Prophecy — Iron Yokes and Ships',
    prompt:
      'Ultra-realistic cinematic film still, Black enslaved men with deep brown skin, African phenotype, ' +
      'heavy iron yokes around their necks, thick chains on wrists and ankles, ' +
      'being loaded onto a large wooden slave ship at a West African coastal dock, ' +
      'ocean waves in background, overcast sky, harsh cold lighting, ' +
      'expressions of exhaustion, pain, and resistance, ' +
      'cold blue-gray color grading, cinematic close-up on faces and iron, ' +
      'historically grounded, emotional realism, ' + STYLE_LOCK,
  },
];

async function poll(generationId, headers, maxWaitMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(`${API_BASE}/v1/generations/${generationId}`, { headers });
    if (!res.ok) { process.stdout.write('.'); continue; }
    const data = await res.json();
    if (data.status === 'completed' && data.output_url) return data.output_url;
    if (data.status === 'failed') throw new Error(`Generation failed: ${data.error || 'unknown'}`);
    process.stdout.write('.');
  }
  throw new Error('Timed out waiting for generation (2 min)');
}

async function downloadFile(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  fs.writeFileSync(filepath, Buffer.from(await res.arrayBuffer()));
}

async function generateImage(scene, index, total, headers) {
  const outputPath = path.join(OUTPUT_DIR, scene.filename);
  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${scene.filename} already exists`);
    return;
  }

  console.log(`\n[${index + 1}/${total}] ${scene.name}`);
  console.log('  Sending to Higgsfield Soul 2.0…');

  const res = await fetch(`${API_BASE}/v1/text2image/soul`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: scene.prompt,
      size: '2048x1152',
      quality: 'high',
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }

  const json = await res.json();
  const generationId = json.generation_id || json.id;

  // Some endpoints return the URL immediately; others require polling
  let imageUrl = json.output_url || json.image_url || json.url;
  if (!imageUrl) {
    console.log(`  Waiting for generation (id: ${generationId})…`);
    imageUrl = await poll(generationId, headers);
  }

  console.log('\n  Downloading…');
  await downloadFile(imageUrl, outputPath);
  console.log(`  ✓ Saved → ${outputPath}`);
}

async function main() {
  if (!process.env.HIGGSFIELD_API_KEY) {
    console.error('\nERROR: HIGGSFIELD_API_KEY not set.');
    console.error('Run: cp .env.example .env  and add your key.');
    console.error('Get your key at: https://platform.higgsfield.ai → API Keys\n');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const headers = { Authorization: `Bearer ${process.env.HIGGSFIELD_API_KEY}` };

  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  RETURN OF JUDAH — Higgsfield Image Generator  ║');
  console.log(`║  Generating ${SCENES.length} cinematic scenes via Soul 2.0    ║`);
  console.log('╚════════════════════════════════════════════════╝\n');

  let success = 0;
  let failed = 0;

  for (let i = 0; i < SCENES.length; i++) {
    try {
      await generateImage(SCENES[i], i, SCENES.length, headers);
      success++;
    } catch (err) {
      console.error(`\n  ✗ ERROR on ${SCENES[i].filename}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n════════════════════════════════════════════════');
  console.log(`✅ Done: ${success} generated, ${failed} failed`);
  console.log(`Images saved to: ${OUTPUT_DIR}`);
  if (success > 0) console.log('Next: npm run generate:higgsfield-video  →  animate each scene');
}

main();
