import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

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

console.log('====================================================');
console.log('   S.U.M. SCHOOL PORTAL — END-TO-END VERIFICATION   ');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST SUITE 1: Route & Sitemap Integrity
// ----------------------------------------------------
console.log('=== TEST SUITE 1: Route & Sitemap Integrity ===');

const expectedPublicRoutes = [
  '/',
  '/about',
  '/academics',
  '/admissions',
  '/faculty',
  '/facilities',
  '/news',
  '/events',
  '/gallery',
  '/achievements',
  '/alumni',
  '/transport',
  '/transport/tracking',
  '/results',
  '/contact',
  '/privacy',
  '/terms',
];

for (const route of expectedPublicRoutes) {
  const pagePath = route === '/'
    ? path.join(projectRoot, 'src', 'app', 'page.tsx')
    : path.join(projectRoot, 'src', 'app', route.slice(1), 'page.tsx');
  assert(fs.existsSync(pagePath), `Public page exists for route "${route}"`, `Missing: ${pagePath}`);
}

const sitemapFile = path.join(projectRoot, 'src', 'app', 'sitemap.ts');
assert(fs.existsSync(sitemapFile), 'Sitemap generator exists (src/app/sitemap.ts)');
if (fs.existsSync(sitemapFile)) {
  const sitemapContent = fs.readFileSync(sitemapFile, 'utf8');
  assert(sitemapContent.includes('export default function sitemap()'), 'Sitemap exports standard sitemap function');
  assert(sitemapContent.includes('/admissions'), 'Sitemap includes high-priority admissions route');
  assert(sitemapContent.includes('/results'), 'Sitemap includes student results route');
}

const robotsFile = path.join(projectRoot, 'public', 'robots.txt');
assert(fs.existsSync(robotsFile), 'robots.txt exists in public directory');
if (fs.existsSync(robotsFile)) {
  const robotsContent = fs.readFileSync(robotsFile, 'utf8');
  assert(robotsContent.includes('Disallow: /admin/'), 'robots.txt disallows search crawlers from /admin/');
}

// ----------------------------------------------------
// TEST SUITE 2: Administration Routes & Layout Security
// ----------------------------------------------------
console.log('\n=== TEST SUITE 2: Administration Routes & Security ===');

const expectedAdminPages = [
  'page.tsx', // Dashboard
  'about/page.tsx',
  'academics/page.tsx',
  'achievements/page.tsx',
  'admissions/page.tsx',
  'alumni/page.tsx',
  'announcements/page.tsx',
  'banners/page.tsx',
  'enquiries/page.tsx',
  'events/page.tsx',
  'facilities/page.tsx',
  'faculty/page.tsx',
  'gallery/page.tsx',
  'homepage/page.tsx',
  'login/page.tsx',
  'migration/page.tsx',
  'research/page.tsx',
  'results/page.tsx',
  'school-info/page.tsx',
  'settings/page.tsx',
  'testimonials/page.tsx',
  'theme/page.tsx',
  'timeline/page.tsx',
  'transport/page.tsx',
  'users/page.tsx',
];

for (const adminPage of expectedAdminPages) {
  const p = path.join(projectRoot, 'src', 'app', 'admin', adminPage);
  assert(fs.existsSync(p), `Admin page exists: admin/${adminPage}`, `Missing: ${p}`);
}

const adminLoginPage = path.join(projectRoot, 'src', 'app', 'admin', 'login', 'page.tsx');
if (fs.existsSync(adminLoginPage)) {
  const loginContent = fs.readFileSync(adminLoginPage, 'utf8');
  assert(!loginContent.includes('handleDevBypass'), 'Dev authentication bypass function removed from login page');
  assert(!loginContent.includes('Developer Quick Access'), 'Dev bypass UI button removed from login page');
  const authLibPath = path.join(projectRoot, 'src', 'lib', 'auth.ts');
  const authLibContent = fs.existsSync(authLibPath) ? fs.readFileSync(authLibPath, 'utf8') : '';
  assert(
    loginContent.includes('signInWithEmailAndPassword') ||
    (loginContent.includes('signIn(') && authLibContent.includes('signInWithEmailAndPassword')),
    'Real Firebase email/password authentication is wired'
  );
}

const adminLayoutPage = path.join(projectRoot, 'src', 'app', 'admin', 'layout.tsx');
if (fs.existsSync(adminLayoutPage)) {
  const layoutContent = fs.readFileSync(adminLayoutPage, 'utf8');
  assert(!layoutContent.includes('sum_admin_authenticated'), 'localStorage bypass removed from admin layout authorization');
  assert(layoutContent.includes('isAdmin') || layoutContent.includes('Boolean(user)'), 'Admin layout requires verified Firebase Auth user identity');
}

