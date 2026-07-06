import { expect, test } from '@playwright/test';

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
	test('match screenshot', async ({ page }) => {
		await page.goto(`/portfolio/${path ?? title.toLowerCase().replace(' ', '-')}`);

		await expect(page.getByText(title)).toBeVisible();

		await expect(page).toHaveScreenshot({
			fullPage: true,
			maxDiffPixelRatio: 0.1
		});
	});
});
