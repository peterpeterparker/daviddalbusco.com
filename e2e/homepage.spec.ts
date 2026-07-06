import { expect, test } from '@playwright/test';
import { WebsitePage } from './_page';

(['light', 'dark'] as const).forEach((mode) => {
	test.describe(`${mode} mode`, () => {
		test.use({ colorScheme: mode });

		test('match screenshot', async ({ page }) => {
			const home = new WebsitePage({ page });

			await page.goto('/');

			await expect(page.getByText('Hi there! 👋')).toBeVisible();

			await home.waitForImages();

			// Scroll back to top for background color
			await page.evaluate(() => window.scrollTo(0, 0));
			// Wait background css animation to get back the main color
			await page.waitForTimeout(500);

			await expect(page).toHaveScreenshot(`${mode}-mode.png`, {
				fullPage: true,
				maxDiffPixelRatio: 0.1,
				mask: [page.locator('#blog ~ div.grid')]
			});
		});
	});
});
