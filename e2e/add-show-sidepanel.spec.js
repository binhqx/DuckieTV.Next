import { expect, test } from '@playwright/test';
import { openAddShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Add Show Sidepanel', () => {
  test('user can inspect a search result before adding it to favorites', async ({ page }) => {
    // Arrange: the user opens the add-show panel from the calendar.
    await page.goto('/calendar');
    await openAddShow(page);
    await page.locator('#search-input').fill('Strange New Worlds');
    await page.locator('#search-form').press('Enter');

    // Act: the user clicks the show tile itself to inspect the show details.
    const showCard = page.locator('serieheader[title="Star Trek: Strange New Worlds"]');
    await expect(showCard).toBeVisible();
    await showCard.click();

    // Assert: the sidepanel shows the show metadata and add action instead of reloading search UI.
    const panel = page.locator('sidepanel .leftpanel');
    await expect(panel.locator('h3')).toContainText('Star Trek: Strange New Worlds');
    await expect(panel.getByText('ADD TO FAVORITES')).toBeVisible();
    await expect(panel.getByText('WATCH TRAILER')).toBeVisible();
    await expect(panel.getByText('Wikipedia')).toBeVisible();
    await expect(panel.getByText('IMDB')).toBeVisible();
    await expect(panel.getByText('TMDB')).toBeVisible();
    await expect(panel.getByText('TVDB')).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Trakt' })).toBeVisible();
    await expect(panel.getByText('CONTENT RATING')).toBeVisible();
    await expect(panel.getByText('COUNTRY')).toBeVisible();
    await expect(panel.getByText('NETWORK')).toBeVisible();
    await expect(page.locator('sidepanel #search-input')).toHaveCount(0);
  });
});
