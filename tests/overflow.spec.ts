import { test, expect } from '@playwright/test';

const TEST_VIEWPORTS = [
  { name: 'Mobile 320px (iPhone SE 1st gen)', width: 320, height: 640 },
  { name: 'Mobile 360px (Galaxy S8/A-series)', width: 360, height: 800 },
  { name: 'Mobile 375px (iPhone SE 2nd/3rd)', width: 375, height: 667 },
  { name: 'Mobile 390px (iPhone 12/13/14)', width: 390, height: 844 },
  { name: 'Mobile 414px (iPhone XR/11)', width: 414, height: 896 },
  { name: 'Mobile 430px (iPhone 14/15 Pro Max)', width: 430, height: 932 },
  { name: 'Tablet 768px (iPad Mini/Air)', width: 768, height: 1024 },
  { name: 'Desktop 1024px', width: 1024, height: 768 },
  { name: 'Desktop 1366px', width: 1366, height: 768 },
  { name: 'Desktop 1920px', width: 1920, height: 1080 },
];

const AUDIT_ROUTES = [
  '/',
  '/about',
  '/academics',
  '/admissions',
  '/faculty',
  '/facilities',
  '/news',
  '/events',
  '/gallery',
  '/achievements',
  '/alumni',
  '/transport',
  '/transport/tracking',
  '/results',
  '/contact',
  '/privacy',
  '/terms',
  '/admin/login',
];

test.describe('Zero Horizontal Overflow Regression Suite', () => {
  for (const vp of TEST_VIEWPORTS) {
    test.describe(`Viewport ${vp.name} (${vp.width}px)`, () => {
      for (const route of AUDIT_ROUTES) {
        test(`${route} has zero horizontal overflow (scrollWidth <= clientWidth)`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(route, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(150);

          const overflowInfo = await page.evaluate(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const clientWidth = docEl.clientWidth;
            const scrollWidth = docEl.scrollWidth;
            const bodyScrollWidth = body ? body.scrollWidth : 0;

            function isClippedByAncestor(el: Element) {
              let parent = el.parentElement;
              while (parent && parent !== docEl && parent !== body) {
                const style = window.getComputedStyle(parent);
                const ox = style.overflowX;
                const o = style.overflow;
                if (['hidden', 'clip', 'scroll', 'auto'].includes(ox) || ['hidden', 'clip', 'scroll', 'auto'].includes(o)) {
                  const parentRect = parent.getBoundingClientRect();
                  if (parentRect.right <= clientWidth + 2 && parentRect.left >= -2) {
                    return true;
                  }
                }
                parent = parent.parentElement;
              }
              return false;
            }

            const unclippedOverflown: Array<{ tag: string; right: number; width: number; snippet: string }> = [];
            const all = document.querySelectorAll('*');
            for (const el of all) {
              if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'PATH', 'DEFS', 'LINEARGRADIENT'].includes(el.tagName)) continue;
              const rect = el.getBoundingClientRect();
              if (rect.width === 0 || rect.height === 0) continue;
              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden') continue;

              if (rect.right > clientWidth + 2 || rect.left < -2) {
                if (isClippedByAncestor(el)) continue;
                unclippedOverflown.push({
                  tag: el.tagName.toLowerCase(),
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                  snippet: (el.textContent || '').trim().slice(0, 30),
                });
              }
            }

            return {
              clientWidth,
              scrollWidth,
              bodyScrollWidth,
              unclippedOverflown,
            };
          });

          // Document root must not overflow viewport
          expect(overflowInfo.scrollWidth).toBeLessThanOrEqual(overflowInfo.clientWidth);
          // Body must not overflow viewport
          expect(overflowInfo.bodyScrollWidth).toBeLessThanOrEqual(overflowInfo.clientWidth);
          // No unclipped element should stick out beyond viewport
          expect(overflowInfo.unclippedOverflown).toHaveLength(0);
        });
      }
    });
  }
});
