---
path: "/blog/sometimes-you-just-need-a-dumb-library"
date: "2020-03-19"
title: "Sometimes You Just Need A Dumb Library"
description: "How to create a library with Rollup and Typescript #OneTrickADay-31"
tags: "#showdev #javascript #tutorial #programming"
image: "https://cdn-images-1.medium.com/max/1600/1*3WQ_e2_-d02nvob2rlEJCA.png"
canonical: "https://medium.com/@david.dalbusco/sometimes-you-just-need-a-dumb-library-5f8e79e667dd"
---

![](https://cdn-images-1.medium.com/max/1600/1*3WQ_e2_-d02nvob2rlEJCA.png)

*Photo by [Benjamin Davies](https://unsplash.com/@bendavisual?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I [challenged](https://medium.com/@david.dalbusco/one-trick-a-day-d-34-469a0336a07e) my self to share a blog post very day until end of the current quarantine in Switzerland, the 19th April 2020. **Thirty-one** days left until hopefully better days.

*****

One of my client week’s assignment was to track down a bug between libraries. After quite a bit of time, I finally figured out that some code had been duplicated and had also received, of course, an improvement which had not been spread 😒.

Such issues can be avoided by not duplicating code, for example, by sharing it across projects through libraries. But often, if it is not yet something standardized in your company, it will take a bit of time to setup such new libraries.

Because in [DeckDeckGo](https://deckdeckgo.com), our open source editor for presentations, we actually had already setup such utilities, I thought it would be not a bad thing to share our recipe.

*****

### Our Goal: A Utility To Get Valid Date Objects

Regardless of the JavaScript projects and the frameworks, at some point, I will most probably have to handle dates and most probably, I will have to cast these to proper JavaScript `Date` objects, or at least, have to ensure their validities. That’s why I created for my self a little function which does such job. Therefore I suggest that our goal in this article is to create a library which contains such a function.

```javascript
export function toDateObject(myDate: any): Date | undefined {
    if (!myDate || myDate === undefined) {
        return undefined;
    }

    if (myDate instanceof String || typeof myDate === 'string') {
        return new Date(`${myDate}`);
    }

    if (typeof myDate === 'number' && !isNaN(myDate)) {
        return new Date(myDate);
    }

    // It case Firebase Timestamp format too
    if (myDate && myDate.seconds >= 0 && myDate.nanoseconds >= 0) {
        return new Date(myDate.toDate());
    }

    return myDate;
}
```

*****

### Create A Library

Let’s create our library. To begin with, in a terminal, we make a new folder and jump in it.

```bash
mkdir utils && cd utils
```

To develop and bundle our project we are going to use both [Rollup](https://rollupjs.org) and [Typescript](https://www.typescriptlang.org). To install and use these, we create a new file `package.json` which exposes the following. Basically, use these two above libraries to prepare and build our library, [rimraf](https://github.com/isaacs/rimraf) to remove the output folder before each build and the information about the library itself respectively which file is going to be its `main` entry, which one is the `module` and which one the `types` definition.

```json
{
  "name": "utils",
  "version": "1.0.0",
  "devDependencies": {
    "@types/node": "^13.9.1",
    "rimraf": "^3.0.2",
    "rollup": "^2.1.0",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-typescript": "^1.0.1",
    "tslib": "^1.11.1",
    "typescript": "^3.8.3"
  },
  "main": "lib/index.cjs.js",
  "module": "lib/index.js",
  "types": "lib/index.d.ts",
  "scripts": {
    "prepare": "npm run build",
    "build": "rimraf lib && rollup -c && tsc"
  },
  "files": [
    "lib",
    "README.md"
  ]
}
```

*****

#### Typescript

Before installing anything, we are going now to configure Typescript for example by specifying an ES2017 target in another new file `tsconfig.json` .

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "esnext",
    "declaration": true,
    "outDir": "lib",
    "strict": true,
    "removeComments": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": ["node_modules"]
}
```

*****

### Rollup

Finally, last piece of the configuration I promise, we create a new `rollup.config.js` which, I guess according its name you already understand, is the configuration for Rollup. We are going to instruct it to create a CJS module and are also explicitly adding the Typescript support.

Note that you find also the references I used to create this bundle as commentaries in the following piece of code.

```javascript
// https://github.com/rollup/rollup-starter-lib
// https://buzut.net/configurer-rollup-bundles-esm-cjs/
// https://dev.to/proticm/how-to-setup-rollup-config-45mk

import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

export default {
    input: './src/index.ts',
    plugins: [
        commonjs(),
        typescript()
    ],
    output: {
        format: 'cjs',
        file: pkg.main
    }
}
```

*****

#### Installation Of The Dependencies

Everything is in place, we can now install the dependencies. Before doing so, we create an empty new file `index.ts` in a new folder `src` , otherwise the installation will end up in error, as a build is chained with the process.

```bash
mkdir src && touch src/index.ts
npm install
```

*****

#### Coding

If everything went according plan, we actually already have bundled an empty library 😁 but our goal is to expose the above function `toDateObject` . Therefore, we copy the related code in `src/index.ts` and once done, run the command to build the library.

```bash
npm run build
```

And voilà, that’s it, we have a "dumb" library which can be use in all our projects 🎉.

*****

### Summary

I don’t pretend to be any Rollup expert, if you notice anything which can be improved, ping me. I would love to hear it, specially as we have developed such libraries in [DeckDeckGo](https://deckdeckgo.com).

Speaking of, as we are open source, if you want to have a look, maybe some functions might suits your needs too, checkout our [GitHub repo](https://github.com/deckgo/deckdeckgo/tree/master/utils).

Stay home, stay safe!

David
