import { expect, test } from '@playwright/test';
import { openSettings } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Settings', () => {
  test('user can open auto-download settings and understand the current state', async ({ page }) => {
    // Arrange: the user starts on the calendar and opens the application settings.
    await page.goto('/calendar');
    await openSettings(page);
    await expect(page.getByText('SETTINGS')).toBeVisible();

    // Act: the user opens the auto-download settings section.
    await page.getByRole('link', { name: /Auto-Download Torrents/i }).click();
    await expect(page.getByText('Current Setting:')).toBeVisible();

    // Assert: the user sees the current auto-download state and available controls.
    await expect(page.getByText(/Auto-Download is (disabled|active)\./i)).toBeVisible();
    await expect(page.locator('#autodownload_period_hours')).toBeVisible();
  });

  test('user can change the auto-download check frequency and see the saved value', async ({ page }) => {
    // Arrange: the user starts on the auto-download settings panel.
    await page.goto('/calendar');
    await openSettings(page);
    await page.getByRole('link', { name: /Auto-Download Torrents/i }).click();

    // Act: the user changes how often DuckieTV checks for new episodes.
    await page.locator('#autodownload_period_hours').fill('3');
    await page.locator('form[data-section="auto-download"]').first().locator('button[type="submit"]').click();

    // Assert: the user sees the updated frequency reflected in the panel.
    await expect(page.locator('#autodownload_period_hours')).toHaveValue('3');
  });
});
