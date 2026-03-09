import { expect, test } from '@playwright/test';
import { openFavoriteShow, seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Series Calendar Visibility', () => {
  test('user can hide a show from the calendar from the series overview', async ({ page }) => {
    // Arrange: the user starts with a saved show in favorites.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteShow(page, 'Star Trek: Strange New Worlds');

    // Act: the user hides the show from the calendar.
    await expect(page.getByText('HIDE FROM CALENDAR')).toBeVisible();
    await page.getByText('HIDE FROM CALENDAR').click();

    // Assert: the user sees the calendar visibility state switch in the series overview.
    await expect(page.getByText('Calendar visibility updated')).toBeVisible();
    await expect(page.getByText('SHOW ON CALENDAR')).toBeVisible();
  });
});
