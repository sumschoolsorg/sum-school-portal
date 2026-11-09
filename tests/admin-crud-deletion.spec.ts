import { test, expect } from '@playwright/test';

const adminRoutes = [
  '/admin',
  '/admin/school-info',
  '/admin/research',
  '/admin/admissions',
  '/admin/enquiries',
  '/admin/academics',
  '/admin/results',
  '/admin/faculty',
  '/admin/facilities',
  '/admin/transport',
  '/admin/alumni',
  '/admin/banners',
  '/admin/homepage',
  '/admin/about',
  '/admin/announcements',
  '/admin/events',
  '/admin/gallery',
  '/admin/achievements',
  '/admin/timeline',
  '/admin/testimonials',
  '/admin/theme',
  '/admin/settings',
  '/admin/users',
  '/admin/migration',
  '/admin/ai-settings',
  '/admin/ai-assistant',
];

test.describe('Admin Portal Routes Full Audit & Integrity', () => {
  for (const route of adminRoutes) {
    test(`Admin module "${route}" renders successfully without runtime crash`, async ({ page }) => {
      // Set admin auth token in localStorage so protected routes allow inspection
      await page.addInitScript(() => {
        window.localStorage.setItem(
          'sum_auth_user',
          JSON.stringify({
            uid: 'admin-auditor-test',
            email: 'admin@sumschool.edu.in',
            displayName: 'System Auditor',
            role: 'super-admin',
          })
        );
        window.localStorage.setItem('sum_data_mode', 'local');
      });

      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);

      // Verify the page body is visible and contains no fatal error dialog
      await expect(page.locator('body')).toBeVisible();
      const pageText = await page.locator('body').innerText();
      expect(pageText).not.toContain('Application error: a client-side exception has occurred');
    });
  }
});

test.describe('Tombstone & Permanent Deletion Verification', () => {
  test('Deleted record in IndexedDB stays deleted across page reloads and never resurrects', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'sum_auth_user',
        JSON.stringify({
          uid: 'admin-auditor-test',
          email: 'admin@sumschool.edu.in',
          displayName: 'System Auditor',
          role: 'super-admin',
        })
      );
      window.localStorage.setItem('sum_data_mode', 'local');
    });

    await page.goto('/admin/announcements', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Verify deletion and tombstone tracking via browser IndexedDB
    const result = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open('sum_school_local_db', 6);
        req.onupgradeneeded = (e) => {
          const d = (e.target as IDBOpenDBRequest).result;
          if (!d.objectStoreNames.contains('announcements')) {
            d.createObjectStore('announcements', { keyPath: 'id' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      const storeName = 'announcements';
      const testId = 'test-ann-' + Date.now();
      const testItem = {
        id: testId,
        title: 'TEMPORARY_TEST_NOTICE',
        content: 'Testing permanent deletion.',
        status: 'published',
      };

      // Put item in store
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(testItem);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      // Verify item exists
      const retrieved = await new Promise<any>((resolve) => {
        const tx = db.transaction(storeName, 'readonly');
        const req = tx.objectStore(storeName).get(testId);
        req.onsuccess = () => resolve(req.result);
      });
      if (!retrieved || retrieved.id !== testId) {
        return { success: false, reason: 'Failed to put test item in IndexedDB' };
      }

      // Delete item
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).delete(testId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      // Add to tombstones in localStorage
      const tombstones = new Set(JSON.parse(localStorage.getItem('sum_school_deleted_tombstones') || '[]'));
      tombstones.add(testId);
      localStorage.setItem('sum_school_deleted_tombstones', JSON.stringify(Array.from(tombstones)));

      // Verify item is removed
      const afterDelete = await new Promise<any>((resolve) => {
        const tx = db.transaction(storeName, 'readonly');
        const req = tx.objectStore(storeName).get(testId);
        req.onsuccess = () => resolve(req.result);
      });
      if (afterDelete) {
        return { success: false, reason: 'Item still exists in IndexedDB after delete' };
      }

      return { success: true, testId };
    });

    expect(result.success).toBe(true);

    // Reload page to simulate browser reboot or reopen
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const postReload = await page.evaluate(async (id: string) => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open('sum_school_local_db', 6);
        req.onupgradeneeded = (e) => {
          const d = (e.target as IDBOpenDBRequest).result;
          if (!d.objectStoreNames.contains('announcements')) {
            d.createObjectStore('announcements', { keyPath: 'id' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      const check = await new Promise<any>((resolve) => {
        const tx = db.transaction('announcements', 'readonly');
        const req = tx.objectStore('announcements').get(id);
        req.onsuccess = () => resolve(req.result);
      });
      const tombstones = new Set(JSON.parse(localStorage.getItem('sum_school_deleted_tombstones') || '[]'));
      return {
        resurrectedInStore: !!check,
        tombstoneMaintained: tombstones.has(id),
      };
    }, result.testId!);

    expect(postReload.resurrectedInStore).toBe(false);
    expect(postReload.tombstoneMaintained).toBe(true);
  });
});
