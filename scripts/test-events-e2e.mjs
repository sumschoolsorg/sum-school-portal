import fs from 'fs';
import path from 'path';
import http from 'http';

console.log('=====================================================');
console.log('  SCHOOL EVENTS & ACTIVITIES: END-TO-END AUDIT SUITE');
console.log('=====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

// TEST 1: Inspect defaultEvents in source
console.log('--- TEST 1: Event Data & Public Assets Integrity ---');
const defaultDataCode = fs.readFileSync(path.join(process.cwd(), 'src/lib/defaultData.ts'), 'utf-8');
const eventMatch = defaultDataCode.match(/const unverifiedEventsSeed: SchoolEvent\[] = (\[[\s\S]*?\n];)/);
assert(eventMatch && eventMatch[1], 'unverifiedEventsSeed defined in defaultData.ts');

const imageRegex = /imageUrl:\s*["']([^"']+)["']/g;
const eventBlock = defaultDataCode.slice(
  defaultDataCode.indexOf('const unverifiedEventsSeed: SchoolEvent[] = ['),
  defaultDataCode.indexOf('// --- Real Gallery Images')
);

const images = [...eventBlock.matchAll(imageRegex)].map((m) => m[1]);
assert(images.length > 0, `Found ${images.length} event images`);

let missingImages = 0;
images.forEach((img) => {
  const rel = img.startsWith('/') ? img.slice(1) : img;
  const fullPath = path.join(process.cwd(), 'public', rel);
  if (!fs.existsSync(fullPath)) {
    console.error(`    Missing asset: ${img}`);
    missingImages++;
  }
});
assert(missingImages === 0, `All ${images.length} event images exist on disk in public/`);

// TEST 2: Verify events layout & metadata
console.log('\n--- TEST 2: SEO Layout & Metadata ---');
const layoutPath = path.join(process.cwd(), 'src/app/events/layout.tsx');
assert(fs.existsSync(layoutPath), 'events/layout.tsx exists');
const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
assert(layoutContent.includes('School Events & Academic Calendar'), 'Has SEO title in layout');
assert(layoutContent.includes('canonical'), 'Has canonical link configured');
assert(layoutContent.includes('BreadcrumbJsonLd'), 'Has Breadcrumb Schema.org structured data');

// TEST 3: Verify Public Page Features
console.log('\n--- TEST 3: Events Page Logic & Accessibility ---');
const pagePath = path.join(process.cwd(), 'src/app/events/page.tsx');
const pageContent = fs.readFileSync(pagePath, 'utf-8');

assert(pageContent.includes('useState<SchoolEvent[]>(defaultEvents)'), 'Initialized with defaultEvents fallback');
assert(pageContent.includes('ACADEMIC_YEAR_OPTIONS'), 'Uses 41-year ACADEMIC_YEAR_OPTIONS dropdown');
assert(pageContent.includes('titleTa') && pageContent.includes('descTa'), 'Bilingual Tamil & English search filter support');
assert(pageContent.includes('onError'), 'Event card image has onError fallback safety');
assert(pageContent.includes('activeModalEvent'), 'Interactive detail modal supported');

// TEST 4: Live HTTP Server Endpoint Test
console.log('\n--- TEST 4: Live Dev Server HTTP Verification ---');

function checkEndpoint(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, html: data });
      });
    }).on('error', (err) => {
      resolve({ statusCode: 500, error: err.message });
    });
  });
}

const eventsRes = await checkEndpoint('/events');
assert(eventsRes.statusCode === 200, 'GET /events returns HTTP 200 OK');
assert(eventsRes.html.includes('School Events &amp; Activities') || eventsRes.html.includes('School Events & Activities'), 'Renders H1 "School Events & Activities"');
assert(eventsRes.html.includes('S.U.M. SCHOOLS'), 'Header branding displays "S.U.M. SCHOOLS"');

const adminEventsRes = await checkEndpoint('/admin/events');
assert(adminEventsRes.statusCode === 200, 'GET /admin/events returns HTTP 200 OK');

console.log('\n=====================================================');
console.log(`  E2E TEST SUMMARY: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('=====================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