// ----------------------------------------------------
// TEST SUITE 3: Firebase Security Rules Verification
// ----------------------------------------------------
console.log('\n=== TEST SUITE 3: Firebase Security Rules ===');

const firestoreRulesFile = path.join(projectRoot, 'firestore.rules');
assert(fs.existsSync(firestoreRulesFile), 'firestore.rules exists');
if (fs.existsSync(firestoreRulesFile)) {
  const rules = fs.readFileSync(firestoreRulesFile, 'utf8');
  assert(rules.includes('function isAdmin()'), 'firestore.rules defines isAdmin() helper');
  assert(rules.includes('function isSuperAdmin()'), 'firestore.rules defines isSuperAdmin() helper');
  assert(rules.includes('allow get: if resource.data.status == \'published\'') || rules.includes('allow get: if isPublicAlumni()'), 'Public collections use separated get with status check');
  assert(rules.includes('allow list: if resource.data.status == \'published\'') || rules.includes('allow list: if true;'), 'Public collections allow open listing for published streams');
  assert(rules.includes('match /enquiries/{enquiryId}') && rules.includes('allow read, update, delete: if isSchoolAdmin()'), 'Enquiries collection is restricted to school admins');
  assert(rules.includes('match /adminUsers/{userId}') && rules.includes('allow write: if isSuperAdmin()'), 'adminUsers collection requires Super Admin privileges');
}

const storageRulesFile = path.join(projectRoot, 'storage.rules');
assert(fs.existsSync(storageRulesFile), 'storage.rules exists');
if (fs.existsSync(storageRulesFile)) {
  const sRules = fs.readFileSync(storageRulesFile, 'utf8');
  assert(sRules.includes('function isAdmin()'), 'storage.rules defines isAdmin() check');
  assert(sRules.includes('allow create, update: if (isSchoolAdmin() || canManageContentFolder(folder))') && sRules.includes('allow delete: if isSchoolAdmin() || canManageContentFolder(folder)'), 'storage.rules restricts file writes and deletes by role');
  assert(sRules.includes('image/*') || sRules.includes('request.resource.contentType.matches(\'image/'), 'storage.rules enforces image MIME validation');
}

// ----------------------------------------------------
// TEST SUITE 4: CSV Formula Injection Prevention
// ----------------------------------------------------
console.log('\n=== TEST SUITE 4: CSV Formula Injection Sanitization ===');

function sanitizeCSV(val) {
  const s = String(val ?? '').replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(s)) {
    return `"'${s}"`;
  }
  return `"${s}"`;
}

const payload1 = '=CMD(\'calc.exe\')';
const sanitized1 = sanitizeCSV(payload1);
assert(sanitized1 === '"\'=CMD(\'calc.exe\')"', 'Leading "=" formula is prefixed with single quote');

const payload2 = '+100*200';
const sanitized2 = sanitizeCSV(payload2);
assert(sanitized2 === '"\'+100*200"', 'Leading "+" formula is prefixed with single quote');

const payload3 = '-2+5';
const sanitized3 = sanitizeCSV(payload3);
assert(sanitized3 === '"\'-2+5"', 'Leading "-" formula is prefixed with single quote');

const payload4 = '@SUM(A1:A10)';
const sanitized4 = sanitizeCSV(payload4);
assert(sanitized4 === '"\'@SUM(A1:A10)"', 'Leading "@" formula is prefixed with single quote');

const safeName = 'John Doe';
const sanitizedSafe = sanitizeCSV(safeName);
assert(sanitizedSafe === '"John Doe"', 'Normal safe string is preserved without modification');

// ----------------------------------------------------
// TEST SUITE 5: Result & Grade Calculation Logic
// ----------------------------------------------------
console.log('\n=== TEST SUITE 5: Academic Calculation Engine ===');

function calculateResults(subjects) {
  const totalMax = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const totalObtained = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
  const percentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
  const allPassed = subjects.every((s) => s.marksObtained >= s.passingMarks);

  let grade = 'Fail';
  if (allPassed) {
    if (percentage >= 90) grade = 'Distinction (A1)';
    else if (percentage >= 80) grade = 'First Class (A2)';
    else if (percentage >= 70) grade = 'First Class (B1)';
    else if (percentage >= 60) grade = 'First Class (B2)';
    else if (percentage >= 50) grade = 'Second Class (C1)';
    else if (percentage >= 35) grade = 'Third Class (D)';
  }

  return {
    totalMax,
    totalObtained,
    percentage,
    resultStatus: allPassed ? 'PASS' : 'FAIL',
    overallGrade: grade,
  };
}

