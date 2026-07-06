import { expect, test } from '@playwright/test';

test('match screenshot', async ({ page }) => {
	await page.goto('/blog/making-your-website-ai-ready');

	await expect(page.getByText('Making Your Website AI-Ready')).toBeVisible();

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixelRatio: 0.1
	});
});
