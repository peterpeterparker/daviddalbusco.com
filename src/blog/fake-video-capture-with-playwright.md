---
path: "/blog/fake-video-capture-with-playwright"
date: "2023-04-30"
title: "Fake video capture with Playwright"
description: "How to mock the camera for an End-to-End test that requires a video stream capture."
tags: "#playwright #test #e2e #programming"
image: "https://images.unsplash.com/photo-1579724186435-56a4bd84ab31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyfHxsZWdvJTIwdG95JTIwY2FtZXJhfGVufDB8fHx8MTY4Mjg2MzYxMQ&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://daviddalbusco.medium.com/fake-video-capture-with-playwright-9314e6380755"
---

![lego toy camera](https://images.unsplash.com/photo-1579724186435-56a4bd84ab31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyfHxsZWdvJTIwdG95JTIwY2FtZXJhfGVufDB8fHx8MTY4Mjg2MzYxMQ&ixlib=rb-4.0.3&q=80&w=1080)

_Photo by [Xavi Cabrera](https://unsplash.com/@xavi_cabrera?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

We recently added a QR code reader feature to NNS-dapp, a decentralized application that enables interaction with the Internet Computer’s [Network Nervous System](https://internetcomputer.org/nns). To ensure its maintainability, we created an end-to-end test using [Playwright](https://playwright.dev/) to simulate video capture for automation purposes. As we had to gather information from various sources to make this happen, I decided to share our insights in a single blog post to assist others who may encounter similar challenges.

---

## Demo

This is how one of our tests operates: it opens a modal that utilizes the QR code reader to read and decode the video stream. The decoded result is then parsed into a textarea and ultimately validated using pixel-based screenshot comparison.

![qrcodereader.gif](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.icp0.io/images/qrcodereader.gif?token=R1W6tS9Zj3eKo-bkHI9O6)

---

## Limitations

Before proceeding further, I would like to highlight the various technical limitations that are required to set up such a test. Please note that as of writing this article on April 30th, 2023, Playwright may have evolved since then. Therefore, it is always advisable to double-check the documentation first.

---

### Chrome only

It is not possible to mock the camera in Safari. As documented in this GitHub [issue](https://github.com/microsoft/playwright/issues/4532), it is possible to mock the video capture in Firefox, but it is not possible to provide a specific video file. Therefore, it is safe to assume that mocking the camera, the way we intended to do with Playwright, only works in Google Chrome.

---

### YUV4MPEG2

Based on my experimentation, it appears that the only video format that can be used by Chrome to feed a test file to `getUserMedia()` instead of live camera input is the [.y4m](https://wiki.multimedia.cx/index.php/YUV4MPEG2) file format. This file format is designed to hold uncompressed frames, so it is also worth noting that the video can be quite large in size.

---

## Playwright configuration

There is nothing in particular to set in the Playwright configuration unless you decide to use Chrome as the engine for your tests globally. In our case, we have done so in our open-source UI kit library called [gix-components](https://github.com/dfinity/gix-components) which is built with [SvelteKit](https://kit.svelte.dev/), and this is how we have configured it in our `playwright.config.ts` file.

```typescript
import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
	webServer: {
		command: "npm run build && npm run preview",
		port: 4173
	},
	testDir: "e2e",
	testMatch: ["**/*.e2e.ts"],
	use: {
		testIdAttribute: "data-tid",
		trace: "on"
	},
	projects: [
		{
			name: "Google Chrome",
			use: { ...devices["Desktop Chrome"], channel: "chrome" }
		}
	]
};

export default config;
```

---

## Test

To fake a video capture for the End-to-End test, you need to pass three arguments to Chromium during launch.

- `--use-fake-ui-for-media-stream`: eliminates the need to grant camera and microphone permissions during the test
- `--use-fake-device-for-media-stream`: injects a test pattern into `getUserMedia()` instead of using live camera input
- `--use-file-for-fake-video-capture=./your-file.y4m`: the path to the video file that should be used to simulate the camera video stream

Other than these arguments, there is no need to set anything else. Here is an example of a simple test that uses this approach.

```typescript
test("Read QR code with camera", async () => {
	const browser = await chromium.launch({
		args: [
			"--use-fake-ui-for-media-stream",
			"--use-fake-device-for-media-stream",
			"--use-file-for-fake-video-capture=./samples/qrcode.y4m"
		]
	});

	const context = await browser.newContext({
		permissions: ["camera"]
	});

	const page = await context.newPage();

	// Navigate
	await page.goto("/");

	// e.g. open the element that uses the QR code reader
	const modal = page.getByTestId("qr-code-modal");
	await modal.click();

	// Optimistically wait process to end
	await page.waitForTimeout(2000);

	await expect(page).toHaveScreenshot();
});
```

It’s worth noting that explicitly requesting permission to use the camera access using the [BrowserContext](https://playwright.dev/docs/api/class-browsercontext) of Playwright is not absolutely necessary as we are already granting such permission by using a launch argument. One can never be too sure isn’t it 😉?
