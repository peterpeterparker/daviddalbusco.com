---
path: "/blog/build-a-library-with-esbuild-vol-2"
date: "2022-07-05"
title: "Build a library with esbuild (vol. 2)"
description: "A few new tips and tricks to build a library with esbuild"
tags: "#javascript #programming #webdev #showdev"
image: "https://daviddalbusco.com/assets/images/0*OCuN_lShUlE2vb_V"
canonical: "https://daviddalbusco.medium.com/build-a-library-with-esbuild-vol-2-c0e3caa25150"
---

![Wake Skate](https://images.unsplash.com/photo-1502933691298-84fc14542831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyOHx8c3VyZnxlbnwwfHx8fDE2NTcwMzY1NjI&ixlib=rb-1.2.1&q=80&w=1080)

_Photo by [Joseph Greve](https://unsplash.com/@lime517?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

A year ago I shared a [post](https://daviddalbusco.com/blog/build-a-library-with-esbuild) that explains how to build a library with [esbuild](https://esbuild.github.io/). While it remains a valid solution, I developed some improvements in my tooling since its publication.

Here are these few add-ons that I hope, will be useful for your projects too.

---

## Source and output

It can be sometimes useful to define more than one entry point for the library - i.e. not just use a unique `index.ts` file as entry but multiple sources that provides logically-independent groups of code. esbuild supports such option through the parameter [entryPoints](https://esbuild.github.io/api/#entry-points).

For example, in my projects, I often list all the TypeScript files present in my `src` folder and use these as separate entries.

```javascript
import { readdirSync, statSync } from "fs";
import { join } from "path";

// Select all typescript files of src directory as entry points
const entryPoints = readdirSync(join(process.cwd(), "src"))
	.filter((file) => file.endsWith(".ts") && statSync(join(process.cwd(), "src", file)).isFile())
	.map((file) => `src/${file}`);
```

As the output folder before each build might have been deleted, I also like to ensure it exists by creating it before proceeding.

```javascript
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// Create dist before build if not exist
const dist = join(process.cwd(), "dist");

if (!existsSync(dist)) {
	mkdirSync(dist);
}

// Select entryPoints and build
```

---

## Global is not defined

Your library might use some dependency that leads to a build error _"Uncaught ReferenceError: global is not defined"_ when building ESM target. Root cause being the dependency expecting a `global` object (as in NodeJS) while you would need `window` for the browser.

To overcome the issue, esbuild has a [define](https://esbuild.github.io/api/#define) option that can be use to replace global identifiers with constant expression.

```javascript
import esbuild from "esbuild";

esbuild
	.build({
		entryPoints,
		outdir: "dist/esm",
		bundle: true,
		sourcemap: true,
		minify: true,
		splitting: true,
		format: "esm",
		define: { global: "window" },
		target: ["esnext"]
	})
	.catch(() => process.exit(1));
```

---

## Both esm and cjs

To ship a library that supports both CommonJS (cjs) and ECMAScript module (esm), I output the bundles in two sub-folders of the distribution directory - e.g. `dist/cjs` and `dist/esm`. With esbuild, this can be achieved by specifying the options [outdir](https://esbuild.github.io/api/#outdir) or [outfile](https://esbuild.github.io/api/#outfile) to these relative paths.

```javascript
import esbuild from "esbuild";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const dist = join(process.cwd(), "dist");

if (!existsSync(dist)) {
	mkdirSync(dist);
}

const entryPoints = readdirSync(join(process.cwd(), "src"))
	.filter((file) => !file.endsWith(".ts") && statSync(join(process.cwd(), "src", file)).isFile())
	.map((file) => `src/${file}`);

// esm output bundles with code splitting
esbuild
	.build({
		entryPoints,
		outdir: "dist/esm",
		bundle: true,
		sourcemap: true,
		minify: true,
		splitting: true,
		format: "esm",
		define: { global: "window" },
		target: ["esnext"]
	})
	.catch(() => process.exit(1));

// cjs output bundle
esbuild
	.build({
		entryPoints: ["src/index.ts"],
		outfile: "dist/cjs/index.cjs.js",
		bundle: true,
		sourcemap: true,
		minify: true,
		platform: "node",
		target: ["node16"]
	})
	.catch(() => process.exit(1));

// an entry file for cjs at the root of the bundle
writeFileSync(join(dist, "index.js"), "export * from './esm/index.js';");

// an entry file for esm at the root of the bundle
writeFileSync(join(dist, "index.cjs.js"), "module.exports = require('./cjs/index.cjs.js');");
```

As distributing two distinct folders leads to having no more entry files in the `dist` path of the library, I also like to add two files that re-export the code. It can be useful when importing the library in a project.

In addition, the `package.json` entries should be updated accordingly as well.

```json
{
	"name": "mylibary",
	"version": "0.0.1",
	"main": "dist/cjs/index.cjs.js",
	"module": "dist/esm/index.js",
	"types": "dist/types/index.d.ts"
}
```

---

## CSS and SASS

Did you know that esbuild can bundle [CSS](https://esbuild.github.io/content-types/#css) files too? There is even a [SASS plugin](https://github.com/glromeo/esbuild-sass-plugin) that makes it easy to build `.scss` files 😃.

```bash
npm i -D esbuild-sass-plugin postcss autoprefixer postcss-preset-env
```

In following example, I bundle two different SASS files - `src/index.scss` and `src/doc/index.scss`. I use the plugin to transform the code - i.e. to prefix the CSS - and I also use the option [metafile](https://esbuild.github.io/api/#metafile) which tells esbuild to produce some metadata about the build in JSON format.

Using it, I can retrieve the paths and names of the generated CSS files to e.g. include these in my HTML files later on.

```javascript
import esbuild from "esbuild";

import { sassPlugin } from "esbuild-sass-plugin";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

const buildCSS = async () => {
	const { metafile } = await esbuild.build({
		entryPoints: ["src/index.scss", "src/doc/index.scss"],
		bundle: true,
		minify: true,
		format: "esm",
		target: ["esnext"],
		outdir: "dist/build",
		metafile: true,
		plugins: [
			sassPlugin({
				async transform(source, resolveDir) {
					const { css } = await postcss([autoprefixer, postcssPresetEnv()]).process(source, {
						from: undefined
					});
					return css;
				}
			})
		]
	});

	const { outputs } = metafile;
	return Object.keys(outputs);
};
```

---

## Conclusion

[esbuild](https://esbuild.github.io/) is still slick!

To infinity and beyond  
David
