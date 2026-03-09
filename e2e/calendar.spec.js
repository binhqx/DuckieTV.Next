import { expect, test } from '@playwright/test';
import { seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Calendar', () => {
  test('user can navigate from month view into the yearly overview and back to a month with episodes', async ({ page }) => {
    // Arrange: the user starts with one saved show that has an episode in May 2022.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await page.goto('/calendar?mode=month&date=2022-05-05');

    // Act: the user zooms out to the year view and then drills back into May.
    await page.getByRole('heading', { name: 'May 2022' }).click();
    await expect(page.getByRole('heading', { name: '2022' })).toBeVisible();
    await page.locator('[date-picker] .month').nth(4).click();

    // Assert: the user returns to the May 2022 month view and sees the saved episode on the calendar.
    await expect(page.getByRole('heading', { name: 'May 2022' })).toBeVisible();
    await expect(page.getByText('Star Trek: Strange New Worlds - s01e01')).toBeVisible();
  });

  test('user can mark a day as watched from the calendar and see the episode as completed', async ({ page }) => {
    // Arrange: the user opens the calendar on a week that contains a saved episode.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await page.goto('/calendar?mode=week&date=2022-05-05');

    // Act: the user marks the whole day as watched.
    await page.locator('a[title="Mark day as watched"]').click();

    // Assert: the calendar shows the episode as watched in the refreshed week view.
    await expect(page.locator('.watchedpos')).toHaveCount(1);
    await expect(page.getByText('Star Trek: Strange New Worlds - s01e01')).toBeVisible();
  });

  test('user can mark a day as downloaded from the calendar and see the success message', async ({ page }) => {
    // Arrange: the user opens the calendar on a week that contains a saved episode.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await page.goto('/calendar?mode=week&date=2022-05-05');

    // Act: the user marks the whole day as downloaded.
    await page.locator('a[title="Mark day as downloaded"]').click();

    // Assert: the calendar confirms the day-level download update after the refresh.
    await expect(page.getByText('Marked all episodes on 2022-05-05 as downloaded.')).toBeVisible();
    await expect(page.getByText('Star Trek: Strange New Worlds - s01e01')).toBeVisible();
  });
});
