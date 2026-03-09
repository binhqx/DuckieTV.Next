import { expect, test } from '@playwright/test';
import { openAutoDownloadStatus, openFavoriteEpisodes, openFavoriteShow, seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Auto-Download Backlog', () => {
  test.fixme('user can click download all from a favorite episodes view and fan out download requests for each episode', async ({ page }) => {
    // Arrange: the user starts with a favorite show and opens its episode list.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteEpisodes(page, 'Star Trek: Strange New Worlds');

    // Act: the user clicks Download All to trigger auto-download for the visible season.
    const responses = [];
    page.on('response', (response) => {
      if (response.url().includes('/episodes/') && response.url().includes('/auto-download')) {
        responses.push({ url: response.url(), status: response.status() });
      }
    });
    await page.getByText('Auto-download all', { exact: true }).click();

    // Assert: the user should trigger one request per episode and see a clean bulk-action outcome.
    await expect.poll(() => responses.length).toBeGreaterThan(0);
    await expect(page.locator('.toast')).not.toContainText('Failed');
  });

  test.fixme('user can auto-download a single episode from the episodes panel without opening the episode details view', async ({ page }) => {
    // Arrange: the user starts with a favorite show and opens its episode list.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteEpisodes(page, 'Star Trek: Strange New Worlds');

    // Act: the user clicks the single-episode auto-download control.
    await page.locator('.active-season-episode .auto-download-episode').first().click();

    // Assert: the user should see one episode-specific outcome instead of a bulk-action toast burst.
    await expect(page.locator('.toast')).toContainText(/Torrent launched|No suitable torrent|Already downloaded/i);
  });

  test.fixme('user cannot bulk auto-download episodes for a show hidden from calendar and sees a clear reason', async ({ page }) => {
    // Arrange: the user starts with a favorite show and hides it from the calendar.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteShow(page, 'Star Trek: Strange New Worlds');
    await page.getByText(/HIDE FROM CALENDAR|SHOW ON CALENDAR/i).click();
    await page.getByText('EPISODES', { exact: true }).click();

    // Act: the user clicks Download All.
    await page.getByText('Auto-download all', { exact: true }).click();

    // Assert: the user should see a gating message that explains why auto-download is disabled.
    await expect(page.locator('.toast')).toContainText(/calendar|disabled/i);
  });

  test.fixme('user sees a clear disconnected-client result when bulk auto-download cannot hand torrents to the client', async ({ page }) => {
    // Arrange: the user starts with a favorite show and opens its episode list while the torrent client is unavailable.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteEpisodes(page, 'Star Trek: Strange New Worlds');

    // Act: the user clicks Download All.
    await page.getByText('Auto-download all', { exact: true }).click();

    // Assert: the user should see one clear client-connection failure outcome instead of generic per-episode errors.
    await expect(page.locator('.toast')).toContainText(/torrent client|connect/i);
  });

  test.fixme('user sees a clean no-results outcome when bulk auto-download cannot find matching releases', async ({ page }) => {
    // Arrange: the user starts with a favorite show that has no matching releases in the current search providers.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteEpisodes(page, 'Star Trek: Strange New Worlds');

    // Act: the user clicks Download All.
    await page.getByText('Auto-download all', { exact: true }).click();

    // Assert: the user should see a controlled no-results message rather than repeated hard errors.
    await expect(page.locator('.toast')).toContainText(/No suitable torrent found|Nothing found/i);
  });

  test.fixme('user can review the auto-download status page after a bulk action and see one activity row per attempted episode', async ({ page }) => {
    // Arrange: the user starts with a favorite show and triggers a bulk auto-download attempt.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteEpisodes(page, 'Star Trek: Strange New Worlds');
    await page.getByText('Auto-download all', { exact: true }).click();

    // Act: the user opens the auto-download status page to inspect what happened.
    await openAutoDownloadStatus(page);

    // Assert: the user should see the activity rows and status labels that explain each attempted episode outcome.
    await expect(page.locator('.autodlstatus-container table')).toContainText(/s01e01|S01E01/i);
  });
});
