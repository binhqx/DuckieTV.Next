import { expect, test } from '@playwright/test';
import { openFavoriteShow, seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Episodes', () => {
  test('user can browse episodes for a favorite show and open an episode', async ({ page }) => {
    // Arrange: the user starts with a favorite show available in the library.
    await page.goto('/calendar');
    await seedFavoriteShow(page);

    // Act: the user opens the show, browses episodes, and selects one episode.
    await openFavoriteShow(page, 'Star Trek: Strange New Worlds');
    await page.getByText('EPISODES').click();
    await expect(page.getByRole('heading', { name: 'Season 1' })).toBeVisible();
    await page.getByText('Strange New Worlds', { exact: true }).click();

    // Assert: the user sees the episode details and actions for that episode.
    await expect(page.getByRole('heading', { name: /Star Trek: Strange New Worlds - s01e01/i })).toBeVisible();
    await expect(page.getByText('The Enterprise begins a new mission.')).toBeVisible();
    await expect(page.getByText('Find a torrent')).toBeVisible();
  });

  test('user can mark an episode as watched from the episode details view', async ({ page }) => {
    // Arrange: the user starts with a favorite show and opens one episode.
    await page.goto('/calendar');
    await seedFavoriteShow(page);
    await openFavoriteShow(page, 'Star Trek: Strange New Worlds');
    await page.getByText('EPISODES').click();
    await page.getByText('Strange New Worlds', { exact: true }).click();

    // Act: the user marks the episode as watched.
    await page.locator('.mark-watched-button').click();

    // Assert: the user gets confirmation that the watched state changed.
    await expect(page.getByText('Watched status updated')).toBeVisible();
  });
});
