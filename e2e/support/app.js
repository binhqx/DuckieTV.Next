import { expect } from '@playwright/test';

export async function openAddShow(page) {
  await page.locator('#add_favorites a').click();
  await expect(page.locator('#search-input')).toBeVisible();
}

export async function addFavoriteShow(page, query, expectedTitle) {
  await openAddShow(page);
  await page.locator('#search-input').fill(query);
  await page.locator('#search-form').press('Enter');

  const showCard = page.locator(`serieheader[title="${expectedTitle}"]`);
  await expect(showCard).toBeVisible();
  const addButton = page.locator(`serieheader[title="${expectedTitle}"] .earmark.add`);

  if (await addButton.count()) {
    await addButton.click();
  }
}

export async function seedFavoriteShow(page, traktId = '1001') {
  await page.evaluate(async (id) => {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    await fetch('/search/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-CSRF-TOKEN': token,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: new URLSearchParams({ trakt_id: id }).toString()
    });
  }, traktId);
}

export async function openFavorites(page) {
  await page.locator('#favorites a').click();
  await expect(page.locator('series-list form[action$="/favorites"] input[name="q"]')).toBeVisible();
}

export async function openFavoriteShow(page, title) {
  await page.goto('/favorites');
  const showCard = page.locator(`serieheader[title="${title}"]`);
  await expect(showCard).toBeVisible();
  await showCard.evaluate((el) => el.click());
  await expect(page.getByText('LAST EPISODE')).toBeVisible();
}

export async function openSettings(page) {
  await page.locator('#actionbar_settings a').click();
  await expect(page.getByText('SETTINGS')).toBeVisible();
}

export async function openAutoDownloadStatus(page) {
  await page.locator('#actionbar_autodlstatus a').click();
}

export async function openSettingsSection(page, sectionName) {
  await openSettings(page);
  await page.getByText(sectionName, { exact: true }).click();
}
