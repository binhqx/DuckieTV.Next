import { expect, test } from '@playwright/test';
import { openFavoriteShow, seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Series Details', () => {
  test('user can open a favorite show and read its series details', async ({ page }) => {
    // Arrange: the user starts on the calendar and adds a show to an empty library.
    await page.goto('/calendar');
    await seedFavoriteShow(page);

    // Act: the user opens the saved show and expands the full series details view.
    await openFavoriteShow(page, 'Star Trek: Strange New Worlds');
    await expect(page.getByText('LAST EPISODE')).toBeVisible();
    await page.getByText('SERIES DETAILS').click();

    // Assert: the user sees the show metadata and binge-watch summary.
    const detailsPanel = page.locator('sidepanel .rightpanel');
    await expect(detailsPanel.getByText('AIRS ON')).toBeVisible();
    await expect(detailsPanel.getByText('Wikipedia')).toBeVisible();
    await expect(detailsPanel.getByText('IMDB')).toBeVisible();
    await expect(detailsPanel.getByText('TMDB')).toBeVisible();
    await expect(detailsPanel.getByText('TVDB')).toBeVisible();
    await expect(detailsPanel.getByRole('link', { name: 'Trakt' })).toBeVisible();
    await expect(detailsPanel.getByText('Paramount+')).toBeVisible();
    await expect(detailsPanel.getByText('Returning Series')).toBeVisible();
    await expect(detailsPanel.getByText('Science Fiction')).toBeVisible();
    await expect(detailsPanel.getByText('TO BINGE WATCH STAR TREK: STRANGE NEW WORLDS')).toBeVisible();
  });
});
