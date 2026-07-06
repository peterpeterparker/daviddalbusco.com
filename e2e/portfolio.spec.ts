import { expect, test } from '@playwright/test';
import { WebsitePage } from './_page';

[
	{ title: 'DFINITY' },
	{ title: 'Die Mobiliar' },
	{ title: 'ETH Library Lab' },
	{ title: 'DV Bern AG', path: 'dvbern' },
	{
		title: 'Our Energy - ETH Zürich',
		path: 'our-energy-eth-zurich'
	},
	{ title: 'ineexa' },
	{ title: 'Bonjour Foundation', path: 'bonjour' },
	{ title: 'Owlly' }
].forEach(({ title, path }) => {
	const client = path ?? title.toLowerCase().replaceAll(' ', '-');

	test.describe(title, () => {
		test('match screenshot', async ({ page }) => {
			const portfolio = new WebsitePage({ page });

			await page.goto(`/portfolio/${client}`);

			await expect(page.getByRole('heading', { name: title })).toBeVisible();

			await portfolio.waitForImages();

			await expect(page).toHaveScreenshot(`${client}.png`, {
				fullPage: true,
				maxDiffPixelRatio: 0.1
			});
		});
	});
});
