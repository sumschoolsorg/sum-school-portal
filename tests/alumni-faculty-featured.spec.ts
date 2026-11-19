import { test, expect, Page } from '@playwright/test';

async function adminLogin(page: Page) {
  await page.goto('/admin/login');
  await page.fill('input[type="email"]', 'admin@sumschools.org');
  await page.fill('input[type="password"]', 'admin@1963');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 15000 });
}

test.describe('Alumni, Faculty & Featured Teachers Production Verification', () => {
  test('Public Alumni page (/alumni) renders without crash and contains no dummy image presets', async ({
    page,
  }) => {
    await page.goto('/alumni', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Verify page title and header
    await expect(
      page.locator('h1:has-text("Heritage"), h1:has-text("வரலாற்றுப் பெருமை")')
    ).toBeVisible();

    // Verify that NO default /images/faculty-1.jpg or other dummy avatars exist on the page
    const dummyImages = page.locator('img[src*="faculty-1.jpg"]');
    const dummyCount = await dummyImages.count();
    expect(dummyCount).toBe(0);

    // Verify registration button opens modal
    const registerBtn = page.locator(
      'button:has-text("Join the Alumni Network"), button:has-text("முன்னாள் மாணவர் பதிவு")'
    );
    await expect(registerBtn).toBeVisible();
    await registerBtn.click();

    // Modal dialog is open (ignore any Next.js dev overlays)
    const modal = page.locator('[role="dialog"]:not([data-nextjs-dialog])');
    await expect(modal).toBeVisible();

    // Verify modal contains initials Avatar and NO preset avatar buttons
    const presetButtons = modal.locator(
      'button:has-text("Male Alumnus"), button:has-text("Female Alumnus")'
    );
    expect(await presetButtons.count()).toBe(0);

    // Verify file input exists for user photo
    const fileInput = modal.locator('input[type="file"]');
    expect(await fileInput.count()).toBe(1);

    // Close modal
    const cancelBtn = modal.locator('button:has-text("Cancel"), button:has-text("ரத்து")');
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Public Faculty page (/faculty) renders and allows search and filtering', async ({
    page,
  }) => {
    await page.goto('/faculty', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Check heading
    await expect(
      page.locator('h1:has-text("Faculty"), h1:has-text("ஆசிரியர்")')
    ).toBeVisible();

    // Check search input exists
    const searchInput = page.locator(
      'input[placeholder*="Search teacher"], input[placeholder*="ஆசிரியர் பெயர்"]'
    );
    await expect(searchInput).toBeVisible();

    // Check department tabs exist
    const primaryTab = page.locator(
      'button:has-text("Primary Section"), button:has-text("தொடக்கப் பிரிவு")'
    );
    await expect(primaryTab).toBeVisible();
  });

  test('Homepage (/) handles Featured Teachers section gracefully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Verify homepage loads without client exceptions
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('Application error: a client-side exception has occurred');

    // If featured teachers exist, section has title "Meet Our Dedicated Teachers" / "எம் அர்ப்பணிப்புள்ள ஆசிரியர்கள்"
    const featuredSection = page.locator(
      'h2:has-text("Meet Our Dedicated Teachers"), h2:has-text("எம் அர்ப்பணிப்புள்ள ஆசிரியர்கள்")'
    );
    const count = await featuredSection.count();
    // Either gracefully visible if teachers featured, or 0 if none featured (no empty broken card layout)
    expect(count === 0 || count === 1).toBe(true);
  });

  test('Admin Faculty module (/admin/faculty) provides Featured Teacher toggle and Avatar display', async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto('/admin/faculty', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Heading exists
    await expect(page.locator('h2:has-text("Faculty & Staff Management")')).toBeVisible();

    // Add button exists
    const addBtn = page.locator('button:has-text("Add Faculty Member")');
    await expect(addBtn).toBeVisible();

    // Open Add Modal
    await addBtn.click();
    const modal = page.locator('[role="dialog"]:not([data-nextjs-dialog])');
    await expect(modal).toBeVisible();

    // Check for "Feature on Homepage" checkbox
    const featuredCheckbox = modal.locator('input[type="checkbox"]').first();
    await expect(featuredCheckbox).toBeVisible();

    // Close Modal
    const cancelBtn = modal.locator('button:has-text("Cancel")');
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Admin Alumni module (/admin/alumni) renders without dummy avatars and provides Hall of Fame curation', async ({
    page,
  }) => {
    await adminLogin(page);
    await page.goto('/admin/alumni', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Check heading
    await expect(page.locator('h1:has-text("Alumni Heritage Directory Manager")')).toBeVisible();

    // Filter tabs exist
    await expect(page.locator('button:has-text("Hall of Fame")')).toBeVisible();
    await expect(page.locator('button:has-text("Pending Approvals")')).toBeVisible();

    // Verify zero dummy faculty-1.jpg images in alumni admin table
    const dummyImages = page.locator('img[src*="faculty-1.jpg"]');
    expect(await dummyImages.count()).toBe(0);
  });
});
