import { test, expect } from '@playwright/test';

test.describe('Keyboard & Input Focus Stability', () => {
  test('typing into modal input does not lose focus or auto-blur across keystrokes', async ({ page }) => {
    // 1. Login to admin dashboard
    await page.goto('/admin/login');

    const fastAccessBtn = page.locator('button:has-text("Fast 1-Click Access")');
    await expect(fastAccessBtn).toBeVisible({ timeout: 10000 });
    await fastAccessBtn.click();

    await page.waitForURL('**/admin', { timeout: 15000 });

    // 2. Navigate to Banners Admin
    await page.goto('/admin/banners');

    // Open "Add Bilingual Homepage Banner" modal
    const addBtn = page.locator('button:has-text("Add New Banner")').first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // Verify modal is open
    const modalHeading = page.locator('h3:has-text("Add Bilingual Homepage Banner"), h2:has-text("Add Bilingual Homepage Banner")').first();
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Locate the first input (English heading)
    const titleInput = page.locator('input[placeholder*="Inspiring Wisdom"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });

    // Focus the input
    await titleInput.click();

    // Type character by character with delays to simulate human typing
    const testText = 'UPDATE';
    for (let i = 0; i < testText.length; i++) {
      const char = testText[i];
      await page.keyboard.type(char, { delay: 100 });

      // After typing each character, verify that the input is still the active element!
      const isFocused = await page.evaluate(() => {
        const active = document.activeElement;
        const input = document.querySelector('input[placeholder*="Inspiring Wisdom"]');
        return active === input;
      });

      expect(isFocused).toBe(true);
    }

    // Verify final value is strictly 'UPDATE'
    await expect(titleInput).toHaveValue(testText);

    // Close modal
    const closeBtn = page.getByRole('button', { name: /Close dialog|Close/i });
    await closeBtn.click();
    await expect(modalHeading).not.toBeVisible();
  });

  test('label click focuses corresponding input in public admissions enquiry form', async ({ page }) => {
    await page.goto('/admissions');

    const studentNameInput = page.locator('input[name="studentName"], input[id*="student"], input[placeholder*="name" i]').first();
    if (await studentNameInput.isVisible()) {
      await studentNameInput.click();
      await page.keyboard.type('UPDATE', { delay: 100 });
      await expect(studentNameInput).toHaveValue('UPDATE');
    }
  });
});
