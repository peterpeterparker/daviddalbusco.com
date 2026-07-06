import { expect, test } from '@playwright/test';
import { WebsitePage } from './_page';

test('match screenshot', async (args) => {
	const blog = new WebsitePage(args);
	const { page } = blog;

	await page.goto('/blog/making-your-website-ai-ready');

	await expect(page.getByText('Making Your Website AI-Ready')).toBeVisible();

	await blog.waitForImages();

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixelRatio: 0.1
	});
});
