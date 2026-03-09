import path from 'node:path';
import { expect, test } from '@playwright/test';
import { openSettingsSection, seedFavoriteShow } from './support/app.js';
import { blockExternalRequests } from './support/network.js';

const restoreFixturePath = path.resolve('tests/Fixtures/e2e/restore-backup.json');

test.beforeEach(async ({ page, baseURL }) => {
  await blockExternalRequests(page, baseURL);
});

test.describe('Backup And Restore', () => {
  test('user can open backup settings and understand the available restore controls', async ({ page }) => {
    // Arrange: the user starts on the calendar and wants to manage backups.
    await page.goto('/calendar');

    // Act: the user opens the backup settings panel.
    await openSettingsSection(page, 'Backup');

    // Assert: the user sees the backup headings and the file import controls needed for restore.
    await expect(page.getByRole('heading', { name: 'Backup', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Import Backup', exact: true })).toBeVisible();
    await expect(page.locator('#backupInput')).toBeAttached();
    await expect(page.getByText('Choose Backup to load')).toBeVisible();
  });

  test('user can restore a backup file and see the restored show in favorites', async ({ page, baseURL }) => {
    // Arrange: the user starts with an empty library and opens the backup restore panel.
    await page.goto('/calendar');
    await openSettingsSection(page, 'Backup');

    // Act: the user selects a backup file and confirms the restore.
    await page.locator('#backupInput').setInputFiles(restoreFixturePath);
    await expect(page.getByText('Restore Backup')).toBeVisible();
    await page.waitForTimeout(100);
    const restoreStarted = page.waitForResponse((response) =>
      response.url().includes('/settings/restore') &&
      response.request().method() === 'POST' &&
      response.ok()
    );
    await page.locator('#modal-btn-yes').evaluate((button) => button.click());
    await restoreStarted;
    await expect.poll(async () => {
      const response = await page.request.get(`${baseURL}/settings/restore/progress`, {
        headers: { 'X-DuckieTV-E2E': '1' }
      });
      const data = await response.json();

      return data.status;
    }, { timeout: 15000 }).toBe('completed');

    // Assert: after the restore finishes, the restored show appears in the favorites library.
    await page.goto('/favorites');
    await expect(page.locator('serieheader[title="Star Trek: Starfleet Academy"]')).toBeVisible({ timeout: 10000 });
  });

  test('user can restore with wipe enabled and replace the existing library', async ({ page, baseURL }) => {
    // Arrange: the user starts with one existing favorite and opens the backup restore panel.
    await page.goto('/calendar');
    await seedFavoriteShow(page, '1001');
    await openSettingsSection(page, 'Backup');

    // Act: the user chooses a backup, enables wipe, and confirms the restore.
    await page.locator('#wipebeforeImport').check();
    await page.locator('#backupInput').setInputFiles(restoreFixturePath);
    await expect(page.getByText('Restore Backup')).toBeVisible();
    await page.waitForTimeout(100);
    const restoreStarted = page.waitForResponse((response) =>
      response.url().includes('/settings/restore') &&
      response.request().method() === 'POST' &&
      response.ok()
    );
    await page.locator('#modal-btn-yes').evaluate((button) => button.click());
    await restoreStarted;
    await expect.poll(async () => {
      const response = await page.request.get(`${baseURL}/settings/restore/progress`, {
        headers: { 'X-DuckieTV-E2E': '1' }
      });
      const data = await response.json();

      return data.status;
    }, { timeout: 15000 }).toBe('completed');

    // Assert: the previous show is gone and the restored backup content replaces it.
    await page.goto('/favorites');
    await expect(page.locator('serieheader[title="Star Trek: Strange New Worlds"]')).toHaveCount(0);
    await expect(page.locator('serieheader[title="Star Trek: Starfleet Academy"]')).toBeVisible({ timeout: 10000 });
  });
});
