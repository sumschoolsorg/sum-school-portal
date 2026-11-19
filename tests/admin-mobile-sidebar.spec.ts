import { test, expect } from '@playwright/test';

test.describe('Mobile Admin Sidebar Responsiveness & Blur-Free Scrim', () => {
  test('Mobile admin sidebar opens, maintains sharp visuals with no backdrop blur, and locks scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // 1. Authenticate as Administrator
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('admin@sumschools.org');
    await passwordInput.fill('admin@1963');
    await expect(emailInput).toHaveValue('admin@sumschools.org');
    await expect(passwordInput).toHaveValue('admin@1963');

    await page.getByRole('button', { name: 'Sign In to Admin Portal' }).click();
    await page.waitForURL('**/admin', { timeout: 25000 });
    await page.waitForTimeout(500);

    // 2. Initial state: body should not be locked
    const initialOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(initialOverflow).not.toBe('hidden');

    // 3. Find and click hamburger menu toggle
    const hamburgerBtn = page.getByRole('button', { name: /Open sidebar menu/i });
    await expect(hamburgerBtn).toBeVisible();
    await hamburgerBtn.click();
    await page.waitForTimeout(300);

    // 4. Body should now be scroll-locked on mobile
    const lockedOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(lockedOverflow).toBe('hidden');

    // 5. Sidebar should be visible
    const aside = page.locator('aside');
    await expect(aside).toBeVisible();

    // 6. Backdrop should exist and must NOT have any blur filters
    const backdrop = page.locator('[aria-label="Close sidebar overlay"]');
    await expect(backdrop).toBeVisible();

    const backdropClasses = await backdrop.getAttribute('class');
    expect(backdropClasses).not.toContain('backdrop-blur');

    // 7. Check that sidebar text is sharp and visible
    await expect(page.getByText('S.U.M. Admin').first()).toBeVisible();
    await expect(page.getByText('ZERO AI Image Library').first()).toBeVisible();

    // 8. Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 9. Body scroll lock should be released
    const restoredOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(restoredOverflow).toBe('');

    // 10. Reopen sidebar
    await hamburgerBtn.click();
    await page.waitForTimeout(300);

    // 11. Click outside on the backdrop scrim overlay to close
    await backdrop.click({ position: { x: 350, y: 300 } });
    await page.waitForTimeout(300);

    // 12. Body scroll lock should be released again
    const finalOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(finalOverflow).toBe('');
  });
});
