---
path: "/blog/bundling-figma-plugin-with-esbuild"
date: "2021-04-20"
title: "Bundling Figma Plugin With Esbuild"
description: "Build a plugin for Figma with esbuild, the extremely fast JavaScript bundler."
tags: "#javascript #showdev #figma #esbuild"
image: "https://cdn-images-1.medium.com/max/1600/1*NNXUKFJSiPegQbuWq0f47g.jpeg"
canonical: "https://daviddalbusco.medium.com/bundling-figma-plugin-with-esbuild-e6d41e28f872"
---

![](https://cdn-images-1.medium.com/max/1600/1*NNXUKFJSiPegQbuWq0f47g.jpeg)

*Photo by [Uillian Vargas](https://unsplash.com/@vargasuillian?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/fast?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I recently published a new open source [plugin](https://www.figma.com/community/plugin/950777256486678678/Figma-to-DeckDeckGo) to export [Figma](https://www.figma.com/) frames to [DeckDeckGo](https://deckdeckgo.com) slides.

As I like to benefit from my experiences to learn and try new concept, instead of using a bundler as described in the Figma documentation, I decided to give a try to [esbuild](https://esbuild.github.io/).

The least I can say, I loved it ❤️.

*****

### Foreword

Following solution is the one I set up for my [plugin](https://github.com/deckgo/figma-deckdeckgo-plugin). It does work like a charm but, notably because it was the first time I used esbuild, it might need some improvements. If you notice improvements or issues, let me know, I would like to hear from you!

Contributions to my plugin and PR are also welcomed 😉.

*****

### Setup

In a  Figma plugin, install both `esbuild` and `rimraf` .

```bash
npm i esbuild rimraf --save-dev
```

`rimraf` might not be needed, if you only build your project in a CI, nevertheless, for a local build, I think it is safer to delete the output directory before any new build.

In `package.json` add, or modify, the `build` script.

```json
"scripts": {
  "build": "rimraf dist && node ./esbuild.js"
}
```

You might notice that the last command target a script called `esbuild.js`. This file will contain our bundling steps, therefore create such a new file at the root of your project.

```bash
touch esbuild.js
```

Finally, in this newly created file, import `esbuild` .

```javascript
const esbuild = require('esbuild');
```

*****

### Sandbox

A Figma plugin run (see [documentation](https://www.figma.com/plugin-docs/how-plugins-run/)) in a combination of a sandbox, to access to the Figma nodes, and an iFrame, for the presentation layer. We set up firstly the sandbox’s build.

```javascript
// sandbox

esbuild
  .build({
    entryPoints: ['src/plugin.ts'],
    bundle: true,
    platform: 'node',
    target: ['node10.4'],
    outfile: 'dist/plugin.js'
  })
  .catch(() => process.exit(1));
```

In the above script, we bundle the `plugin.ts`, the sandbox’s code, to its JavaScript counterpart `plugin.js` . As configuration, we tell `esbuild` to treat it as a NodeJS [platform](https://esbuild.github.io/api/#platform) and we [target](https://esbuild.github.io/api/#target) the version 10.4.

> I configured my plugin to handle sources from a folder `src`. I also bundle the outcome to another one called `dist`. If you do not have the same structure, modify the solution accordingly.

*****

### UI

In comparison to the previous chapter, we are going to gather the results of the build instead of telling `esbuild` to write directly to a file. For such reason, we import NodeJS `fs` to interact with the file system.

```javascript
const {readFile, writeFile} = require('fs').promises;
```

We also install `html-minifier-terser` to minify the resulting HTML code.

```bash
npm i html-minifier-terser --save-dev
``` 

Once installed, we add a related import to our build script too.

```javascript
const minify = require('html-minifier-terser').minify;
```

These imports set, we implement the bundling.

```javascript
// iframe UI

(async () => {
  const script = esbuild.buildSync({
    entryPoints: ['src/ui.ts'],
    bundle: true,
    minify: true,
    write: false,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16']
  });

  const html = await readFile('src/ui.html', 'utf8');

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
    'dist/ui.html',
    `<script>${script.outputFiles[0].text}</script>${await minify(html, minifyOptions)}`
  );
})();
```

In the above script, we compile the `ui.ts` , our TypeScript code related to the UI, with `esbuild` . We instruct it to inline any imported dependencies into the file itself with the option [bundle](https://esbuild.github.io/api/#bundle), we [minify](https://esbuild.github.io/api/#minify) the JavaScript code and, we do not [write](https://esbuild.github.io/api/#write) to the file system. Instead of such step, we gather the outcome in a variable I called `script` .

We read the `ui.html` source file, define some options for the HTML minification and, finally, write both compiled code and HTML to the output (`dist/ui.html` in this example).

*****

### Web Components

Of course, I had to create some Web Components for my projects 😉. Integrating these follow same logic as previously, except that we use the esm [format](https://esbuild.github.io/api/#format-commonjs).

```javascript
const buildWebComponents = (entryPoints) =>
  entryPoints
    .map((entryPoint) =>
      esbuild.buildSync({
        entryPoints: [entryPoint],
        bundle: true,
        minify: true,
        write: false,
        target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
        format: 'esm'
      })
    )
    .map((componentScript) => componentScript.outputFiles[0].text)
    .join('');
(async () => {
  const componentsScript = buildWebComponents([
    'src/components/checkbox.ts',
    'src/components/button.ts',
    'src/components/spinner.ts',
    'src/components/fonts.ts'
  ]);

  // Same as previous chapter

  await writeFile(
    'dist/ui.html',
    `<script>${script.outputFiles[0].text}</script><script type="module">${componentsScript}</script>${await minify(html, minifyOptions)}`
  );
})();
```

I created more than one Web Component (`checkbox.ts`, `button.ts`, etc.), that’s why the `buildWebComponents` function. It takes an array, a list of files, as parameter and, concat all bundle together to a single value.

And...that’s it 😃. Sandbox, UI and Web Components are bundled faster than ever ⚡️.

*****

### Repo

You can find above solution and, other fun stuff in the open source repo of my plugin: [https://github.com/deckgo/figma-deckdeckgo-plugin](https://github.com/deckgo/figma-deckdeckgo-plugin)

*****

### Summary

Setting up a project with [esbuild](https://esbuild.github.io/) was a pleasant developer experience. Writing a JS script to bundle my project, without many dependencies and with much flexibility, definitely matches my current inspiration. In addition, the outcome, the bundling itself, is faaaaaaaaaaaaaast! I am looking forward to use this compiler in other projects 👍.

To infinity and beyond!

David
