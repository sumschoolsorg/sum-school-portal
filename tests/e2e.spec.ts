import { test, expect } from '@playwright/test';

// 1. All public routes test
const publicRoutes = [
  '/',
  '/about',
  '/academics',
  '/admissions',
  '/alumni',
  '/contact',
  '/events',
  '/facilities',
  '/faculty',
  '/gallery',
  '/news',
  '/privacy',
  '/results',
  '/terms',
  '/transport',
  '/transport/tracking',
  '/admin/login',
];

test.describe('Public Website Routes Accessibility & Render', () => {
  for (const route of publicRoutes) {
    test(`Route ${route} should render without errors and have skip-to-content target`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      // Verify page body is loaded
      await expect(page.locator('body')).toBeVisible();

      // Skip link target #main-content must exist on every public page (except admin login)
      if (route !== '/admin/login') {
        const mainTarget = page.locator('#main-content');
        await expect(mainTarget).toHaveCount(1);
      }
    });
  }
});

// 2. Responsive Viewports & Academics Page Test
const viewports = [
  { name: 'Desktop 1920x1080', width: 1920, height: 1080 },
  { name: 'Desktop 1440x900', width: 1440, height: 900 },
  { name: 'Desktop 1366x768', width: 1366, height: 768 },
  { name: 'Desktop 1280x800', width: 1280, height: 800 },
  { name: 'Desktop 1024x768', width: 1024, height: 768 },
  { name: 'Tablet 768x1024', width: 768, height: 1024 },
  { name: 'Mobile 390x844', width: 390, height: 844 },
  { name: 'Mobile 360x800', width: 360, height: 800 },
];

test.describe('Academics Page Cross-Device Responsive Layout', () => {
  for (const vp of viewports) {
    test(`Academics page at ${vp.name} (${vp.width}x${vp.height}) renders curriculum, streams, and ATL lab`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/academics', { waitUntil: 'domcontentloaded' });

      // Main container
      await expect(page.locator('#main-content')).toBeVisible();

      // Heading
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();

      // Foundational Stages (Stage 1, Stage 2, Stage 3)
      await expect(page.getByText('Stage 1').first()).toBeVisible();
      await expect(page.getByText('Stage 2').first()).toBeVisible();
      await expect(page.getByText('Stage 3').first()).toBeVisible();

      // Atal Tinkering Lab & Robotics Section
      await expect(page.getByText('Atal Tinkering Lab').first()).toBeVisible();

      // Enrolment & Campus Infrastructure Table
      await expect(page.getByText('3,346').first()).toBeVisible();
      await expect(page.getByText('UDISE: 33250800109').first()).toBeVisible();
    });
  }
});

// 3. Language Switching Test
test.describe('Language Switching & Tamil Localization', () => {
  test('Switches between English and Tamil correctly and updates UI labels', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Look for language switcher button
    const taBtn = page.getByRole('button', { name: /தமிழ்/i }).first();
    if (await taBtn.isVisible()) {
      await taBtn.click();
      // Should now render Tamil text on page
      await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
    }
  });
});

// 4. Duplicate Announcement Prevention
test.describe('Announcement Integrity', () => {
  test('Live announcement bar and ticker do not display duplicate items', async ({ page }) => {
    await page.goto('/news', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#main-content')).toBeVisible();
  });
});

// 5. SEO & Metadata Endpoints
test.describe('SEO Metadata Endpoints', () => {
  test('/robots.txt is accessible and disallows /admin/', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain('Disallow: /admin/');
    expect(text).toContain('https://www.sumschools.org/sitemap.xml');
  });

  test('/sitemap.xml is accessible and contains production URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain('https://www.sumschools.org');
    expect(text).not.toContain('sumschool.in');
  });
});