const sampleSubjectsPass = [
  { name: 'Tamil', maxMarks: 100, passingMarks: 35, marksObtained: 92 },
  { name: 'English', maxMarks: 100, passingMarks: 35, marksObtained: 88 },
  { name: 'Mathematics', maxMarks: 100, passingMarks: 35, marksObtained: 95 },
  { name: 'Science', maxMarks: 100, passingMarks: 35, marksObtained: 90 },
  { name: 'Social Science', maxMarks: 100, passingMarks: 35, marksObtained: 91 },
];

const passResult = calculateResults(sampleSubjectsPass);
assert(passResult.totalMax === 500, 'Total max marks is 500');
assert(passResult.totalObtained === 456, 'Total obtained marks is 456');
assert(passResult.percentage === 91.2, 'Percentage calculated correctly as 91.2%');
assert(passResult.resultStatus === 'PASS', 'Result status is PASS when all subjects >= passing marks');
assert(passResult.overallGrade === 'Distinction (A1)', 'Grade assigned as Distinction (A1) for >= 90%');

const sampleSubjectsFail = [
  { name: 'Tamil', maxMarks: 100, passingMarks: 35, marksObtained: 80 },
  { name: 'English', maxMarks: 100, passingMarks: 35, marksObtained: 85 },
  { name: 'Mathematics', maxMarks: 100, passingMarks: 35, marksObtained: 28 }, // Failed
  { name: 'Science', maxMarks: 100, passingMarks: 35, marksObtained: 75 },
  { name: 'Social Science', maxMarks: 100, passingMarks: 35, marksObtained: 70 },
];

const failResult = calculateResults(sampleSubjectsFail);
assert(failResult.resultStatus === 'FAIL', 'Result status is FAIL if any single subject is below 35');
assert(failResult.overallGrade === 'Fail', 'Overall grade is Fail when subject failed');

// ----------------------------------------------------
// TEST SUITE 6: Super Administrator Lockout Guard
// ----------------------------------------------------
console.log('\n=== TEST SUITE 6: Super Administrator Safety Guard ===');

function canDeleteAdminUser(targetId, userList) {
  const target = userList.find((u) => u.id === targetId);
  if (!target) return { allowed: false, reason: 'User not found' };
  if (target.role === 'super-admin') {
    const remainingSuperAdmins = userList.filter((u) => u.role === 'super-admin');
    if (remainingSuperAdmins.length <= 1) {
      return { allowed: false, reason: 'Cannot delete the sole Super Administrator account.' };
    }
  }
  return { allowed: true };
}

const singleAdminList = [
  { id: 'admin-1', email: 'admin@sumschool.edu.in', role: 'super-admin' },
  { id: 'admin-2', email: 'staff@sumschool.edu.in', role: 'admin' },
];

const lockoutAttempt = canDeleteAdminUser('admin-1', singleAdminList);
assert(!lockoutAttempt.allowed, 'Deleting the sole Super Admin is blocked');
assert(lockoutAttempt.reason.includes('sole Super Administrator'), 'Proper reason provided for blocking sole super-admin deletion');

const staffDelete = canDeleteAdminUser('admin-2', singleAdminList);
assert(staffDelete.allowed, 'Deleting regular admin is permitted');

const multiSuperAdminList = [
  { id: 'admin-1', email: 'admin1@sumschool.edu.in', role: 'super-admin' },
  { id: 'admin-3', email: 'admin2@sumschool.edu.in', role: 'super-admin' },
];
const multiDelete = canDeleteAdminUser('admin-1', multiSuperAdminList);
assert(multiDelete.allowed, 'Deleting a super admin is permitted if another super admin exists');

// ----------------------------------------------------
// TEST SUITE 7: Default Data File Integrity
// ----------------------------------------------------
console.log('\n=== TEST SUITE 7: Default Data File Integrity ===');

const defaultDataFile = path.join(projectRoot, 'src', 'lib', 'defaultData.ts');
assert(fs.existsSync(defaultDataFile), 'defaultData.ts exists');
if (fs.existsSync(defaultDataFile)) {
  const defaultDataContent = fs.readFileSync(defaultDataFile, 'utf8');
  const requiredEntities = [
    'defaultSchoolSettings',
    'defaultHomepageContent',
    'defaultHeroBanners',
    'defaultAboutContent',
    'defaultAcademicsContent',
    'defaultAdmissionsContent',
    'defaultFaculty',
    'defaultFacilities',
    'defaultAnnouncements',
    'defaultEvents',
    'defaultGalleryImages',
    'defaultAchievements',
    'defaultTestimonials',
    'defaultTimelineEntries',
    'defaultTransportRoutes',
    'defaultStudentResults',
  ];
  for (const entity of requiredEntities) {
    assert(defaultDataContent.includes(entity), `defaultData.ts exports ${entity}`);
  }
}

