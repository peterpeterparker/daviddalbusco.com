import { expect, test } from '@playwright/test';

(['light', 'dark'] as const).forEach((mode) => {
	test.describe(`${mode} mode`, () => {
		test.use({ colorScheme: mode });

		test('match screenshot', async ({ page }) => {
			await page.goto('/');

			await expect(page.getByText('Hi there! 👋')).toBeVisible();

			await expect(page).toHaveScreenshot(`${mode}-mode.png`, {
				fullPage: true,
				maxDiffPixelRatio: 0.1,
				mask: [page.locator('#blog ~ div.grid')]
			});
		});
	});
});
