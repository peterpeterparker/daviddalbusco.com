---
path: "/blog/you-better-screenshot-test-your-website"
date: "2026-09-24"
title: You Better Screenshot Test Your Website
description: "Trust no one and make sure your site looks exactly as it should, in light and dark mode."
tags: "#webdev #testing #e2e #playwright"
image: "https://daviddalbusco.com/assets/images/TODO.jpg"
---

![](https://daviddalbusco.com/assets/images/TODO.jpg)

> Photo by [TODO](https://unsplash.com) on [Unsplash](https://unsplash.com)

Have you ever updated a few libraries or the framework of your website, had a quick look, pushed to main and deployed it straight to production, because who cares, it's just your personal website, only to figure out weeks later, out of nowhere, that some colors were suddenly off or that some layout issue had popped up?

You might say no, at least publicly, but I bet it happened to you a few times. Or I'm a weirdo, as it actually happened to me a few times in the past.

When I build serious projects, I of course set up various test suites, notably screenshot tests, but so far I never did so for my own website. Then this summer it happened again, and: "Enough is enough! I have had it with these monkey-fighting bugs on this Monday-to-Friday site!" So I finally set up a test and the pipelines.

Here's my recipe: a Playwright test that covers light and dark mode, a trick to ignore dynamic content, and the two GitHub Actions workflows that make it work. Everything you need to start validating your website, because trust me, you should!

---

## 1. A shared page object

My website, and likely yours, isn't only a landing page. There are also blog posts, portfolio entries, etc., many pages that share common traits. That's why I start with a small class that any test can extend:

```typescript
import type { Page } from "@playwright/test";

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
			return Array.from(document.querySelectorAll("img")).every(
				(img) => img.complete && img.naturalWidth > 0
			);
		});
	}
}
```

In my case, because I have a somewhat particular setup, a few images are fetched from production when I run the tests (don't judge me). Taking screenshots without waiting for those to be loaded would be flaky, so I added a common `waitForImages` function to make sure they are.

It scrolls each lazy image into view, so the browser actually starts fetching it, then waits until every image on the page is loaded, meaning `complete` and with a `naturalWidth`, since `complete` alone is also `true` for an image that failed to load.

One might argue I should do the same for the fonts, even though I self-host them, to which I would answer: absolutely. So far, though, no issue.

Long story short, before performing screenshot testing, make sure everything is loaded, and if there's anything to wait for, expose it as a common feature.

---

## 2. The test

Playwright ships with `toHaveScreenshot`, which does most of the heavy lifting. The first run records a reference image. Every later run compares against it.

The small trick I like is to loop over the color schemes and use `test.use({ colorScheme })`, so the same test runs twice, once per mode:

```typescript
import { expect, test } from "@playwright/test";
import { WebsitePage } from "./_page";

(["light", "dark"] as const).forEach((mode) => {
	test.describe(`${mode} mode`, () => {
		test.use({ colorScheme: mode });

		test("match screenshot", async ({ page }) => {
			const home = new WebsitePage({ page });

			await page.goto("/");

			await expect(page.getByText("Hi there! 👋")).toBeVisible();

			await home.waitForImages();

			await expect(page).toHaveScreenshot(`${mode}-mode.png`, {
				fullPage: true,
				maxDiffPixelRatio: 0.1,
				mask: [page.locator("#blog ~ div.grid")]
			});
		});
	});
});
```

`colorScheme` emulates `prefers-color-scheme`, so if your theme follows the OS setting, your test should inherit the proper attributes. In my case, the website looks the same in dark and light mode so, basically, what I'm asserting is that it indeed looks the same regardless of the OS preferences. Told you, trust no one ;)

`maxDiffPixelRatio` allows a bit of tolerance, so anti-aliasing noise doesn't turn into a failing build.

As for the mask, I'll explain it in the next chapter.
---

## 3. Hiding dynamic content

A screenshot test is only useful if it fails for the right reasons. My homepage lists the latest blog posts, so every time I publish something new, the homepage changes and the test fails, even though nothing is broken.

To handle that, or to work around it I should say, Playwright has a `mask` option. It takes a list of locators, and each matching element is covered with a solid box in the screenshot, both when the reference is recorded and when it's compared. Whatever renders underneath doesn't matter anymore:

```typescript
await expect(page).toHaveScreenshot(`${mode}-mode.png`, {
	fullPage: true,
	maxDiffPixelRatio: 0.1,
	mask: [page.locator("#blog ~ div.grid")]
});
```

In my case, `#blog ~ div.grid` targets the grid of cards that follows the blog section's heading. The heading is still compared, but the list of posts isn't, which isn't that wrong per se, as the test is meant to ensure the design stays in place, not that the content is rendered correctly.

> Note: I used a CSS selector here because it was quick to write. It's exactly the kind of thing I argued against in my [type-safe attribute selectors](https://daviddalbusco.com/blog/type-safe-attribute-selectors-for-e2e-testing) post, so a `getByTestId` would be cleaner. Do as I say, not as I do 😅.

---

## 4. The config

Most of the config is standard. I run the tests against a preview of the production build, and disable animations and the caret globally for all screenshots:

```typescript
import { defineConfig, devices } from "@playwright/test";

const DEV = (process.env.NODE_ENV ?? "production") === "development";

export default defineConfig({
	webServer: [
		{
			command: "pnpm preview",
			url: "http://localhost:4173",
			reuseExistingServer: true
		}
	],
	testDir: "./e2e",
	snapshotDir: `./${DEV ? "tmp" : "e2e"}/snapshots`,
	testMatch: ["**/*.e2e.ts", "**/*.spec.ts"],
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	workers: process.env.CI ? 1 : undefined,
	expect: {
		toHaveScreenshot: {
			animations: "disabled",
			caret: "hide"
		}
	},
	use: {
		testIdAttribute: "data-tid",
		baseURL: "http://localhost:4173",
		trace: "on",
		...(DEV && { headless: false })
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		}
	]
});
```

The important line is `snapshotDir`. Font rendering differs between operating systems, so a screenshot taken on my Mac will never match one taken on the Ubuntu runner of GitHub Actions. That's why the reference snapshots, the ones committed in the repo, are always generated on CI. When I run the tests locally in development mode, the snapshots go to a `tmp` folder that is git-ignored, so I can still play around without messing with the references.

To make this practical, I wrapped the various commands in scripts in the `package.json`. The ones with `NODE_ENV=development` are for local use, the others are used by the workflows:

```json
"e2e": "NODE_ENV=development playwright test",
"e2e:ci": "playwright test --reporter=html",
"e2e:snapshots": "playwright test --update-snapshots --reporter=list",
"e2e:snapshots:local": "NODE_ENV=development playwright test --update-snapshots --reporter=list",
"e2e:report": "playwright show-report",
"e2e:playwright:install": "playwright install chromium --with-deps"
```

Which brings us to the workflows.

---

## 5. Running the tests

The first workflow runs on every pull request. It builds the site, installs Chromium, runs the suite and, if it fails, uploads the report so I can look at the diffs:

```yaml
name: E2E Tests

on:
  pull_request:
  workflow_dispatch:

jobs:
  e2e:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false

      - name: Prepare
        uses: ./.github/actions/prepare

      - name: Build # Required to run pnpm preview
        run: pnpm build

      - name: Prepare Playwright
        run: pnpm run e2e:playwright:install

      - name: Run tests
        run: pnpm run e2e:ci

      - name: Upload Playwright report on failure
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        if: ${{ failure() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 3

      - name: Upload Playwright results on failure
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        if: ${{ failure() }}
        with:
          name: test-results
          path: test-results/
          retention-days: 3

  may-merge:
    needs: ["e2e"]
    runs-on: ubuntu-latest
    steps:
      - name: Cleared for merging
        run: echo OK
```

The HTML report is where the fun is. For each failing screenshot, Playwright shows the expected image, the actual one, and a diff with the changed pixels highlighted. That's usually enough to spot the color that went off.

For completeness, `./.github/actions/prepare` is just a small composite action of mine that sets up pnpm and Node, and installs the dependencies. I reuse it across the workflows of the repo:

```yaml
name: Prepare

description: Checkout and install dependencies

runs:
  using: composite
  steps:
    - name: Install pnpm
      uses: pnpm/action-setup@0e279bb959325dab635dd2c09392533439d90093 # v6.0.8

    - name: Setup node
      uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
      with:
        node-version-file: ".node-version"
        registry-url: "https://registry.npmjs.org"
        cache: pnpm

    - name: Install dependencies
      shell: bash
      run: pnpm i --frozen-lockfile

    - name: Prepare
      shell: bash
      run: pnpm prepare
```

---

## 6. Recreating the snapshots

The very first time, there are no references at all. Playwright then fails the test and only writes the actual screenshot, so they have to be generated once. Same thing whenever I add a new test or there is an intended change that updates the design.

Either way, it has to happen on CI, for the reason explained above.

That's the job of the second workflow. I trigger it manually on the branch of the pull request. It runs Playwright with `--update-snapshots` and commits the new images back to the branch:

```yaml
name: Update E2E Screenshots

on:
  workflow_dispatch:

jobs:
  tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        # persist-credentials required to commit screenshots

      - name: Prepare
        uses: ./.github/actions/prepare

      - name: Build # Required to run pnpm preview
        run: pnpm build

      - name: Prepare Playwright
        run: pnpm run e2e:playwright:install

      - name: Run Playwright tests
        run: pnpm run e2e:snapshots

      - name: Commit Playwright updated screenshots
        uses: EndBug/add-and-commit@290ea2c423ad77ca9c62ae0f5b224379612c0321 # v10.0.0
        if: ${{ github.ref != 'refs/heads/main' }}
        with:
          add: ./e2e
          default_author: github_actions
          message: "🤖 update tests screenshots"
```

The `if` condition is a small safety net: the workflow never commits to `main` directly. The updated screenshots always land in a pull request, where I can review them like any other change. GitHub even renders image diffs, handy.

---

## Conclusion

Nothing fancy I guess but, hope it can save you too from having a website whose design doesn't look right without you knowing.

And if you didn't get the memo yet: trust no one, screenshot everything! 😉

Until next time!
David
