export async function blockExternalRequests(page, baseURL) {
  await page.route('**/*', async route => {
    const url = route.request().url();

    if (
      url.startsWith(baseURL) ||
      url.startsWith('data:') ||
      url.startsWith('about:')
    ) {
      await route.continue();
      return;
    }

    await route.abort();
  });
}
