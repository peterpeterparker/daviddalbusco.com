---
path: "/blog/build-a-library-with-esbuild"
date: "2021-05-24"
title: "Build A Library With esbuild"
description: "How to bundle ESM, IIFE or CommonJS libraries with esbuild."
tags: "#javascript #esbuild #tutorial #typescript"
image: "https://cdn-images-1.medium.com/max/1600/1*6sA4hPVV9wO_jo8l205Aig.jpeg"
canonical: "https://daviddalbusco.medium.com/the-mutationobserver-web-api-cf469261eb36"
---

![](https://cdn-images-1.medium.com/max/1600/1*6sA4hPVV9wO_jo8l205Aig.jpeg)

*Photo by [Colin Watts](https://unsplash.com/@imagefactory?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I recently developed plugins and, migrated all the utilities of [DeckDeckGo](https://deckdeckgo.com) to build these with [esbuild](https://esbuild.github.io/).

*****

### Introduction

[esbuild](https://esbuild.github.io/) is “an extremely fast JavaScript bundler”. It is its tagline and, according my tests, the least we can say is that it is true. It is blazing fast ⚡️.

Sometimes while migrating my libraries, I even found myself waiting for the end of a build because I did not notice that it was already finished. I assumed it would still need some more time, old habits die hard I guess 😅.

In addition, other things which make me really like this new bundler are its clean, flexible API and, its documentation. It is easy to follow and, clear.

*****

### Setup

To get started, let’s create a new empty project.

```bash
mkdir mylib && cd mylib && npm init --yes
```

You can use esbuild to bundle libraries from vanilla JavaScript source files but, at least in this tutorial, we are going to use TypeScript too. That’s why, in addition to the bundler, we also install it and [rimraf](https://github.com/isaacs/rimraf), to remove the output folder before any new build.

```bash
npm i esbuild typescript rimraf --save-dev
```

At the root of our project, we create a `./tsconfig.json` file to indicates that the directory is the root of a TypeScript project.

```json
{
  "compilerOptions": {
    "declaration": true,
    "target": "esnext",
    "lib": ["esnext", "dom"],
    "strict": true,
    "noImplicitAny": false,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "outDir": "lib"
  }
}
```

In the above configuration, I set `esnext` to target the most recent ES standard and, also set `declaration` to `true` . esbuild not generating the declarations, we are going to generate these using the `tsc` command.

We update our `./package.json` with a script to `build` our library and, we define a new `types` entry which should point to the types declarations.

```json
{
  "name": "mylib",
  "version": "1.0.0",
  "description": "",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "scripts": {
    "ts-types": " tsc --emitDeclarationOnly --outDir lib",
    "build": "rimraf lib && node ./esbuild.js && npm run ts-types"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "esbuild": "^0.12.1",
    "typescript": "^4.2.4"
  }
}
```

The configuration and, build using esbuild is going to be developed in following chapters in a dedicated file, `./esbuild.js` . That’s why, at this point, we leave it empty.

```bash
touch esbuild.js
```

It is worth to notice that the esbuild commands can be inlined inside the `scripts` tag of the `package.json` but, I personally like to handle it separately.

That’s useful when the scripts evolve or, when multiple miscellaneous builds and, steps are performed.

Finally, we add some source code to be compiled, such as following sample function, in a main new entry point file  `./src/index.ts` .

```typescript
export const add = (a: number, b: number): number => a + b;
```

*****

### ECMAScript module

The `esm` format stands for "ECMAScript module". It assumes the environment supports `import` and `export` syntax ([documentation](https://esbuild.github.io/api/#format-esm)).

To bundle such a modern library, we can add the following configuration to our `./esbuild.js` :

```javascript
const esbuild = require('esbuild');

esbuild
    .build({
        entryPoints: ['src/index.ts'],
        outdir: 'lib',
        bundle: true,
        sourcemap: true,
        minify: true,
        splitting: true,
        format: 'esm',
        target: ['esnext']
    })
    .catch(() => process.exit(1));
```

That’s already it 🥳.

If we run `npm run build` in our project, the library is bundled to `esm` , a source map is generated and, the TypeScript declarations as well.

“But, what’s happening here” you may ask yourself? Therefore, here some context:

In the script we first require `esbuild` and, with the help of the method `.build` , we run an `async` compilation. It is also possible to perform this step synchronously and, get the results (I will develop this in a following chapter).

To perform the operation, we set following options:

* `entryPoints` and `ourdir` defines which files need to be bundled to which output
* `bundle` means to inline any imported dependencies into the file itself. This process is recursive so dependencies of dependencies (and so on) will also be inlined ([documentation](https://esbuild.github.io/api/#bundle)). In other words, if you have got `import` in your `entryPoints` , bundle will resolve these to add their code in the results.
* `sourcemap` if set to `true` , generates source map files next to your JavaScript outcome
* `minify` makes the code smaller ([documentation](https://esbuild.github.io/api/#minify))
* `splitting` is a work in progress (at the time I write these lines) which improves the code sharing between multiple endpoints (see [documentation](https://esbuild.github.io/api/#splitting))
* `format` is set to `esm` as it is the goal in this chapter ([documentation](https://esbuild.github.io/api/#format-commonjs))
* `target` defines which types of JavaScript we want to output. In our case, only the most recent version ([documentation](https://esbuild.github.io/api/#target))

*****

#### Module Field

In above chapter we are generating an `esm` library. If you aim to use this tutorial to create an effective bundle, I suggest adding a `module` entry in our `package.json` . Even though not officially documented, this entry is useful for such types of library (see [Stackoverflow](https://stackoverflow.com/questions/42708484/what-is-the-module-package-json-field-for)).

```json
"main": "lib/index.js",
"module": "lib/index.js",
"types": "lib/index.d.ts",
```

*****

### IIFE

The `iife` format stands for "immediately-invoked function expression" and is intended to be run in the browser ([documentation](https://esbuild.github.io/api/#format-iife)).

If you rather like or, are in need to create library which is immediately available, it can be done by removing from the previous configuration both `format` and `splitting` .

The `iife` format is the default format unless we set `platform` to node (as in next chapter). `splitting` is only available for `esm` modules.

```javascript
const esbuild = require('esbuild');

esbuild
    .build({
        entryPoints: ['src/index.ts'],
        outdir: 'lib',
        bundle: true,
        sourcemap: true,
        minify: true,
        target: ['esnext']
    })
    .catch(() => process.exit(1));
```

*****

### CommonJS — Node

The `cjs` format stands for "CommonJS" and is intended to be run in node ([documentation](https://esbuild.github.io/api/#format-commonjs)).

If your library aims to be used in a Node or, in a non-browser environment, it can be bundled for such purpose with a related `platform` option.

```javascript
const esbuild = require('esbuild');

esbuild
    .build({
        entryPoints: ['src/index.ts'],
        outdir: 'lib',
        bundle: true,
        sourcemap: true,
        minify: true,
        platform: 'node',
        target: ['node10.4'],
    })
    .catch(() => process.exit(1));
```

In this configuration we define `node` as `platform` and, set `target` to Node version 10 ([documentation](https://esbuild.github.io/api/#target)).

*****

### Synchronous Build

Above builds are asynchronous. You might want to run a synchronous builds to either get information on the process or, do something with the output without writing it to the filesystem.

This can be achieved by replacing the method `.build` with `.buildSync` .

*****

#### Information

To get to know if there were errors, or warnings, we can call `buildSync` . It will return an object which contains such information.

```javascript
const esbuild = require('esbuild');

const results = esbuild
    .buildSync({
        entryPoints: ['src/index.ts'],
        outdir: 'lib',
        bundle: true,
        sourcemap: true,
        minify: true,
        splitting: true,
        format: 'esm',
        target: ['esnext']
    });

console.log(results);

// Output:
// { errors: [], warnings: [] }
```

*****

#### In Memory Results

To get the files that would have been written as in-memory buffers, we can leverage the option `write`([documentation](https://esbuild.github.io/api/#write)). For each `entryPoints`, esbuild will answer with a related `outputFiles` entry in an array of results.

For example, if we would like to inline our script in an HTML file, we would be able to get these results and, parse it manually to the output of our choice.

```javascript
const esbuild = require('esbuild');

const {readFile, writeFile, mkdir} = require('fs').promises;
(async () => {
    await mkdir('./lib');
    
    const script = esbuild
        .buildSync({
            entryPoints: ['src/index.ts'],
            bundle: true,
            minify: true,
            format: 'esm',
            target: ['esnext'],
            write: false
        });
    
    const html = await readFile('src/index.html', 'utf8');
    
    await writeFile(
        'lib/index.html',
        `<script type="module">${script.outputFiles[0].text}</script>${html}`
    );
})();
```

A bit out of the scope of this article but, to demonstrate how flexible esbuild is, we would be able to install a html minifier to get even more fancier.

```bash
npm i html-minifier-terser --save-dev
```

Once added to our project, we would be able to minify the resulting HTML and, are almost already ready to turn this small library in a build pipeline for modern application 😱.

```javascript
const esbuild = require('esbuild');
const {readFile, writeFile, mkdir} = require('fs').promises;
const minify = require('html-minifier-terser').minify;

(async () => {
    await mkdir('./lib');
    
    const script = esbuild
        .buildSync({
            entryPoints: ['src/index.ts'],
            bundle: true,
            minify: true,
            format: 'esm',
            target: ['esnext'],
            write: false
        });
    
    const html = await readFile('src/index.html', 'utf8');¨
  
    const minifyOptions = {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true
    };
    
    await writeFile(
        'lib/index.html',
        `<script>${script.outputFiles[0].text}</script>${minify(html, minifyOptions)}`
    );
})();
```

*****

### Summary

[esbuild](https://esbuild.github.io/) is slick 🤙.

To infinity and beyond!

David
