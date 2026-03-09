import { expect, test } from '@playwright/test';
import { blockExternalRequests } from './support/network.js';

test.describe('DuckieTV E2E Seed', () => {
  test('seed', async ({ page }) => {
    // Arrange: the user starts from the default E2E entry point with fake services enabled.
    await blockExternalRequests(page, 'http://127.0.0.1:8010');

    // Act: the user opens the main calendar view.
    await page.goto('/calendar');

    // Assert: the user sees the main controls needed for core flows.
    await expect(page.getByTitle('Add a show')).toBeVisible();
    await expect(page.getByTitle('Transmission')).toBeVisible();
  });
});
