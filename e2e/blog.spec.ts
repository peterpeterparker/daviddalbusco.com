import { expect, test } from '@playwright/test';

test('match screenshot', async ({ page }) => {
	await page.goto('/blog/making-your-website-ai-ready');

	await expect(page.getByText('Making Your Website AI-Ready')).toBeVisible();

	// https://github.com/microsoft/playwright/issues/6046#issuecomment-3641164427
	await page.waitForFunction(() => {
		return Array.from(document.querySelectorAll('img')).every(
			(img) => img.complete && img.naturalWidth > 0
		);
	});

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixelRatio: 0.1
	});
});
