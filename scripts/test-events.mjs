import fs from 'fs';
import path from 'path';

// Read defaultData.ts as text and extract all event imageUrls
const defaultDataFile = fs.readFileSync(path.join(process.cwd(), 'src/lib/defaultData.ts'), 'utf-8');

// Match all event blocks in unverifiedEventsSeed
const eventBlocks = defaultDataFile.slice(
  defaultDataFile.indexOf('const unverifiedEventsSeed: SchoolEvent[] = ['),
  defaultDataFile.indexOf('// --- Real Gallery Images')
);

const imageMatches = [...eventBlocks.matchAll(/imageUrl:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log(`Found ${imageMatches.length} event image references.`);

let missingCount = 0;
imageMatches.forEach(img => {
  const rel = img.startsWith('/') ? img.slice(1) : img;
  const full = path.join(process.cwd(), 'public', rel);
  if (!fs.existsSync(full)) {
    console.error('MISSING IMAGE:', img);
    missingCount++;
  }
});

if (missingCount === 0) {
  console.log('✓ All event images exist on disk in public/ directory!');
} else {
  console.log(`✗ Total missing event images: ${missingCount}`);
}
