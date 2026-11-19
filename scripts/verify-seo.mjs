import fs from 'fs';

const pages = [
  { name: 'Home', file: '.next/server/app/index.html' },
  { name: 'About', file: '.next/server/app/about.html' },
  { name: 'Academics', file: '.next/server/app/academics.html' },
  { name: 'Admissions', file: '.next/server/app/admissions.html' },
  { name: 'Contact', file: '.next/server/app/contact.html' },
  { name: 'Transport', file: '.next/server/app/transport.html' },
  { name: 'Results', file: '.next/server/app/results.html' },
];

console.log('=== SEO OUTPUT VERIFICATION ===\n');

for (const p of pages) {
  if (!fs.existsSync(p.file)) {
    console.log(`[-] ${p.name}: File ${p.file} not found`);
    continue;
  }
  const html = fs.readFileSync(p.file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || 'MISSING';
  const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || 'MISSING';
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || 'MISSING';
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] || 'MISSING';
  const schemaCount = (html.match(/application\/ld\+json/g) || []).length;

  console.log(`[+] Route: ${p.name}`);
  console.log(`    Title:     ${title}`);
  console.log(`    Desc:      ${desc.slice(0, 90)}...`);
  console.log(`    Canonical: ${canonical}`);
  console.log(`    OG Image:  ${ogImage}`);
  console.log(`    Schemas:   ${schemaCount} JSON-LD blocks`);
  console.log('');
}
