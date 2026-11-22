import { test, expect } from '@playwright/test';

test.describe('Manager & Correspondent Leadership Section', () => {
  test('homepage displays Manager & Correspondent message directly above Headmaster', async ({ page }) => {
    await page.goto('/');

    // Verify Correspondent section details
    const correspondentName = page.locator('text=MR. M.S. PRABHAKAR, M.A.').first();
    await expect(correspondentName).toBeVisible();

    const correspondentRole = page.locator('text=MANAGER & CORRESPONDENT').first();
    await expect(correspondentRole).toBeVisible();

    const correspondentBadge = page.locator('text=Message from the Manager & Correspondent').first();
    await expect(correspondentBadge).toBeVisible();

    // Verify Correspondent image
    const correspondentImg = page.locator('img[src*="correspondent-photo.jpg"]').first();
    await expect(correspondentImg).toBeVisible();

    // Verify Headmaster section is also visible
    const headmasterName = page.locator('text=S. THOMAS M.Sc., M.Ed.').first();
    await expect(headmasterName).toBeVisible();

    // Verify vertical order: Correspondent section MUST be ABOVE Headmaster section
    const correspondentBox = await correspondentName.boundingBox();
    const headmasterBox = await headmasterName.boundingBox();

    expect(correspondentBox).not.toBeNull();
    expect(headmasterBox).not.toBeNull();
    if (correspondentBox && headmasterBox) {
      expect(correspondentBox.y).toBeLessThan(headmasterBox.y);
    }

    // Verify message quote text presence
    await expect(
      page.locator('text=Welcome to Savariyappa Udaiyar Memorial Higher Secondary & Primary School, Rayappanpatti.').first()
    ).toBeVisible();
    await expect(
      page.locator('text=Education is the foundation of a successful future.').first()
    ).toBeVisible();
  });

  test('Tamil language toggle localizes Correspondent section', async ({ page }) => {
    await page.goto('/');

    // Toggle to Tamil
    const langBtn = page.locator('button[aria-label*="Tamil"], button:has-text("தமிழ்")').first();
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(500);

      // Verify Tamil badge and name
      await expect(page.locator('text=மேலாளர் & தாளாளர் அவர்களின் செய்தி').first()).toBeVisible();
      await expect(page.locator('text=உயர்திரு. M.S. பிரபாகர், M.A.').first()).toBeVisible();
      await expect(page.locator('text=மேலாளர் மற்றும் தாளாளர்').first()).toBeVisible();
    }
  });

  test('About page management leadership includes Correspondent with photo', async ({ page }) => {
    await page.goto('/about');

    const correspondentCard = page.locator('text=Mr. M.S. Prabhakar, M.A.').first();
    await expect(correspondentCard).toBeVisible();

    const roleBadge = page.locator('text=MANAGER & CORRESPONDENT').first();
    await expect(roleBadge).toBeVisible();
  });
});
