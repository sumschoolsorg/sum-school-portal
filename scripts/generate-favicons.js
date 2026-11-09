const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Build an ICO buffer containing multiple PNG images
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let currentOffset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    const w = item.width >= 256 ? 0 : item.width;
    const h = item.height >= 256 ? 0 : item.height;
    entry.writeUInt8(w, 0);
    entry.writeUInt8(h, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // Offset of image data
    entries.push(entry);
    currentOffset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.buffer)]);
}

async function run() {
  const rootDir = path.resolve(__dirname, '..');
  const crestPath = path.join(rootDir, 'public', 'images', 'school-crest.png');
  const publicDir = path.join(rootDir, 'public');
  const appDir = path.join(rootDir, 'src', 'app');

  console.log('Generating crisp circular school crest favicons...');

  const masterSize = 1024;
  // Crest dimensions inside 1024 badge
  const crestWidth = 750;
  const crestHeight = 860;

  const trimmedCrest = await sharp(crestPath)
    .trim()
    .resize(crestWidth, crestHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .toBuffer();

  const svgBase = `
    <svg width="${masterSize}" height="${masterSize}" viewBox="0 0 ${masterSize} ${masterSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="badgeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="#ffffff"/>
          <stop offset="98%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#f1f5f9"/>
        </radialGradient>
      </defs>
      <!-- Outer Navy Ring -->
      <circle cx="512" cy="512" r="506" fill="#1e3a8a"/>
      <!-- Inner Amber Gold Ring -->
      <circle cx="512" cy="512" r="490" fill="#f59e0b"/>
      <!-- Subtle Navy Accent Trim -->
      <circle cx="512" cy="512" r="474" fill="#0f172a"/>
      <!-- Crisp White Badge Background -->
      <circle cx="512" cy="512" r="468" fill="url(#badgeGrad)"/>
    </svg>
  `;

  const baseBadge = await sharp({
    create: {
      width: masterSize,
      height: masterSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: Buffer.from(svgBase),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  const trimmedMeta = await sharp(trimmedCrest).metadata();
  const baseMeta = await sharp(baseBadge).metadata();
  console.log('trimmedMeta:', trimmedMeta.width, trimmedMeta.height);
  console.log('baseMeta:', baseMeta.width, baseMeta.height);

  const leftOffset = Math.max(0, Math.round((baseMeta.width - trimmedMeta.width) / 2));
  const topOffset = Math.max(0, Math.round((baseMeta.height - trimmedMeta.height) / 2));

  const masterComposite = await sharp(baseBadge)
    .composite([
      {
        input: trimmedCrest,
        left: leftOffset,
        top: topOffset,
      },
    ])
    .png()
    .toBuffer();

  const master512 = await sharp(masterComposite)
    .resize(512, 512, { kernel: 'lanczos3' })
    .png()
    .toBuffer();

  // Generate all resolution PNGs with Lanczos3 resampling and subtle sharpening for micro-sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16, sharpen: true },
    { name: 'favicon-32x32.png', size: 32, sharpen: true },
    { name: 'favicon-48x48.png', size: 48, sharpen: false },
    { name: 'apple-touch-icon.png', size: 180, sharpen: false },
    { name: 'icon-192.png', size: 192, sharpen: false },
    { name: 'icon-512.png', size: 512, sharpen: false },
  ];

  const icoBuffers = [];

  for (const item of sizes) {
    let pipeline = sharp(master512).resize(item.size, item.size, { kernel: 'lanczos3' });
    if (item.sharpen) {
      pipeline = pipeline.sharpen({ sigma: 0.8, m1: 1.2, m2: 2.0 });
    }
    const buf = await pipeline.png().toBuffer();
    fs.writeFileSync(path.join(publicDir, item.name), buf);

    if ([16, 32, 48].includes(item.size)) {
      icoBuffers.push({ width: item.size, height: item.size, buffer: buf });
    }
  }

  // Also generate 64, 128, 256 for the multi-size ICO
  for (const s of [64, 128, 256]) {
    const buf = await sharp(master512)
      .resize(s, s, { kernel: 'lanczos3' })
      .png()
      .toBuffer();
    icoBuffers.push({ width: s, height: s, buffer: buf });
  }

  // Sort icoBuffers in ascending size
  icoBuffers.sort((a, b) => a.width - b.width);
  const icoBuffer = createIco(icoBuffers);

  // Write favicon.ico to public and src/app
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);

  // Copy app-specific icons to src/app
  fs.copyFileSync(path.join(publicDir, 'apple-touch-icon.png'), path.join(appDir, 'apple-icon.png'));
  fs.copyFileSync(path.join(publicDir, 'icon-512.png'), path.join(appDir, 'icon.png'));

  console.log('✅ Successfully generated all crisp, high-resolution favicon assets!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
