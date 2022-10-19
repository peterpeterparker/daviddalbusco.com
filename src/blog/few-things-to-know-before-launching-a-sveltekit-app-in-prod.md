---
path: "/blog/few-things-to-know-before-launching-a-sveltekit-app-in-prod"
date: "2022-10-19"
title: "Few things to know before launching a SvelteKit app in prod"
description: "Content security policy, build reproducibility and polyfill. Few tips to know before going live with SvelteKit."
tags: "#javascript #svelte #programming #technology"
image: "https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw5fHxsYXVuY2h8ZW58MHx8fHwxNjY2MDE4Njg1&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/few-things-to-know-before-launching-a-sveltekit-app-in-prod"
---

![3D Rendering Rocket Space Launching Illustration](https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw5fHxsYXVuY2h8ZW58MHx8fHwxNjY2MDE4Njg1&ixlib=rb-1.2.1&q=80&w=1080)

*Photo by [Andy Hermawan](https://unsplash.com/@kolamdigital?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

* * *

Last week new version of [NNS-dapp](https://internetcomputer.org/nns) (the dapp of NNS, one of the world's largest DAOs that governs the [Internet Computer](https://internetcomputer.org/)) introduced a new feature named "Stake Maturity", a light design update of its modals and, a change in its build system.

Indeed, while the frontend application used to be packaged with the help of the sole [Rollup](https://rollupjs.org/) bundler, it was migrated to [SvelteKit](https://kit.svelte.dev/)\* which uses both [Vite](https://vitejs.dev/), [esbuild](https://esbuild.github.io/) and Rollup.

Here are the three things I learned along the way. I hope they will be helpful to you so that you can deploy your applications safely in production too.

*\* without any changes regarding routing, yet*

* * *

## 1\. CSP breaks app in Firefox

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks (source [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)).

As we care about security, of course we have implemented such types of rules. Notably the policies `script-src` that whitelists the script tags of the `index.html` page - using their `sha256` script hashes - and the `'strict-dynamic'` which is used to load all the chunks of code that are needed to run the application in the browser.

While this worked out with previous bundler, we were actually surprised to discover that SvelteKit (Oct. 2022) does not really support such combination of policies (see issue [#3558](https://github.com/sveltejs/kit/issues/3558)). It works in Chrome and Safari but, breaks in Firefox and with "break" I mean the all app won't be rendered at all.

To overcome the issue, we found the following workaround: adding a post-build script that extracts into a separate JS file the code that is injected in the HTML page by SvelteKit and, inject our own script loader instead 🤪.

This can be achieved as following:

1\. add an empty `main.js` to the `static` folder (useful to avoid issue while developing locally).

2\. add a script loader in the `<head />` of the root html page - i.e. in the `src/app.html` page.

```html
<script>
    const loader = document.createElement("script");
    loader.type = "module";
    loader.src = "./main.js";
    document.head.appendChild(loader);
</script>
```

3\. create a post-build script - e.g. `./scripts/build.csp.mjs`.

```javascript
#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const publicIndexHTML = join(process.cwd(), "public", "index.html");

const buildCsp = () => {
  const indexHTMLWithoutStartScript = extractStartScript();
  writeFileSync(publicIndexHTML, indexHTMLWithoutStartScript);
};

/**
 * Using a CSP with 'strict-dynamic' with SvelteKit breaks in Firefox.
 * Issue: https://github.com/sveltejs/kit/issues/3558
 *
 * As workaround:
 * 1. we extract the start script that is injected by SvelteKit in index.html into a separate main.js
 * 2. we remove the script content from index.html but, let the script tag as anchor
 * 3. we use our custom script loader to load the main.js script
 */
const extractStartScript = () => {
  const indexHtml = readFileSync(publicIndexHTML, "utf-8");

  const svelteKitStartScript =
    /(<script type=\"module\" data-sveltekit-hydrate[\s\S]*?>)([\s\S]*?)(<\/script>)/gm;

  // 1. extract SvelteKit start script to a separate main.js file
  const [_script, _scriptStartTag, content, _scriptEndTag] =
    svelteKitStartScript.exec(indexHtml);
  const inlineScript = content.replace(/^\s*/gm, "");

  writeFileSync(
    join(process.cwd(), "public", "main.js"),
    inlineScript,
    "utf-8"
  );

  // 2. replace SvelteKit script tag content with empty
  return indexHtml.replace(svelteKitStartScript, "$1$3");
};

buildCsp();
```

4\. chain the script in `package.json`.

```json
{
    "scripts": {
        "build:csp": "node scripts/build.csp.mjs",
        "build": "vite build && npm run build:csp"
    }
}
```

* * *

## 2\. Build reproducibility

Reproducible builds is a process of compiling software which ensures the resulting binary code can be reproduced (source [wikipedia](https://en.wikipedia.org/wiki/Reproducible_builds)). We care about deterministic compilation because we want to allow verification that no vulnerabilities or backdoors have been introduced during the compilation process.

This had always worked out like a charm. However, after the migration, we were not able to compute the same sha for the bundled wasm on multiple computers anymore.

After some debugging we found the two root causes of the issue.

1\. if no particular [version](https://kit.svelte.dev/docs/configuration#version) is provided to SvelteKit, it will instead generates a timestamp to identify the current app version - i.e. if no version is provided, SvelteKit injects a timestamp in the JS code that gets bundled. Each build, each time a new timestamp.

To solve this, we read the version number in `package.json` and we provided it to the kit in the `svelte.config.js`. In that way, the version become static for each build as long as we do not bump the semantic numbers.

```json
import adapter from "@sveltejs/adapter-static";
import autoprefixer from "autoprefixer";
import { readFileSync } from "fs";
import preprocess from "svelte-preprocess";
import { fileURLToPath } from "url";

const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const { version } = JSON.parse(json);

const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [autoprefixer],
    },
  }),

  kit: {
    adapter: adapter({
      pages: "public",
      assets: "public",
      fallback: "index.html",
      precompress: false,
    }),
    serviceWorker: {
      register: false,
    },
    version: {
      name: version, // <---- here provide version
    },
    trailingSlash: "always",
  },
};

export default config;

```

2\. SvelteKit - or Vite - adds a `public/vite-manifest.json` file that contains the list of all generated immutable assets of the application. This file is unfortunately currently not sorted. Therefore as a quick fix, we added a bash script to do so.

```bash
#!/usr/bin/env bash
set -euxo pipefail
cd "$(dirname "$(realpath "$0")")/.."
# shellcheck disable=SC2094 # This reads the entire file into memory and then writes it out, so is correct.
cat <<<"$(jq --sort-keys . public/vite-manifest.json)" >public/vite-manifest.json

```

Bash script which we chained in `package.json` as well.

```json
{
    "scripts": {
        "build:csp": "node scripts/build.csp.mjs",
        "build": "vite build && npm run build:csp && ./scripts/make-reproducible"
    }
}
```

* * *

## 3\. Polyfill Buffer

I had always used Chovy's [SO solution](https://stackoverflow.com/a/72220289/5404186) to polyfill the Buffer API for frontend dapps on the IC but, it did not worked out entirely anymore. While redefining `global` as `globalThis` in `vite.config.js` still did the job, no polyfill for the "Buffer" was applied.

That is why we added a "manual" polyfill in the root `+layout.ts` after having installed (`npm i buffer`) the [buffer](https://www.npmjs.com/package/buffer) module dependency for the browser.

```javascript
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
```

However, we discovered that this works as intended locally, with a development or production build, but, might become an issue in production because there is no guarantee that the `+layout.js` file will be fetched faster than the pages that use it.

That is why in addition to the above add-ons, it is worth to inject the polyfied Buffer within the production JS code that is bundled. This can be done with the help of a Rollup plugin (`npm i @rollup/plugin-inject -D`).

```javascript
import inject from "@rollup/plugin-inject";
import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [sveltekit()],
  build: {
    target: "es2020",
    rollupOptions: {
      // Polyfill Buffer for production build. 
      // The hardware wallet needs Buffer.
      plugins: [
        inject({
          include: ["node_modules/@ledgerhq/**"],
          modules: { Buffer: ["buffer", "Buffer"] },
        }),
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
};

export default config;
```

Notes:

*   we need above polyfill for hardware wallet related features. That is why we scope it to the `ledgerhq` library when we use the Rollup plugin.
*   the solution is not yet optimal because we apply the polyfill twice - i.e. we actually load too much JavaScript code in the production build. Never too sure I agree but, still, this can be improved.
*   web worker code does not get polyfied with above solution. If you need to do so, you probably will need to investigate further.

* * *

## Conclusion

It's all fun and games until you discover issues which do not exist when you develop locally 😁. I am glad we solved all these hickups and were able to migrate. Using ViteJS ease the developer experience and porting the dapp to SvelteKit opens new possibilities, notably some ideas we have about the routing but, I will probably tell more about it in another blog post 😉.

To infinity and beyond  
David
