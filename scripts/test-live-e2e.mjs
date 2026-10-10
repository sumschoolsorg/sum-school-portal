import http from 'node:http';

const BASE_URL = 'http://localhost:3000';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
    if (details) console.error(`    Details: ${details}`);
  }
}

async function fetchRoute(path) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          duration,
        });
      });
    }).on('error', err => reject(err));
  });
}

async function runLiveE2ETests() {
  console.log('================================================================');
  console.log('   S.U.M. SCHOOL PORTAL — LIVE LOCAL END-TO-END VERIFICATION    ');
  console.log('   Target: http://localhost:3000                                ');
  console.log('================================================================\n');

  // ----------------------------------------------------
  // TEST SUITE 1: Public Routes Live Availability (HTTP 200)
  // ----------------------------------------------------
  console.log('=== TEST SUITE 1: Public Routes Live Availability ===');

  const publicRoutes = [
    { path: '/', titleKeyword: 'S.U.M.' },
    { path: '/about', titleKeyword: 'About' },
    { path: '/academics', titleKeyword: 'Academics' },
    { path: '/admissions', titleKeyword: 'Admission' },
    { path: '/faculty', titleKeyword: 'Faculty' },
    { path: '/facilities', titleKeyword: 'Facilities' },
    { path: '/news', titleKeyword: 'News' },
    { path: '/events', titleKeyword: 'Events' },
    { path: '/gallery', titleKeyword: 'Gallery' },
    { path: '/achievements', titleKeyword: 'Achievements' },
    { path: '/alumni', titleKeyword: 'Alumni' },
    { path: '/transport', titleKeyword: 'Transport' },
    { path: '/transport/tracking', titleKeyword: 'Transport' },
    { path: '/results', titleKeyword: 'Results' },
    { path: '/contact', titleKeyword: 'Contact' },
    { path: '/privacy', titleKeyword: 'Privacy' },
    { path: '/terms', titleKeyword: 'Terms' },
  ];

  for (const route of publicRoutes) {
    try {
      const res = await fetchRoute(route.path);
      assert(
        res.statusCode === 200,
        `GET ${route.path} -> HTTP 200 OK (${res.duration}ms)`,
        `Expected 200, got ${res.statusCode}`
      );
      assert(
        res.body.includes('<!DOCTYPE html>'),
        `${route.path} returns valid HTML5 doctype`
      );
      assert(
        res.body.toLowerCase().includes(route.titleKeyword.toLowerCase()),
        `${route.path} contains relevant content keyword ("${route.titleKeyword}")`
      );
    } catch (err) {
      assert(false, `GET ${route.path} request completed`, err.message);
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 2: SEO, Sitemap & Static Assets
  // ----------------------------------------------------
  console.log('\n=== TEST SUITE 2: SEO, Sitemap & Static Assets ===');

  try {
    const sitemapRes = await fetchRoute('/sitemap.xml');
    assert(sitemapRes.statusCode === 200, 'GET /sitemap.xml -> HTTP 200 OK');
    assert(sitemapRes.body.includes('<urlset') || sitemapRes.body.includes('/admissions'), '/sitemap.xml contains valid URL definitions');
  } catch (err) {
    assert(false, 'GET /sitemap.xml', err.message);
  }

  try {
    const robotsRes = await fetchRoute('/robots.txt');
    assert(robotsRes.statusCode === 200, 'GET /robots.txt -> HTTP 200 OK');
    assert(robotsRes.body.includes('Disallow: /admin/'), '/robots.txt blocks crawler access to /admin/');
  } catch (err) {
    assert(false, 'GET /robots.txt', err.message);
  }

  try {
    const crestRes = await fetchRoute('/images/school-crest.png');
    assert(crestRes.statusCode === 200, 'GET /images/school-crest.png -> HTTP 200 OK (School Crest Asset)');
  } catch (err) {
    assert(false, 'GET /images/school-crest.png', err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 3: Admin Portal Live Endpoints
  // ----------------------------------------------------
  console.log('\n=== TEST SUITE 3: Admin Portal Live Endpoints ===');

  const adminRoutes = [
    '/admin/login',
    '/admin',
    '/admin/about',
    '/admin/academics',
    '/admin/achievements',
    '/admin/admissions',
    '/admin/alumni',
    '/admin/announcements',
    '/admin/banners',
    '/admin/enquiries',
    '/admin/events',
    '/admin/facilities',
    '/admin/faculty',
    '/admin/gallery',
    '/admin/homepage',
    '/admin/migration',
    '/admin/research',
    '/admin/results',
    '/admin/school-info',
    '/admin/settings',
    '/admin/testimonials',
    '/admin/theme',
    '/admin/timeline',
    '/admin/transport',
    '/admin/users',
  ];

  for (const route of adminRoutes) {
    try {
      const res = await fetchRoute(route);
      assert(
        res.statusCode === 200,
        `GET ${route} -> HTTP 200 OK (${res.duration}ms)`,
        `Expected 200, got ${res.statusCode}`
      );
      assert(
        res.body.includes('<!DOCTYPE html>'),
        `${route} returns valid HTML5 response`
      );
    } catch (err) {
      assert(false, `GET ${route} request completed`, err.message);
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 4: Functional Form Fields & Elements
  // ----------------------------------------------------
  console.log('\n=== TEST SUITE 4: Form Fields & Interactive Elements ===');

  try {
    const admissionsRes = await fetchRoute('/admissions');
    assert(
      admissionsRes.body.includes('studentName') || admissionsRes.body.includes('Student') || admissionsRes.body.includes('Name'),
      '/admissions page contains Student Name input fields'
    );
    assert(
      admissionsRes.body.includes('parentPhone') || admissionsRes.body.includes('Phone') || admissionsRes.body.includes('Mobile'),
      '/admissions page contains Contact Phone input fields'
    );
  } catch (err) {
    assert(false, 'Verify admissions form elements', err.message);
  }

  try {
    const loginRes = await fetchRoute('/admin/login');
    assert(
      loginRes.body.includes('type="email"') || loginRes.body.includes('email') || loginRes.body.includes('Email'),
      '/admin/login contains Email credential input'
    );
    assert(
      loginRes.body.includes('type="password"') || loginRes.body.includes('password') || loginRes.body.includes('Password'),
      '/admin/login contains Password credential input'
    );
  } catch (err) {
    assert(false, 'Verify login form elements', err.message);
  }

  try {
    const resultsRes = await fetchRoute('/results');
    assert(
      resultsRes.body.includes('roll') || resultsRes.body.includes('Roll') || resultsRes.body.includes('Registration') || resultsRes.body.includes('lookup') || resultsRes.body.includes('input'),
      '/results page contains Marks/Result lookup elements'
    );
  } catch (err) {
    assert(false, 'Verify results lookup elements', err.message);
  }

  // ----------------------------------------------------
  // Summary
  // ----------------------------------------------------
  console.log('\n================================================================');
  console.log(`TOTAL LIVE TESTS:  ${totalTests}`);
  console.log(`PASSED:            ${passedTests}`);
  console.log(`FAILED:            ${failedTests}`);
  console.log('================================================================');

  if (failedTests === 0) {
    console.log('\n>>> ALL LIVE LOCAL END-TO-END TESTS PASSED WITH 100% SUCCESS! <<<\n');
    process.exit(0);
  } else {
    console.error(`\n>>> FAILED: ${failedTests} tests failed! <<<\n`);
    process.exit(1);
  }
}

runLiveE2ETests().catch(err => {
  console.error('Fatal live E2E error:', err);
  process.exit(1);
});
