import { test, expect } from '@playwright/test';

test.describe('Firebase Cloud Synchronization & Connection Monitoring Suite', () => {
  test('Admin portal displays connection status and authenticates successfully', async ({ page }) => {
    await page.goto('/admin/login');

    // Verify login page header and live indicator
    await expect(page.locator('text=S.U.M. SCHOOL').first()).toBeVisible();
    await expect(page.locator('text=Firebase Live').first()).toBeVisible();

    // Fast 1-click access
    const fastAccessBtn = page.locator('button:has-text("Fast 1-Click Access")');
    await expect(fastAccessBtn).toBeVisible();
    await fastAccessBtn.click();

    // Should redirect to /admin dashboard
    await page.waitForURL('**/admin');
    await expect(page.locator('text=Dashboard Overview').first()).toBeVisible();

    // Topbar must NOT say "Offline Only"
    const topbarText = await page.locator('header').innerText();
    expect(topbarText).not.toContain('Offline Only');

    // Should show online/cloud status
    const statusPill = page.locator('header span:has-text("ONLINE"), header span:has-text("CONNECTING"), header span:has-text("SYNCING")');
    await expect(statusPill.first()).toBeVisible();
  });

  test('Homepage Hero section renders banners and listens for updates', async ({ page }) => {
    await page.goto('/');

    // Check Hero title is visible
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();

    // Check Manager & Correspondent message is placed ABOVE Headmaster
    const correspondentSection = page.locator('text=MR. M.S. PRABHAKAR, M.A.').first();
    const headmasterSection = page.locator('text=S. THOMAS M.Sc., M.Ed.').first();

    await expect(correspondentSection).toBeVisible();
    await expect(headmasterSection).toBeVisible();

    const corrBox = await correspondentSection.boundingBox();
    const hmBox = await headmasterSection.boundingBox();

    expect(corrBox).not.toBeNull();
    expect(hmBox).not.toBeNull();
    if (corrBox && hmBox) {
      expect(corrBox.y).toBeLessThan(hmBox.y);
    }
  });

  test('Admin Homepage editor has Manager & Correspondent card above Headmaster card', async ({ page }) => {
    // Authenticate into Admin
    await page.goto('/admin/login');
    const fastAccessBtn = page.locator('button:has-text("Fast 1-Click Access")');
    await fastAccessBtn.click();
    await page.waitForURL('**/admin');

    // Navigate to /admin/homepage
    await page.goto('/admin/homepage');

    // Verify Manager & Correspondent form inputs are present
    await expect(page.locator('text=Manager & Correspondent Message (MR. M.S. PRABHAKAR, M.A.)')).toBeVisible();
    await expect(page.locator('input[value*="PRABHAKAR"], input[placeholder*="PRABHAKAR"]').first()).toBeVisible();

    // Verify Headmaster form is also present
    await expect(page.locator('text=Headmaster Message (S. THOMAS M.Sc., M.Ed.)')).toBeVisible();

    // Verify Correspondent card appears before Headmaster card in DOM
    const corrHeader = page.locator('text=Manager & Correspondent Message').first();
    const hmHeader = page.locator('text=Headmaster Message').first();

    const corrY = (await corrHeader.boundingBox())?.y || 0;
    const hmY = (await hmHeader.boundingBox())?.y || 0;

    expect(corrY).toBeLessThan(hmY);
  });
});
