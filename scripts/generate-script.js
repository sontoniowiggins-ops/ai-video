// Generates documentary narration script using Claude (Anthropic API)
// Run: node scripts/generate-script.js
// Requires ANTHROPIC_API_KEY in .env

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  'You are a documentary scriptwriter specializing in historical narratives. ' +
  'Write powerful, concise narration for a documentary about the Sephardic Hebrew history — ' +
  'the journey of the children of Judah from Jerusalem through Spain, West Africa, and into the slave trade. ' +
  'Keep narration slow, authoritative, and emotionally resonant. ' +
  'Each line should work as standalone movie-trailer voiceover text.';

const SCENES = [
  {
    key: 'scene-01',
    title: 'Opening — The Prophecy',
    context: 'A parchment scroll with Hebrew script, warm candlelight, sacred atmosphere',
    maxWords: 20,
  },
  {
    key: 'scene-02',
    title: 'Jerusalem 70 AD',
    context: 'Jerusalem burning, Hebrew men in chains being led away by Roman soldiers',
    maxWords: 25,
  },
  {
    key: 'scene-03',
    title: 'Spain / Portugal — The Expulsion',
    context: 'Hebrew scholars expelled from Spain, families boarding wooden ships at the dock',
    maxWords: 30,
  },
  {
    key: 'scene-04',
    title: 'West Africa — The Kingdoms',
    context: 'A West African king on his throne, a thriving kingdom, Hebrew people among the nations',
    maxWords: 30,
  },
  {
    key: 'scene-05',
    title: 'The Ancient Maps',
    context: 'Old maps clearly labelled "Juda", "Kingdom of Judah", "Iudeorum Terra" in West Africa',
    maxWords: 25,
  },
  {
    key: 'scene-06',
    title: 'Slavery — The Prophecy Fulfilled',
    context: 'Iron yokes, slave ships, Deuteronomy 28 — Egypt again with ships, yokes of iron',
    maxWords: 35,
  },
];

async function generateNarration(scene) {
  const prompt =
    `Write a single narration line for this documentary scene.\n\n` +
    `Scene: ${scene.title}\n` +
    `Visual context: ${scene.context}\n` +
    `Maximum words: ${scene.maxWords}\n` +
    `Style: Slow, dramatic, movie trailer pacing — use "…" for dramatic pauses.\n\n` +
    `Output ONLY the narration text, nothing else.`;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = response.content.find((b) => b.type === 'text');
    return block ? block.text.trim() : null;

  } catch (err) {
    if (err instanceof Anthropic.PermissionDeniedError) {
      // HTTP 403 — request reached the server but was refused
      console.error('\n  ERROR 403 — Permission denied. Possible causes:');
      console.error('    • Anthropic Console balance is $0 (the API is prepaid, not subscription)');
      console.error('    • This model is not enabled for your account tier');
      console.error('    • Your IP/region is blocked by Anthropic');
      console.error('  Fix: https://console.anthropic.com/settings/billing');
    } else if (err instanceof Anthropic.NotFoundError) {
      // HTTP 404 — wrong model name or endpoint URL
      console.error('\n  ERROR 404 — Model or endpoint not found. Possible causes:');
      console.error('    • Typo in the model ID (e.g. "claude-3.5-sonnet" with a dot is wrong)');
      console.error('    • Deprecated model ID no longer available');
      console.error('  Fix: Use an exact ID from https://docs.anthropic.com/en/docs/about-claude/models');
      console.error('  Current model in use: claude-opus-4-6');
    } else if (err instanceof Anthropic.AuthenticationError) {
      // HTTP 401 — bad or missing API key
      console.error('\n  ERROR 401 — Invalid API key.');
      console.error('  Fix: Check ANTHROPIC_API_KEY in your .env file.');
      console.error('  Keys look like: sk-ant-api03-...');
    } else if (err instanceof Anthropic.RateLimitError) {
      // HTTP 429 — too many requests
      console.error('\n  ERROR 429 — Rate limit hit. Wait a moment and try again.');
    } else {
      console.error(`\n  ERROR: ${err.message}`);
    }
    return null;
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('\nERROR: ANTHROPIC_API_KEY is not set.');
    console.error('Steps:');
    console.error('  1. cp .env.example .env');
    console.error('  2. Add your key: ANTHROPIC_API_KEY=sk-ant-api03-...');
    console.error('  3. Get a key at https://console.anthropic.com/\n');
    process.exit(1);
  }

  console.log('╔══════════════════════════════════════╗');
  console.log('║  RETURN OF JUDAH — Script Generator  ║');
  console.log('║  Model: claude-opus-4-6               ║');
  console.log('╚══════════════════════════════════════╝\n');

  const results = {};
  let successCount = 0;

  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    process.stdout.write(`[${i + 1}/${SCENES.length}] ${scene.title}… `);

    const narration = await generateNarration(scene);

    if (narration) {
      results[scene.key] = narration;
      console.log(`\n  ✓  "${narration}"`);
      successCount++;
    } else {
      console.log('\n  ✗  Failed — see error above');
    }

    // Respect rate limits between requests
    if (i < SCENES.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (successCount === 0) {
    console.error('\n✗ No narrations generated. Fix the errors above and retry.');
    process.exit(1);
  }

  const outputPath = 'scripts/generated-narrations.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n✅ ${successCount}/${SCENES.length} narrations saved to ${outputPath}`);
  console.log('\nPaste these into the NARRATIONS array in scripts/generate-voiceover.js');
  console.log('to regenerate the audio with the new text.\n');
}

main();
