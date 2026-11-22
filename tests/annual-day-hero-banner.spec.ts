import { test, expect } from '@playwright/test';

test.describe('Homepage Hero Banner – Annual Day 2026 Update', () => {
  test('displays updated Annual Day 2026 content in English', async ({ page }) => {
    await page.goto('/');

    // 1. School Name in the top crest badge
    const schoolNameEl = page.locator('text=Savariyappa Udaiyar Memorial Higher Secondary & Primary School').first();
    await expect(schoolNameEl).toBeVisible();

    // 2. Main Hero Heading
    const heroHeading = page.locator('h1', { hasText: 'Celebrating Excellence, Talent & Togetherness – Annual Day 2026' }).first();
    await expect(heroHeading).toBeVisible();

    // 3. Subtitle Eyebrow Pill
    const subtitleEl = page.locator('text=S.U.M. SCHOOLS – ANNUAL DAY CELEBRATION').first();
    await expect(subtitleEl).toBeVisible();

    // 4. Supporting Description
    const descEl = page.locator('text=Join us for a memorable celebration of our students\' achievements, creativity, cultural performances and talents').first();
    await expect(descEl).toBeVisible();

    // 5. Primary Button
    const primaryBtn = page.locator('a[href*="/events"] button:has-text("Explore Annual Day")').first();
    await expect(primaryBtn).toBeVisible();

    // 6. Secondary Button
    const secondaryBtn = page.locator('a[href*="/gallery"] button:has-text("View Photo Gallery")').first();
    await expect(secondaryBtn).toBeVisible();
  });

  test('localizes Annual Day 2026 content cleanly when toggling to Tamil', async ({ page }) => {
    await page.goto('/');

    // Click language switcher to Tamil
    const taBtn = page.locator('button:has-text("தமிழ்"), button:has-text("TA")').first();
    await expect(taBtn).toBeVisible();
    await taBtn.click();

    // 1. Localized Tamil School Name
    const schoolNameTa = page.locator('text=சவரியப்ப உடையார் நினைவு மேல்நிலை & தொடக்கப் பள்ளி').first();
    await expect(schoolNameTa).toBeVisible();

    // 2. Localized Tamil Main Heading
    const headingTa = page.locator('h1', { hasText: 'கல்விச் சிறப்பு, தனித்திறன் & ஒற்றுமை கொண்டாட்டம் – ஆண்டு விழா 2026' }).first();
    await expect(headingTa).toBeVisible();

    // 3. Localized Tamil Subtitle
    const subtitleTa = page.locator('text=எஸ்.யு.எம். பள்ளிகள் – ஆண்டு விழா கொண்டாட்டம்').first();
    await expect(subtitleTa).toBeVisible();

    // 4. Localized Buttons
    const primaryBtnTa = page.locator('a[href*="/events"] button:has-text("ஆண்டு விழா விவரங்கள்")').first();
    await expect(primaryBtnTa).toBeVisible();

    const secondaryBtnTa = page.locator('a[href*="/gallery"] button:has-text("புகைப்பட தொகுப்பு")').first();
    await expect(secondaryBtnTa).toBeVisible();
  });

  test('admin homepage editor displays updated hero banner data', async ({ page }) => {
    await page.goto('/admin/login');
    const fastAccessBtn = page.locator('button:has-text("Fast 1-Click Access")');
    await expect(fastAccessBtn).toBeVisible({ timeout: 10000 });
    await fastAccessBtn.click();

    await page.waitForURL('**/admin', { timeout: 15000 });
    await page.goto('/admin/homepage');

    // Verify Title input has Annual Day heading
    const titleInput = page.getByRole('textbox', { name: 'Main Hero Headline (English)' });
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveValue(/Celebrating Excellence, Talent & Togetherness – Annual Day 2026/);
  });
});
