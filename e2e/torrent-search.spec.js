import { expect, test } from '@playwright/test';
import { openFavoriteShow, seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Torrent Search', () => {
  test('user can search for a torrent from an episode and add it to the client', async ({ page }) => {
    // Arrange: the user starts with a saved show and opens one episode.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteShow(page, 'Star Trek: Strange New Worlds');
    await page.getByText('EPISODES').click();
    await page.getByText('Strange New Worlds', { exact: true }).click();

    // Act: the user opens the torrent search dialog and adds a matching release.
    await page.getByText('Find a torrent').click();
    await expect(page.getByText('Star Trek Strange New Worlds S01E01 1080p WEB-DL')).toBeVisible();
    await page.locator('.torrent-add-client').first().click();

    // Assert: the user gets confirmation that the torrent was added to the client.
    await expect(page.getByText('Torrent added successfully')).toBeVisible();
  });
});
