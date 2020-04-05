---
path: "/blog/create-your-own-npm-cli"
date: "2020-04-05"
title: "Create Your Own NPM Cli"
description: "How to create your own npm init command for your project"
tags: "#webdev #showdev #devops #npm"
image: "https://cdn-images-1.medium.com/max/1600/1*QchuRONVGccKfb0imrxMig.png"
canonical: "https://medium.com/@david.dalbusco/create-your-own-npm-cli-fbe9e3d4fce"
---

![](https://cdn-images-1.medium.com/max/1600/1*QchuRONVGccKfb0imrxMig.png)

*Photo by [Michele Feola](https://unsplash.com/@smikefeola?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until (probably not) the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Fourteen** days left until hopefully better days.

*****

If you rather like to develop your slides with our developer kit rather than with our [online editor](https://deckdeckgo.com) for presentations, there is a good change that you are going to begin your journey by running the command `npm init deckdeckgo` in your terminal.

In this article I share how to create a [npm](https://www.npmjs.com) CLI command for your project from scratch.

Note that this article as our Cli is more than inspired by the amazing [Stencil’s Cli](https://github.com/ionic-team/create-stencil).

*****

### NPM Init

Many web projects are offering a Cli to ease the creation of new projects. Using these, without any other prior installation rather than Node and npm, we are able to run command in our terminal to start new fresh project. As for example `npm init stencil` to create a component or app with [Stencil](https://stenciljs.com) or `npm init react-app` to start a new [React](https://reactjs.org) application.

This is possible thanks to npm and their [Cli commands](https://docs.npmjs.com/cli/init.html) support.

In order to create such tool, we have to create and publish a project, our Cli itself, which contains an `index.js` and execute a main function when called. But more important, what’s really crucial, is the naming of the project. Indeed it has to be prefixed with `create-` in order to be later on resolved by your command line.

For example, our project’s name is `DeckDeckGo`, therefore the related Cli project’s name is `create-deckdeckgo` . Doing so, each time someone runs `npm init deckdeckgo` in his/her terminal, npm performs a lookup for a related `create-` project and if found, download it locally and runs the main function.

*****

### Create A New Cli Project

Let’s try to create our own CLI called “Hello”.

As explained above, the project’s Cli name has to be prefixed with `create-` that’s why we create a new folder `create-hello` .

```bash
mkdir create-hello && cd create-hello
```

We then define a `package.json` which, furthermore than defining the entry point `index.js` for the `bin`, set up the scripts and dependencies in order be able to develop and build our project with [Rollup](https://rollupjs.org) and [TypeScript](https://www.typescriptlang.org).

```json
{
  "name": "create-hello",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "build.tsc": "tsc",
    "build.bundle": "rollup -c",
    "minify": "terser --compress --mangle --toplevel --output dist/index.js -- dist/index.js",
    "build": "npm run build.tsc && npm run build.bundle && npm run minify",
    "build.dev": "npm run build.tsc && npm run build.bundle",
    "dev": "npm run build.dev && npm start",
    "version": "npm build"
  },
  "files": [
    "dist/index.js"
  ],
  "bin": {
    "create-hello": "dist/index.js"
  },
  "devDependencies": {
    "rollup": "^2.3.3",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-json": "^4.0.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "terser": "^4.6.10",
    "tslint": "^6.1.1",
    "tslint-ionic-rules": "0.0.21",
    "typescript": "^3.8.3"
  },
  "dependencies": {}
}
```

Using TypeScript means defining a `tsconfig.json` :

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "target": "es2015",
    "allowJs": true,
    "module": "es2015",
    "lib": ["es2015"],
    "strict": true,
    "noEmitOnError": false,
    "sourceMap": false,
    "declaration": false,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "dist/src",
    "strictNullChecks": false
  },
  "files": [
    "src/index.ts"
  ]
}
```

And some linter rules:

```json
{
  "extends": "tslint-ionic-rules",
  "rules": {
    "no-conditional-assignment": false,
    "no-non-null-assertion": false,
    "no-unnecessary-type-assertion": false,
    "prefer-for-of": false,
    "no-import-side-effect": false,
    "ordered-imports": [true, {
      "named-imports-order": "lowercase-last"
    }]
  }
}
```

Finally we also need to setup our Rollup build, notably in order to be able to run commands which interact with the file system. Not the goal from this article but might be useful if we would like to create a real Cli which has for goal to create new fresh local projects.

```javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
    input: 'dist/src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        strict: false,
        banner: '#! /usr/bin/env node\n',
    },
    plugins: [resolve(), json(),
              commonjs({include: 'node_modules/**'})],
    external: [
        'child_process',
        'fs',
        'path',
        'os',
        'https',
        'readline',
        'zlib',
        'events',
        'stream',
        'util',
        'buffer'
    ]
};
```

*****

### Code Your Cli

Everything is in place we can now develop our Cli. As staten above, nothing more than an `index` entry with a main function, therefore, let’s create a new file `src/index.ts` which does nothing more than printing out “Hello World”.

```javascript
async function run() {
    console.log('Hello World');
}

run();
```

Once the dependencies ( `npm install` ) installed, we should be able to build and run the project.

```bash
npm run build && npm run start
```

If everything works as expected, you should notice a “Hello World” printed out in your terminal.

![](https://cdn-images-1.medium.com/max/1600/1*YvNBHjvEjfv0dzCuZKE_Cw.png)

*****

### Publish Your Cli

Even if it does nothing much yet, we are actually already able to publish our Cli to npm ( `npm publish` ). If we would do so and once successfully published, everyone everywhere running `npm init hello` would then be able to print out “Hello World” in his/her terminal 😉.

*****

### Going Further

Here’s a couple of things you might found interesting if you plan to develop your own Cli “for real”.

*****

#### Arguments

We might want to listen to some arguments ( `args` ). Commonly, we might be looking to print out some information if the user pass the arguments `--help` .

```javascript
function run() {
    const args = process.argv.slice(2);

    const help = args.indexOf('--help') >= 0 || 
                 args.indexOf('-h') >= 0;

    if (help) {
        console.log('Run your command without arguments.');
        return;
    }

    console.log('Hello World');
}

run();
```

We can test the above while running the command line `npm run build && npm run start -- --help` . Note that the double `--` are only needed as we are trying out locally our bundle.

![](https://cdn-images-1.medium.com/max/1600/1*pW72fAU534R3ujl3fusJfg.png)

*****

#### Colors

Life without colors is sad 😥. Let’s use [Colorette](https://github.com/jorgebucaran/colorette) ( `npm install colorette --save` ) to brighten our “Hello World”.

```javascript
import {magenta} from 'colorette';

function run() {
    console.log(magenta('Hello World'));
}

run();
```

Have a look to this beautiful magenta color, isn’t that more user friendly happy?

![](https://cdn-images-1.medium.com/max/1600/1*C1WKqoLBbBty0UbOvf7vqQ.png)

*****

#### Interactive Command Line

Moreover than arguments, we might want to ask the user some questions or give him/her some options while executing our Cli. For that purpose I like to use [inquirer](https://github.com/SBoudrias/Inquirer.js/) ( `npm install inquirer --save` and `npm install @types/inquirer --save-dev` ).

```javascript
import {cyan, magenta} from 'colorette';

function run() {
    console.log(magenta('Hello World'));

    const inquirerHappy = require('inquirer');

    const questionHappy = [
        {
            type: 'confirm',
            name: 'happy',
            message: 'Are you happy today?',
            default: true
        }
    ];

    const answer = await inquirerHappy.prompt(questionHappy);

    console.log(cyan(
           `You are${answer.happy ? '' : ' not'} happy today.`));
}

run();
```

Obviously if I run the above I will answer yes 😁.

![](https://cdn-images-1.medium.com/max/1600/1*1YsJnUuPSaca7PFp3wHhlQ.png)

*****

#### Effectively Creating A Project

If you are looking to create your own Cli there is a chance that your goal is to create new projects locally, that’s why I will just point out my approach of the problem. To me the Cli can solve this with the following steps:

```javascript
function createProject() {
    downloadFromGitHub();

    installDependencies();

    updateLocalValues();
}
```

One, it fetches a project from GitHub or other repo. It can be a `git clone` or a `cURL` or any other commands. The idea is to get the source from a repo and to create a copy locally.

Then, if the project is a npm one, we might want to install the dependencies. Not that in such case it is important to trace the commands and to be sure to perform a `cleanUp` at the end of the all process.

Finally, as we copy or clone a projects, we might want to update some variables we might have asked before. Typically, with our Cli, we ask you what’s the name of your presentation, or what’s your name? These information are replaced automatically.

To process all these steps, checkout or clone our [repo](https://github.com/deckgo/deckdeckgo/tree/master/cli).

*****

### Summary

I find really cool, even if your project is a pet project like ours, to be able to create a Cli. Hopefully this blog post will help you create yours and if you have to prepare some slides, give a try to [DeckDeckgo](https://deckdeckgo.com) 👉 `npm init deckdeckgo` 🤗.

Stay home, stay safe

David
