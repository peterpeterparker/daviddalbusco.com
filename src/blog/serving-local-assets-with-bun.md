---
path: "/blog/serving-local-assets-with-bun"
date: "2026-04-17"
title: Serving Local Assets with Bun
description: "A minimal Bun script to serve static files locally without extra dependencies."
tags: "#bun #javascript #typescript #static-assets #local-development"
image: "https://daviddalbusco.com/assets/images/logan-voss-1QlMVjKbJrY-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/logan-voss-1QlMVjKbJrY-unsplash.jpg)

> Photo by [Logan Voss](https://unsplash.com/fr/@loganvoss?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/lignes-et-graphiques-abstraits-aux-teintes-bleues-et-roses-1QlMVjKbJrY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I don't always have to write about a super niche topic, I guess. So, I thought about sharing a small helper I've developed for this website.

I'm hosting my website on Juno, the full-stack platform I developed to deploy and run apps in WASM containers with zero DevOps. I do so in a bit of an unconventional way because I like to have many different variants of what's possible with my tooling. This way it's not solely tested with a large automated test base but also IRL.

For this particular use case, I deviated from the standard way of deploying by uploading its assets using `juno run`, a command that allows running arbitrary scripts in the context of the Juno CLI or GitHub Actions.

I do so because after crossposting my posts for a long time, I switched to having my website as the canonical source. That meant collecting all the images I had been using, since I didn't want to rely on any external sources. Rather than dropping them into the SvelteKit static folder, I decided to handle them as pure static assets. Given the number of images, it just felt like it would keep the build and dev experience smoother.

That's possible and even easy to do because my container can serve web storage. I just had to write a [little script](https://github.com/peterpeterparker/daviddalbusco.com/blob/main/juno.upload.assets.ts).

Everything worked fine, except locally I kept running into a chicken-and-egg issue when writing new articles: the new images I was using weren't available until I deployed them, but I couldn't deploy them until my post was wrapped up.

Long story short, I needed to serve them locally. One option would have been `npx serve`, but I try to avoid anything Vercel. I could have searched for a handy npm package, but that's always one more dependency. I could have written a quick Node script (gosh, so many options nowadays 😄), but lately I've been having fun with Bun, which is already installed on my machine and provides a [high-performance server](https://bun.com/docs/runtime/http/server).

---

## Serve Assets with Bun

So I went with this last solution and set up the following little script.

```ts
import { join } from "node:path";

const BASE_PATH = "./assets";
const PORT = 3000;

Bun.serve({
	port: PORT,
	async fetch({ url }) {
		const { pathname } = new URL(url);
		const filePath = join(BASE_PATH, pathname);
		const file = Bun.file(filePath);
		return new Response(file);
	},
	error(error) {
		return new Response(`Error: ${error.message}`, { status: 404 });
	}
});

console.log(`Assets served from ${BASE_PATH} on http://localhost:${PORT}`);
```

It's pretty minimal:

- `fetch` handles every incoming request
- No routing is needed, which was actually the "trickiest" part to figure out since most Bun examples show named routes.
- It resolves the request using the URL `pathname` against the `./assets` folder
- Reads the file with `Bun.file`
- And streams it back as a `Response`.

If anything goes wrong (file not found, bad path), the `error` handler catches it all and returns a `404`.

That's it. No rocket science, just Bun doing what it does well.

Until next time!
David

---

PS: for this to work locally, if someone is interested in implementing a similar setup, I actually also set a `PUBLIC_ASSETS` environment variable pointing to http://localhost:3000 and replace the image URLs in my markdown SSG generator accordingly.
