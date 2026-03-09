import { expect, test } from '@playwright/test';
import { openAutoDownloadStatus, openFavoriteShow, seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Auto-Download', () => {
  test('user can open the auto-download status page and understand the current empty state', async ({ page }) => {
    // Arrange: the user starts on the calendar with a fresh E2E database.
    await page.goto('/calendar');

    // Act: the user opens the auto-download status panel.
    await openAutoDownloadStatus(page);

    // Assert: the user sees the page title, the last-run summary, and an empty activity state.
    await expect(page.getByRole('heading', { name: /Auto-Download Service Monitor/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Last Run: Never/i })).toBeVisible();
    await expect(page.locator('.autodlstatus-container table')).toContainText('No Activity');
  });

  test('user can turn per-show auto-download on from the series overview', async ({ page }) => {
    // Arrange: the user starts with a favorite show in the library.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteShow(page, 'Star Trek: Strange New Worlds');

    // Act: the user enables auto-download for that series.
    await expect(page.getByText(/AUTO-DOWNLOAD: ENABLED|AUTO-DOWNLOAD: DISABLED/i)).toBeVisible();
    const autoDownloadLabel = page.getByText(/AUTO-DOWNLOAD: ENABLED|AUTO-DOWNLOAD: DISABLED/);
    const initialLabel = await autoDownloadLabel.textContent();
    await autoDownloadLabel.click();

    // Assert: the user sees the per-show auto-download state change.
    if (initialLabel?.includes('DISABLED')) {
      await expect(page.getByText('AUTO-DOWNLOAD: ENABLED')).toBeVisible();
    } else {
      await expect(page.getByText('AUTO-DOWNLOAD: DISABLED')).toBeVisible();
    }
  });
});
