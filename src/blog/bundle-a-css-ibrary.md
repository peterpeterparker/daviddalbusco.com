---
path: "/blog/bundle-a-css-ibrary"
date: "2020-07-01"
title: "Bundle A CSS Library"
description: "How to build your own custom CSS library with SASS, postcss and clean-css."
tags: "#css #showdev #javascript #productivity"
image: "https://cdn-images-1.medium.com/max/1600/1*ktUiN4HuCz_nkRrL96xfFg.jpeg"
canonical: "https://medium.com/@david.dalbusco/bundle-a-css-library-6e9ff1ff8a2c"
---

![](https://cdn-images-1.medium.com/max/1600/1*ktUiN4HuCz_nkRrL96xfFg.jpeg)
*Photo by [KOBU Agency](https://unsplash.com/@kobuagency?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://medium.com/s/photos/css?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

We have build [DeckDeckGo](https://deckdeckgo.com) in a relatively fragmented way 😅. There is our web editor, which can be used to create and showcase slides and which can also be automatically synchronized with our remote control. There is also a developer kit, which supports HTML or markdown and there is even another version of it, we only used to deploy online your presentations as Progressive Web Apps.

All these multiple applications and kits have in common the fact that they share the exact same core and features, regardless of their technologies, thanks to Web Components made with [Stencil](https://stenciljs.com/).

These do also have to share the same layout capabilities. For example, if we define a 32px root font size in full screen mode, it should be applied anywhere and therefore, should be spread easily and consistently across our eco system.

That’s why we had to create our own custom CSS library and why I am sharing with you, how you can also bundle such a utility for your own projects.

*****

### Credits

This solution is the one implemented by the CSS framework [Bulma](https://bulma.io/). No need to reinvent the wheel when it is already wonderfully solved. Thank you Bulma for being [open source](https://github.com/jgthms/bulma) 🙏.

*****

### Getting Started

To initialize our library, we create a new folder, for example `bundle-css`, and are describing it with a new `package.json` file. It should contain the name of the library, its version, which is the main file, in our case an (upcoming) `sass` entry file, the author and a license. Of course, you can add more details, but these give us a quick basis.

```json
{
  "name": "bundle-css",
  "version": "1.0.0",
  "main": "index.scss",
  "author": "David",
  "license": "MIT"
}
```

In a new folder `src` we create our style sheet file `index.scss` . As I was mentioning the `fullscreen` mode in my introduction, we can for example add a full screen specific style to our file to apply a blue background to the children paragraphs of a “main” element.

```sass
:fullscreen #main {
  p {
    background: #3880ff;
  }
}
```

*****

### Clean output

We might probably want to ensure that every time we build our lib, the outcome does not contain any previous style we would have deleted previously. 

That’s why we firstly add [rimraf](https://github.com/isaacs/rimraf) to our project to delete the output folder at begin of each build.

```bash
npm i rimraf -D
```

*Note that all dependencies we are adding to our project have to be added as development dependencies because none of these are part of the output.*

Once rimraf installed, we can initiate  our `build` by editing the `scripts` in `package.json` .

```json
"scripts": {
  "build": "rimraf css"
}
```

I selected `css` for the name of the output folder which will contains the CSS output. You can use another name, what does matter, is adding it to the file `package.json` in order to include it in the final bundle you might later install in your app or publish to [npm](http://npmjs.com/).

```json
"files": [
  "css"
]
```

At this point, altogether, our `package.json` should contains the following:

```json
{
  "name": "bundle-css",
  "version": "1.0.0",
  "main": "index.scss",
  "scripts": {
    "build": "rimraf css"
  },
  "files": [
    "css"
  ],
  "author": "David",
  "license": "MIT",
  "devDependencies": {
    "rimraf": "^3.0.2"
  }
}
```

*****

### SASS

We are using the [SASS](https://sass-lang.com/) extension to edit the styles. Therefore, we have to compile it to CSS. For such purpose, we are using the [node-sass](https://github.com/sass/node-sass) compiler.

```bash
npm i node-sass -D
```

We enhance our `package.json` with a new script, which should take care of compiling to CSS, and we are chaining it with our main `build` script.

```json
"scripts": {
  "build": "rimraf css && npm run build-sass",
  "build-sass": "node-sass --output-style expanded src/index.scss ./css/index.css"
}
```

We provide the input file and specify the output as compilation parameters. We are also using the option `expanded` to determine the output format of the CSS. It makes it readable and, as we are about to minify it at a later stage of the pipeline, we do not have yet to spare the size of the newlines.

If we give a try to our build script by running `npm run build` , we should discover an output file `/css/index.css` which has been converted from `SASS` to `CSS` .

```css
:fullscreen #main p {
  background: #3880ff;
}
```

*****

### Autoprefixing

In order to support older browser and Safari, it is worth to [prefix](https://caniuse.com/#search=fullscreen) the selector `:fullscreen` . This can also be the case for other selectors. To parse automatically CSS and add vendor prefixes to CSS rules, using values from [Can I Use](https://caniuse.com/), we are using [autoprefixer](https://github.com/postcss/autoprefixer).

```bash
npm i autoprefixer postcss-cli -D
```

We are now, again, adding a new build script to our `package.json` and are chaining this step after the two we have already declared because our goal is to prefix the values once the CSS has been created.

```json
"scripts": {
  "build": "rimraf css && npm run build-sass && npm run build-autoprefix",
   ...
  "build-autoprefix": "postcss --use autoprefixer --map --output ./css/index.css ./css/index.css"
}
```

With this new command, we are overwriting the CSS file with the new values, and are generating a `map` file which can be useful for debugging purpose.

If we run our build pipeline `npm run build` , the output `css` folder should now contain a `map` file and our `index.css` output which should have been prefixed as following:

```css
:-webkit-full-screen #main p {
  background: #3880ff;
}
:-ms-fullscreen #main p {
  background: #3880ff;
}
:fullscreen #main p {
  background: #3880ff;
}
/*# sourceMappingURL=index.css.map */
```

*****

### Optimization

Less is always better, that’s why we are in addition optimizing our CSS library with the help of [clean-css](https://github.com/jakubpawlowicz/clean-css).

```bash
npm i clean-css-cli -D
```

By adding a last script to our chain, we are able to create a minified version of our CSS file.

```json
"scripts": {
  "build": "rimraf css && npm run build-sass && npm run build-autoprefix && npm run build-cleancss",
  ...
  "build-cleancss": "cleancss -o ./css/index.min.css ./css/index.css"
}
```

If we run one last time `npm run build` we should now discover the minified version of our input CSS in the output folder `css` .

```css
:-webkit-full-screen #main p{background:#3880ff}:-ms-fullscreen #main p{background:#3880ff}:fullscreen #main p{background:#3880ff}
```

*****

### Altogether

Summarized, here’s the `package.json` which contains all dependencies and build steps to create our own custom CSS library.

```json
{
  "name": "bundle-css",
  "version": "1.0.0",
  "main": "index.scss",
  "scripts": {
    "build": "rimraf css && npm run build-sass && npm run build-autoprefix && npm run build-cleancss",
    "build-sass": "node-sass --output-style expanded src/index.scss ./css/index.css",
    "build-autoprefix": "postcss --use autoprefixer --map --output ./css/index.css ./css/index.css",
    "build-cleancss": "cleancss -o ./css/index.min.css ./css/index.css"
  },
  "files": [
    "css"
  ],
  "author": "David",
  "license": "MIT",
  "devDependencies": {
    "autoprefixer": "^9.8.4",
    "clean-css-cli": "^4.3.0",
    "node-sass": "^4.14.1",
    "postcss-cli": "^7.1.1",
    "rimraf": "^3.0.2"
  }
}
```

*****

### Summary

Thanks to many open source projects it is possible to create quickly and easily a library for our custom CSS, that’s amazing.

Give a try to [DeckDeckGo](https://deckdeckgo.com) for your next talk and if you are up to contribute with some improvements to our common [deck](https://github.com/deckgo/deckdeckgo/tree/master/utils/deck) styles build following above steeps, your help is more than welcomed 😃.

To infinity and beyond!

David
