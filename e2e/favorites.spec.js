import { expect, test } from '@playwright/test';
import { openFavoriteShow, seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Favorites', () => {
  test('user can add a show from search and find it in favorites', async ({ page }) => {
    // Arrange: the user starts on the calendar with an empty E2E test database.
    await page.goto('/calendar');

    // Act: the user opens the add-show panel, searches for a show, and adds it.
    await page.getByTitle('Add a show').click();
    await page.locator('#search-input').fill('Strange New Worlds');
    await page.locator('#search-form').press('Enter');

    const showCard = page.locator('serieheader[title="Star Trek: Strange New Worlds"]');
    await expect(showCard).toBeVisible();

    const addButton = page.locator('serieheader[title="Star Trek: Strange New Worlds"] .earmark.add');
    if (await addButton.count()) {
      await addButton.click();
    }

    // Assert: the user sees the newly added show in favorites.
    await page.locator('#favorites a').click();
    await expect(page.locator('serieheader[title="Star Trek: Strange New Worlds"]')).toBeVisible();
  });

  test('user can remove a show from favorites and see it disappear from the library', async ({ page }) => {
    // Arrange: the user starts with one favorite show already saved.
    await page.goto('/calendar');
    await seedFavoriteShow(page);

    // Act: the user opens the saved show and removes it from favorites.
    await openFavoriteShow(page, 'Star Trek: Strange New Worlds');
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByText('DELETE SERIES').click();

    // Assert: the user returns to favorites and no longer sees the removed show.
    await page.waitForURL('**/favorites');
    await expect(page.locator('serieheader[title="Star Trek: Strange New Worlds"]')).toHaveCount(0);
    await expect(page.getByText('You have no series yet!')).toBeVisible();
  });
});
