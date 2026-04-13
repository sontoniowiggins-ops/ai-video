// Generate cinematic background images for each scene using pure Node.js
// No external dependencies needed

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const WIDTH = 1920;
const HEIGHT = 1080;
const OUTPUT_DIR = path.join(__dirname, '../public/images');

// Scene colors - cinematic dark gradients [top-color, bottom-color]
const scenes = [
  { file: 'scene-01-scroll.png',       top: [20, 12, 5],    bottom: [60, 40, 15]  }, // warm parchment
  { file: 'scene-02-jerusalem.png',    top: [40, 8, 0],     bottom: [100, 30, 5]  }, // fire/Jerusalem
  { file: 'scene-03-spain.png',        top: [5, 15, 40],    bottom: [15, 35, 80]  }, // deep blue/Spain
  { file: 'scene-04-westafrica.png',   top: [8, 20, 5],     bottom: [25, 55, 15]  }, // deep green/Africa
  { file: 'scene-05-maps.png',         top: [5, 10, 30],    bottom: [10, 25, 60]  }, // navy/maps
  { file: 'scene-06-slavery.png',      top: [5, 3, 3],      bottom: [20, 10, 8]   }, // very dark/heavy
  { file: 'scene-07-deuteronomy.png',  top: [25, 15, 5],    bottom: [70, 45, 10]  }, // dark gold/prophecy
  { file: 'scene-08-americas.png',     top: [8, 5, 25],     bottom: [20, 12, 60]  }, // deep indigo/Americas
];

function writePNG(filePath, pixels) {
  // Build raw image data with filter bytes
  const rowSize = WIDTH * 3;
  const raw = Buffer.alloc((rowSize + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    raw[y * (rowSize + 1)] = 0; // filter: None
    for (let x = 0; x < WIDTH; x++) {
      const src = (y * WIDTH + x) * 3;
      const dst = y * (rowSize + 1) + 1 + x * 3;
      raw[dst]     = pixels[src];
      raw[dst + 1] = pixels[src + 1];
      raw[dst + 2] = pixels[src + 2];
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 1 });

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type);
    const crcBuf = Buffer.concat([typeB, data]);
    const crc = crc32(crcBuf);
    const crcOut = Buffer.alloc(4);
    crcOut.writeUInt32BE(crc >>> 0);
    return Buffer.concat([len, typeB, data, crcOut]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const out = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(filePath, out);
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[i] = c;
}
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF);
}

function makeGradient(top, bottom) {
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let y = 0; y < HEIGHT; y++) {
    const t = y / (HEIGHT - 1);
    const r = Math.round(top[0] + (bottom[0] - top[0]) * t);
    const g = Math.round(top[1] + (bottom[1] - top[1]) * t);
    const b = Math.round(top[2] + (bottom[2] - top[2]) * t);
    for (let x = 0; x < WIDTH; x++) {
      const i = (y * WIDTH + x) * 3;
      pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b;
    }
  }
  return pixels;
}

console.log('Generating scene images...');
for (const scene of scenes) {
  const outPath = path.join(OUTPUT_DIR, scene.file);
  const pixels = makeGradient(scene.top, scene.bottom);
  writePNG(outPath, pixels);
  console.log(`  Created: ${scene.file}`);
}
console.log('Done. All 8 images generated.');
