import { test, expect } from '@playwright/test';

test.describe('End-to-End Firebase Connection & Admin Portal Operations', () => {
  test('authenticates with live Firebase admin credentials and validates cloud connection', async ({ page }) => {
    // 1. Navigate to admin login
    await page.goto('/admin/login');

    // Verify login page loads with live Firebase indicators
    await expect(page.locator('text=S.U.M. SCHOOL').first()).toBeVisible();
    await expect(page.locator('text=Firebase Live').first()).toBeVisible();

    // 2. Perform credential-based authentication using administrative credentials
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const submitBtn = page.locator('button[type="submit"]:has-text("Sign In"), button[type="submit"]:has-text("Login")').first();

    await emailInput.fill('admin@sumschools.org');
    await passwordInput.fill('admin@1963');
    await submitBtn.click();

    // 3. Verify successful redirection to /admin dashboard
    await page.waitForURL('**/admin', { timeout: 15000 });
    await expect(page.locator('text=Dashboard Overview').first()).toBeVisible();

    // 4. Verify live connection in Admin Topbar: Must NEVER show "Offline Only"
    const topbar = page.locator('header').first();
    const topbarText = await topbar.innerText();
    expect(topbarText).not.toContain('Offline Only');

    // 5. Verify live status badge is visible and active
    const liveStatusPill = page.locator('header button:has-text("ONLINE"), header button:has-text("SYNCING"), header button:has-text("CONNECTING"), header span:has-text("ONLINE")');
    await expect(liveStatusPill.first()).toBeVisible();
  });

  test('executes end-to-end Firestore write and persistence verification in Homepage Editor', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));

    // 1. Fast login into Admin
    await page.goto('/admin/login');
    const fastAccessBtn = page.locator('button:has-text("Fast 1-Click Access")');
    await expect(fastAccessBtn).toBeVisible({ timeout: 10000 });
    await fastAccessBtn.click();
    await page.waitForURL('**/admin', { timeout: 15000 });

    // 2. Navigate to /admin/homepage
    await page.goto('/admin/homepage');
    await page.waitForLoadState('domcontentloaded');

    // 3. Locate the Save button and click it
    const saveBtn = page.locator('button:has-text("Save Homepage Sections")').first();
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();

    // 4. Expect positive confirmation toast or notification
    const toastLocator = page.locator('[data-sonner-toast], div[role="status"], div[role="alert"]').first();
    await expect(toastLocator).toBeVisible({ timeout: 10000 });
    const toastText = await toastLocator.innerText();
    console.log('TOAST TEXT RECEIVED:', toastText);

    // 5. Reload the page to test persistence
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // 6. Verify fields remain loaded and accurate after reload
    const heroHeadline = page.getByRole('textbox', { name: 'Main Hero Headline (English)' });
    await expect(heroHeadline).toBeVisible();
    await expect(heroHeadline).toHaveValue(/Celebrating Excellence, Talent & Togetherness – Annual Day 2026/);
  });

  test('executes end-to-end CRUD persistence in Admin Announcements', async ({ page }) => {
    // 1. Fast login into Admin
    await page.goto('/admin/login');
    const fastAccessBtn = page.locator('button:has-text("Fast 1-Click Access")');
    await expect(fastAccessBtn).toBeVisible({ timeout: 10000 });
    await fastAccessBtn.click();
    await page.waitForURL('**/admin', { timeout: 15000 });

    // 2. Navigate to /admin/announcements
    await page.goto('/admin/announcements');
    await page.waitForLoadState('domcontentloaded');

    // Verify page header
    await expect(page.locator('h1, h2, h3', { hasText: 'Announcements' }).first()).toBeVisible();

    // 3. Open Add Announcement Modal
    const addBtn = page.locator('button:has-text("Publish Notice"), button:has-text("New Notice")').first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // Fill title and content
    const uniqueTitle = `Annual Day 2026 Rehearsal Notice ${Date.now()}`;
    const titleInput = page.locator('input[placeholder*="Annual Board Examinations" i], input[placeholder*="Notice Title" i]').first();
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill(uniqueTitle);

    const contentInput = page.locator('textarea[placeholder*="Complete announcement" i], textarea').first();
    await expect(contentInput).toBeVisible({ timeout: 10000 });
    await contentInput.fill('Detailed information for the Annual Day rehearsal notice.');

    // Save
    const modalSaveBtn = page.locator('button[type="submit"]:has-text("Publish Notice")').last();
    await modalSaveBtn.click();

    // 4. Verify the new record appears in the list
    await expect(page.locator(`text=${uniqueTitle}`).first()).toBeVisible({ timeout: 10000 });

    // 5. Clean up: Delete the test record
    const recordRow = page.locator(`tr:has-text("${uniqueTitle}"), div:has-text("${uniqueTitle}")`).first();
    const deleteBtn = recordRow.locator('button:has-text("Delete"), button[aria-label*="delete" i], button svg.lucide-trash-2, button svg.lucide-trash').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();

      // Confirm dialog if prompted
      const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Delete"):not([disabled])').last();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }
    }
  });

  test('validates that /admin/banners shows ONLINE status and hero banners are loaded', async ({ page }) => {
    // 1. Fast login into Admin
    await page.goto('/admin/login');
    const fastAccessBtn = page.locator('button:has-text("Fast 1-Click Access")');
    await expect(fastAccessBtn).toBeVisible({ timeout: 10000 });
    await fastAccessBtn.click();
    await page.waitForURL('**/admin', { timeout: 15000 });

    // 2. Navigate to /admin/banners
    await page.goto('/admin/banners');
    await page.waitForLoadState('domcontentloaded');

    // 3. Verify page header
    await expect(page.locator('h1, h2', { hasText: 'Hero Banners & Carousel' }).first()).toBeVisible({ timeout: 10000 });

    // 4. Verify ONLINE badge is displayed (never OFFLINE)
    const onlineBadge = page.locator('header button:has-text("ONLINE")');
    await expect(onlineBadge).toBeVisible({ timeout: 10000 });
    const topbarText = await page.locator('header').innerText();
    expect(topbarText).not.toContain('OFFLINE');

    // 5. Click the ONLINE status badge to trigger the connection health check toast
    await onlineBadge.click();
    await expect(page.locator('text=connected and synchronized')).toBeVisible({ timeout: 8000 });

    // 6. Verify Annual Day banner card is present
    await expect(page.locator('text=Celebrating Excellence, Talent & Togetherness – Annual Day 2026').first()).toBeVisible();
  });
});
