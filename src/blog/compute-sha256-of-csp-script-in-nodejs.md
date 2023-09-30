---
path: "/blog/compute-sha256-of-csp-script-in-nodejs"
date: "2022-09-17"
title: "Compute sha256 of CSP <script/> in NodeJS"
description: "Automatically generate the SHA-256 hash of the script tags for the Content Security Policy"
tags: "#javascript #nodejs #security #webdev"
image: "https://images.unsplash.com/photo-1516750484197-6b28d10c91ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw0NXx8bWFueSUyMGNhdHN8ZW58MHx8fHwxNjYzNDIxNDgx&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://daviddalbusco.medium.com/compute-sha256-of-csp-script-in-nodejs-720b887bcae6"
---

![Delilah](https://images.unsplash.com/photo-1516750484197-6b28d10c91ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw0NXx8bWFueSUyMGNhdHN8ZW58MHx8fHwxNjYzNDIxNDgx&ixlib=rb-1.2.1&q=80&w=1080)

_Kim Davies_

I have been using the same strategy to compute automatically `SHA-256` hash for my `<script />` tags since a couple of years and as I recently applied it again at work and in [Papyrs](https://papy.rs) (I am currently migrating the kit that generate the blogspaces from vanilla JavaScript to [Astro](https://astro.build/)), I thought it could be an interesting subject for a new short blog post.

---

## Getting started

While `sha256` can be set manually, I personally rather like to generate these automatically once the `build` script is over - as a post-processing job. This means that I rely on the fact that what is built is trustable and that I compute the values once the scripts have been generated.

To do so, I create a dedicated script - e.g. `./build-csp.mjs` - that I append to my build script:

```json
// package.json

{
	"scripts": {
		"build:csp": "node build-csp.mjs",
		"build": "astro build && npm run build:csp"
	}
}
```

---

## Search and update

As I aim to inject the shas at the end of the process, I add a placeholder within the Content Security Policy (CSP) to search and update the computed values. e.g. in following CSP `meta` tag I used the placeholder `{{EXTRA\_SHAS}}`:

```javascript
<meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none';
             script-src 'self' {{EXTRA_SHAS}};
/>
```

Because such a placeholder is not a valid policy, the browser would throw an error while evaluating the rules. What can notably happen when I develop since I post process only the production build.

That is why I often just avoid the use of CSP for my local environment. e.g. in my Astro project I skip the rendering of the `meta` tag if not a `PROD` build.

```javascript
---
const csp = import.meta.env.PROD;
---

{
  csp && (
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none';
      script-src 'self' {{EXTRA_SHAS}};
    />
  )
}
```

---

## List all HTML files

To compute the `sha256` sha for the content of the `<script />` that are used in the HTML files I first need to, well, list the HTML files that have been built.

For such purpose, I use a recursive exploration function that I most probably found on Stackoverflow and keep using since then.

```javascript
import { readdirSync, lstatSync } from "fs";
import { join } from "path";

export const findEntryPoints = (dir, files) => {
	readdirSync(dir).forEach((file) => {
		const fullPath = join(dir, file);
		if (lstatSync(fullPath).isDirectory()) {
			findEntryPoints(fullPath, files);
		} else {
			files.push(fullPath);
		}
	});
};

const entryPoints = [];
findEntryPoints("dist", entryPoints);
```

Once I got all the files, I filter those that are `.html`.

```javascript
import { extname } from "path";

const htmlEntryPoints = entryPoints.filter((entry) => [".html"].includes(extname(entry)));
```

---

## Process and update CSP

Once I got all the target files, I batch update these by reading their content, generating the related shas and ultimately update the rules.

```javascript
import { join } from "path";
import { readFile } from "fs/promises";

const updateCSP = async (entry) => {
	const indexHtml = await readFile(join(process.cwd(), entry), "utf-8");
	const scriptHashes = await computeHashes(indexHtml);
	await writeCSP({ scriptHashes, indexHtml, entry });
};

const promises = htmlEntryPoints.map(updateCSP);
await Promise.all(promises);
```

---

## Compute sha256

To create the hashes for the content of the `<script />` tags, I use a regex to find those tags and use the [Crypto API](https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options) of NodeJS to effectively compute the values.

```javascript
import { createHash } from "crypto";

const computeHashes = (indexHtml) => {
	const sw = /<script[\s\S]*?>([\s\S]*?)<\/script>/gm;

	const scriptHashes = [];

	let m;
	while ((m = sw.exec(indexHtml))) {
		const content = m[1];

		scriptHashes.push(`'sha256-${createHash("sha256").update(content).digest("base64")}'`);
	}

	return scriptHashes;
};
```

---

## Write results

Finally, I replace the placeholder I declared earlier with these effective shas.

```javascript
import { writeFile } from "fs/promises";

const writeCSP = async ({ scriptHashes, indexHtml, entry }) =>
	writeFile(
		entry,
		indexHtml.replace("{{EXTRA_SHAS}}", scriptHashes.map((sha256) => sha256).join(" ")),
		"utf-8"
	);
```

And voilà 🥳

---

## Summary

In life it is sometimes the small things that make you happy and developing this little helper script is one of those.

To infinity and beyond  
David
