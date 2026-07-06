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
		// https://github.com/microsoft/playwright/issues/6046#issuecomment-3641164427
		await this.#page.waitForFunction(() => {
			return Array.from(document.querySelectorAll('img')).every(
				(img) => img.complete && img.naturalWidth > 0
			);
		});
	}
}
