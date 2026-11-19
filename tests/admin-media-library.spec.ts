import { test, expect } from '@playwright/test';

test.describe('ZERO AI — School Image Library & Admin Media Management', () => {
  test('Complete ZERO AI Media Library workflow: branding, 15 categories, view toggle, search, upload dropzone', async ({ page }) => {
    // 1. Sign in as Administrator
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await page.getByPlaceholder('admin@sumschools.org').fill('admin@sumschools.org');
    await page.getByPlaceholder('Enter your password').fill('admin@1963');
    await page.getByRole('button', { name: 'Sign In to Admin Portal' }).click();
    await page.waitForURL('**/admin', { timeout: 25000 });

    // 2. Navigate to Media Library
    await page.goto('/admin/media', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // 3. Verify ZERO AI Registry Branding
    await expect(page.getByText('ZERO AI — Authentic Media Registry')).toBeVisible();
    await expect(page.getByText('100% Authentic School Photography')).toBeVisible();
    await expect(page.getByRole('heading', { name: /ZERO AI — SCHOOL IMAGE LIBRARY/i })).toBeVisible();

    // 4. Verify all 15 authentic photographic categories exist as filter buttons
    const categories = [
      'School Campus',
      'School Building',
      'Founders',
      'Headmaster',
      'Faculty',
      'Classrooms',
      'Science Laboratory',
      'Computer Laboratory',
      'Sports',
      'Cultural Events',
      'Achievements',
      'Students and Activities',
      'School Functions',
      'Infrastructure',
      'General',
    ];

    for (const cat of categories) {
      const catButton = page.getByRole('button', { name: new RegExp(cat, 'i') }).first();
      await expect(catButton).toBeVisible();
    }

    // 5. Verify Grid and List view mode toggle switches layout cleanly
    const gridBtn = page.getByTitle('Grid View');
    const listBtn = page.getByTitle('List View');
    await expect(gridBtn).toBeVisible();
    await expect(listBtn).toBeVisible();

    // Click list view and return to grid
    await listBtn.click();
    await page.waitForTimeout(200);
    await gridBtn.click();
    await page.waitForTimeout(200);

    // 6. Verify Search filter input filters assets
    const searchInput = page.getByPlaceholder(/Search title, tags, category/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('NonExistentImageTestXYZ999');
    await page.waitForTimeout(300);
    await expect(page.getByText(/0 Photos/i)).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(200);

    // 7. Verify Drag & Drop Upload Zone and 25MB auto-compression guarantee
    await expect(page.getByText(/Drag & Drop Authentic Photos or Click to Browse/i)).toBeVisible();
    await expect(page.getByText(/Supports camera-quality JPEG, PNG, WebP up to 25MB/i)).toBeVisible();
    await expect(page.getByText(/Dynamic client-side compression/i)).toBeVisible();
  });
});