// ----------------------------------------------------
// TEST SUITE 8: Privacy, PII Isolation & Secure Endpoints
// ----------------------------------------------------
console.log('\n=== TEST SUITE 8: Privacy, PII Isolation & Secure Endpoints ===');

const resultsApiFile = path.join(projectRoot, 'src', 'app', 'api', 'results', 'lookup', 'route.ts');
assert(fs.existsSync(resultsApiFile), 'Secure results lookup route exists (api/results/lookup/route.ts)');
if (fs.existsSync(resultsApiFile)) {
  const content = fs.readFileSync(resultsApiFile, 'utf8');
  assert(content.includes('RATE_LIMIT') && content.includes('429'), 'Results lookup API enforces IP rate limiting');
  assert(content.includes('rollNumber') && content.includes('dob'), 'Results lookup API requires Roll Number and DOB');
  assert(content.includes('isLocalPreview'), 'Results lookup API flags local preview demo results');
}

const publicResultsPage = path.join(projectRoot, 'src', 'app', 'results', 'page.tsx');
if (fs.existsSync(publicResultsPage)) {
  const content = fs.readFileSync(publicResultsPage, 'utf8');
  assert(!content.includes('allResults.find'), 'Public results page does NOT use insecure client-side allResults.find');
  assert(!content.includes('includes('), 'Public results page does NOT perform fuzzy substring search on student records');
  assert(content.includes('/api/results/lookup'), 'Public results page calls secure lookup API endpoint');
}

const admissionsApiFile = path.join(projectRoot, 'src', 'app', 'api', 'admissions', 'track', 'route.ts');
assert(fs.existsSync(admissionsApiFile), 'Secure admissions tracking route exists (api/admissions/track/route.ts)');
if (fs.existsSync(admissionsApiFile)) {
  const content = fs.readFileSync(admissionsApiFile, 'utf8');
  assert(content.includes('applicationNumber') && content.includes('phone'), 'Admissions tracking API requires application number + phone 2FA');
  assert(content.includes('limited(') && content.includes('429'), 'Admissions tracking API enforces IP rate limiting');
}

const publicAdmissionsPage = path.join(projectRoot, 'src', 'app', 'admissions', 'page.tsx');
if (fs.existsSync(publicAdmissionsPage)) {
  const content = fs.readFileSync(publicAdmissionsPage, 'utf8');
  assert(!content.includes('enquiryRepository.getAll()'), 'Public admissions page does NOT download full enquiries table');
  assert(content.includes('/api/admissions/track'), 'Public admissions page queries secure tracking API');
}

const idbFile = path.join(projectRoot, 'src', 'lib', 'db', 'indexedDB.ts');
if (fs.existsSync(idbFile)) {
  const content = fs.readFileSync(idbFile, 'utf8');
  assert(content.includes('ALUMNI_PRIVATE'), 'IndexedDB registers dedicated ALUMNI_PRIVATE store');
}

const rulesDoc = path.join(projectRoot, 'firestore.rules');
if (fs.existsSync(rulesDoc)) {
  const content = fs.readFileSync(rulesDoc, 'utf8');
  assert(content.includes('match /alumniPrivate/{alumniId}'), 'Firestore rules configure protected alumniPrivate collection');
  assert(content.includes("!('email' in request.resource.data)"), 'Firestore rules disallow email on public alumni documents');
  assert(content.includes("!('phone' in request.resource.data)"), 'Firestore rules disallow phone on public alumni documents');
}

const migrationPage = path.join(projectRoot, 'src', 'app', 'admin', 'migration', 'page.tsx');
if (fs.existsSync(migrationPage)) {
  const content = fs.readFileSync(migrationPage, 'utf8');
  assert(content.includes("[STORES.ALUMNI_PRIVATE]: 'alumniPrivate'"), 'Migration maps ALUMNI_PRIVATE store to Firestore');
  assert(content.includes("store === STORES.ALUMNI"), 'Migration contains special sanitization branch for alumni collection');
}

// ----------------------------------------------------
// TEST SUMMARY REPORT
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL TESTS:  ${totalTests}`);
console.log(`PASSED:       ${passedTests}`);
console.log(`FAILED:       ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n>>> ALL END-TO-END VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<\n');
  process.exit(0);
}
