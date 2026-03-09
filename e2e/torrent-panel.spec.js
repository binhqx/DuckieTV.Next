import { expect, test } from '@playwright/test';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Torrent Panel', () => {
  test('user can open the transmission panel and see client status', async ({ page }) => {
    // Arrange: the user starts on the calendar with fake torrent client responses enabled.
    await page.goto('/calendar');

    // Act: the user opens the torrent client panel.
    await page.getByTitle('Transmission').click();

    // Assert: the user sees the transmission panel and torrent status controls.
    await expect(page.getByText('DuckieTorrent Transmission')).toBeVisible();
    await expect(page.locator('#getTorrentsCount')).toBeVisible();
  });

  test('user can open a torrent and trigger start, stop, and remove actions', async ({ page }) => {
    // Arrange: the user starts on the calendar with one fake torrent available in the client.
    await page.goto('/calendar');

    // Act: the user opens the torrent panel, opens the torrent details, and uses the controls.
    await page.getByTitle('Transmission').click();
    await page.getByText('Star Trek Strange New Worlds S01E01 1080p WEB-DL').click();
    await expect(page.getByText('Torrent Details')).toBeVisible();
    await page.getByText('Start').click();
    await expect(page.getByText('Torrent start successful')).toBeVisible();
    await page.getByText('Stop').click();
    await expect(page.getByText('Torrent stop successful')).toBeVisible();
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByText('Remove').click();

    // Assert: the user sees successful feedback for the torrent actions.
    await expect(page.getByText('Torrent remove successful')).toBeVisible();
  });
});
