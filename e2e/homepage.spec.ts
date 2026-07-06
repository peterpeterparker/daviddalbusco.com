import { expect, test } from '@playwright/test';
import { WebsitePage } from './_page';

(['light', 'dark'] as const).forEach((mode) => {
	test.describe(`${mode} mode`, () => {
		test.use({ colorScheme: mode });

		test('match screenshot', async (args) => {
			const home = new WebsitePage(args);
			const { page } = home;

			await page.goto('/');

			await expect(page.getByText('Hi there! 👋')).toBeVisible();

			await home.waitForImages();

			await expect(page).toHaveScreenshot(`${mode}-mode.png`, {
				fullPage: true,
				maxDiffPixelRatio: 0.1,
				mask: [page.locator('#blog ~ div.grid')]
			});
		});
	});
});
