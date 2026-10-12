import { chromium } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'Mobile 320px', width: 320, height: 640 },
  { name: 'Mobile 360px', width: 360, height: 800 },
  { name: 'Mobile 375px', width: 375, height: 667 },
  { name: 'Mobile 390px', width: 390, height: 844 },
  { name: 'Mobile 414px', width: 414, height: 896 },
  { name: 'Mobile 430px', width: 430, height: 932 },
  { name: 'Tablet 768px', width: 768, height: 1024 },
  { name: 'Desktop 1024px', width: 1024, height: 768 },
  { name: 'Desktop 1366px', width: 1366, height: 768 },
  { name: 'Desktop 1920px', width: 1920, height: 1080 },
];

const ROUTES = [
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
  '/admin',
  '/admin/school-info',
  '/admin/academics',
  '/admin/faculty',
  '/admin/facilities',
  '/admin/announcements',
  '/admin/events',
  '/admin/gallery',
  '/admin/achievements',
  '/admin/testimonials',
  '/admin/timeline',
  '/admin/enquiries',
  '/admin/alumni',
  '/admin/transport',
  '/admin/results',
  '/admin/settings',
];

async function runAudit() {
  console.log(`Starting responsive overflow audit at ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const issues = [];

  for (const route of ROUTES) {
    console.log(`\nTesting route: ${route}`);
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        // small wait for layout
        await page.waitForTimeout(300);

        const diagnostic = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;

          // Check if root or body has horizontal scroll
          const docScrollWidth = docEl.scrollWidth;
          const clientWidth = docEl.clientWidth;
          const bodyScrollWidth = body ? body.scrollWidth : 0;

          function isClippedByAncestor(el) {
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

          // Find elements extending beyond viewport width that are NOT clipped
          const overflowingElements = [];
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            // Ignore script, style, svg defs/paths
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'PATH', 'DEFS', 'LINEARGRADIENT'].includes(el.tagName)) continue;
            
            // Check bounding client rect
            const rect = el.getBoundingClientRect();
            // Visible elements only
            if (rect.width === 0 || rect.height === 0) continue;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;

            if (rect.right > clientWidth + 2 || rect.left < -2) {
              // Ignore if properly clipped within a parent container that fits inside viewport
              if (isClippedByAncestor(el)) continue;

              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || '',
                className: typeof el.className === 'string' ? el.className.split(' ').slice(0, 5).join(' ') : '',
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
                textSnippet: (el.textContent || '').trim().slice(0, 40)
              });
            }
          }

          return {
            clientWidth,
            docScrollWidth,
            bodyScrollWidth,
            hasDocOverflow: docScrollWidth > clientWidth,
            hasBodyOverflow: bodyScrollWidth > clientWidth,
            overflowingCount: overflowingElements.length,
            overflowingSample: overflowingElements.slice(0, 8),
          };
        }, vp.width);

        if (diagnostic.hasDocOverflow || diagnostic.hasBodyOverflow || diagnostic.overflowingCount > 0) {
          console.log(`  [OVERFLOW] ${vp.name} (${vp.width}px): docScroll=${diagnostic.docScrollWidth}, client=${diagnostic.clientWidth}, overflowingEls=${diagnostic.overflowingCount}`);
          issues.push({
            route,
            viewport: vp.name,
            width: vp.width,
            diagnostic
          });
        } else {
          // console.log(`  [OK] ${vp.name}`);
        }
      } catch (err) {
        console.error(`  [ERROR] on ${route} at ${vp.width}px: ${err.message}`);
      }
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`AUDIT FINISHED. Total overflow issues found: ${issues.length}`);
  console.log('========================================\n');

  if (issues.length > 0) {
    for (const issue of issues) {
      console.log(`Route: ${issue.route} | Viewport: ${issue.viewport} (${issue.width}px)`);
      console.log(`  Doc ScrollWidth: ${issue.diagnostic.docScrollWidth} vs ClientWidth: ${issue.diagnostic.clientWidth}`);
      console.log(`  Body ScrollWidth: ${issue.diagnostic.bodyScrollWidth}`);
      console.log(`  Overflowing Elements (${issue.diagnostic.overflowingCount}):`);
      for (const el of issue.diagnostic.overflowingSample) {
        console.log(`    <${el.tag} id="${el.id}" class="${el.className}"> width=${el.width} left=${el.left} right=${el.right} text="${el.textSnippet}"`);
      }
    }
  }
}

runAudit().catch(console.error);
