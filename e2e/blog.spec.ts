import { expect, test } from '@playwright/test';
import { WebsitePage } from './_page';

test('match screenshot', async ({ page }) => {
	const blog = new WebsitePage({ page });

	await page.goto('/blog/making-your-website-ai-ready');

	await expect(page.getByRole('heading', { name: 'Making Your Website AI-Ready' })).toBeVisible();

	await blog.waitForImages();

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixelRatio: 0.1
	});
});
