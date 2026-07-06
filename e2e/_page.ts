import type { Page } from '@playwright/test';

export interface WebsitePageParams {
	page: Page;
}

export class WebsitePage {
	readonly #page: Page;

	constructor({ page }: WebsitePageParams) {
		this.#page = page;
	}

	get page(): Page {
		return this.#page;
	}

	async waitForImages() {
		// https://github.com/microsoft/playwright/issues/6046
		const lazyImages = await this.#page.locator('img[loading="lazy"]').all();

		for (const lazyImage of lazyImages) {
			await lazyImage.scrollIntoViewIfNeeded();
		}

		await this.#page.waitForFunction(() => {
			return Array.from(document.querySelectorAll('img')).every(
				(img) => img.complete && img.naturalWidth > 0
			);
		});
	}
}
