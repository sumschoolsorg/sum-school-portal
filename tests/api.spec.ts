import { expect, test } from '@playwright/test';

test.describe('Public lookup API request validation', () => {
  for (const endpoint of ['/api/results/lookup', '/api/admissions/track']) {
    test(`${endpoint} returns 400 for malformed JSON`, async ({ request }) => {
      const response = await request.post(endpoint, {
        data: '{',
        headers: { 'content-type': 'application/json' },
      });

      expect(response.status()).toBe(400);
      expect(await response.json()).toMatchObject({ success: false });
    });
  }
});
