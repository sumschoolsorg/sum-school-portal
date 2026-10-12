import { expect, test } from '@playwright/test';

const desktopWidths = [1280, 1366, 1440, 1920];
const mobileViewports = [
  { width: 320, height: 640 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];

const academicsRoutes = [
  ['/academics', 'Overview & Streams'],
  ['/facilities', 'Campus Facilities'],
  ['/faculty', 'Faculty & Staff'],
  ['/transport', 'Bus & Transport'],
  ['/transport/tracking', 'Live Bus Tracking'],
  ['/results', 'Exam Results'],
] as const;

test.describe('Desktop Academics navigation', () => {
  for (const width of desktopWidths) {
    test(`opens below the nav without clipping at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/about', { waitUntil: 'domcontentloaded' });

      const nav = page.getByRole('navigation', { name: 'Main Navigation' });
      const trigger = nav.getByRole('button', { name: 'Academics' });
      const menu = page.locator('#academics-navigation-menu');
      await expect(trigger).toBeVisible();
      await trigger.click();
      await expect(menu).toBeVisible();
      await expect(menu.getByRole('menuitem')).toHaveCount(academicsRoutes.length);

      const placement = await page.evaluate(() => {
        const navigation = document.querySelector('nav[aria-label="Main Navigation"]')!;
        const menuElement = document.querySelector('#academics-navigation-menu')!;
        const panel = menuElement.firstElementChild!;
        const navRect = navigation.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        return {
          panelTop: panelRect.top,
          navBottom: navRect.bottom,
          navOverflowX: getComputedStyle(navigation).overflowX,
          navOverflowY: getComputedStyle(navigation).overflowY,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
        };
      });

      expect(placement.panelTop).toBeGreaterThanOrEqual(placement.navBottom);
      expect(placement.navOverflowX).toBe('visible');
      expect(placement.navOverflowY).toBe('visible');
      expect(placement.documentWidth).toBeLessThanOrEqual(placement.viewportWidth);
      await page.screenshot({ path: `test-results/academics-desktop-${width}.png` });
    });
  }

  test('opens by keyboard, closes with Escape and outside click', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    const nav = page.getByRole('navigation', { name: 'Main Navigation' });
    const trigger = nav.getByRole('button', { name: 'Academics' });
    const menu = page.locator('#academics-navigation-menu');
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem').first()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem').nth(1)).toBeFocused();
    await page.keyboard.press('End');
    await expect(menu.getByRole('menuitem').last()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(menu).toBeVisible();
    await page.locator('#main-content h1').click();
    await expect(menu).toBeHidden();
  });

  for (const [route, label] of academicsRoutes) {
    test(`submenu item “${label}” navigates to ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.goto('/about', { waitUntil: 'domcontentloaded' });
      const nav = page.getByRole('navigation', { name: 'Main Navigation' });
      await nav.getByRole('button', { name: 'Academics' }).click();
      await nav.getByRole('menuitem', { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`${route.replaceAll('/', '\\/')}/?$`));
      await expect(page.locator('#main-content h1')).toBeVisible();
    });
  }
});

test.describe('Touch navigation', () => {
  for (const viewport of mobileViewports) {
    test(`mobile menu and Academics links work at ${viewport.width}px`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, hasTouch: true });
      const page = await context.newPage();
      await page.goto('/about', { waitUntil: 'domcontentloaded' });

      const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
      await expect(toggle).toBeVisible();
      await toggle.tap();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');

      const mobileNav = page.getByRole('navigation', { name: 'Mobile Navigation' });
      const academicsToggle = mobileNav.getByRole('button', { name: 'Academics' });
      await expect(academicsToggle).toHaveAttribute('aria-expanded', 'false');
      await academicsToggle.tap();
      await expect(academicsToggle).toHaveAttribute('aria-expanded', 'true');
      for (const [, label] of academicsRoutes) {
        await expect(mobileNav.getByRole('link', { name: label })).toBeVisible();
      }

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
      await page.screenshot({ path: `test-results/navigation-mobile-${viewport.width}.png` });

      await mobileNav.getByRole('link', { name: 'Overview & Streams' }).tap();
      await expect(page).toHaveURL(/\/academics\/?$/);
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await context.close();
    });
  }
});

test('desktop page scroll reaches footer and returns to top', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  test.setTimeout(60_000);
  await page.goto('/about', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#main-content h1')).toBeVisible();

  const nav = page.getByRole('navigation', { name: 'Main Navigation' });
  const trigger = nav.getByRole('button', { name: 'Academics' });
  const menu = page.locator('#academics-navigation-menu');
  await trigger.click();
  await expect(menu).toBeVisible();

  const start = await page.evaluate(() => window.scrollY);
  const heading = page.locator('#main-content h1');
  const headingBox = await heading.boundingBox();
  if (!headingBox) throw new Error('Homepage hero heading was not laid out');
  await page.mouse.move(headingBox.x + 10, headingBox.y + 10);
  await page.mouse.wheel(0, 1800);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(start);
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(page.locator('footer')).toBeInViewport();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
