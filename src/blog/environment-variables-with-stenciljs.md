---
path: "/blog/environment-variables-with-stenciljs"
date: "2019-03-03"
title: "Environment variables with StencilJS"
description: "How to handle environment variables in projects developed with StencilJS or the Ionic PWA Toolkit"
tags: "#webcomponents #stencil #javascript #html"
image: "https://cdn-images-1.medium.com/max/1600/1*Q-lN05mJu76_smkG8Qc4aw.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*Q-lN05mJu76_smkG8Qc4aw.jpeg)

I noticed that the question regarding how to handle environment variables in [Stencil’s](https://stenciljs.com) projects or projects created with the [Ionic PWA toolkit](https://ionicframework.com/pwa/toolkit) often pops up 🤔

As I have implemented a solution to handle such parameters in the [remote control](https://deckdeckgo.app) of my project [DeckDeckGo](https://deckdeckgo.com), the Progressive Web App alternative for simple presentations, I thought about sharing my small implementation in this new article.

### Credits

The following solution was inspired by the one developed in the Ionic core project. One of the entry point for me was discovering the method [setupConfig](https://github.com/ionic-team/ionic/blob/39fbc323480207417b41ff20d22badd91798ee2d/core/src/utils/config.ts#L182) in their source code. Therefore kudos to the awesome Ionic team ❤️

### Getting started

The solution described in this tutorial as for goal to handle two environments, a `development` and a `production` environments. In each of these we are going to define a variable which points to a different end point url.

_Note that the example below was developed with the Ionic PWA toolkit._

### Configuring the environments

To begin our implementation, we are going to define an interface which should contains our variable(s) and a setup method which aims to “push” its value in the `window` object. This means that when our application will start, we are going to call this method in order to define the environment variables which should be use at runtime for the all application.

_As I display the code of my own project, you might find references to the names `DeckDeckGo` or its short form `DeckGo`. Just replace these with the name of your project in your implementation._

To implement the interface and function you could for example create a new file called `environment-config.tsx` :

```
// The interface which define the list of variables
export interface EnvironmentConfig {
    url: string;
}

export function setupConfig(config: EnvironmentConfig) {
    if (!window) {
        return;
    }

    const win = window as any;
    const DeckGo = win.DeckGo;

    if (DeckGo && DeckGo.config &&
        DeckGo.config.constructor.name !== 'Object') {
        console.error('DeckDeckGo config was already initialized');
        return;
    }

    win.DeckGo = win.DeckGo || {};
    win.DeckGo.config = {
        ...win.DeckGo.config,
        ...config
    };

    return win.DeckGo.config;
}
```

Now that we have created a setup function, we will need to use it when the application start. As our goal is two have two different environments, we are first going to modify the main application class `app.ts` to be the one which define and use the `production` environment. We are going to consume the above method we have created and define our url for the production.

```
import {setupConfig} from
                '../app/services/environment/environment-config';

setupConfig({
    url: 'https://api.production.com'
});
```

Then we are going to create a second bootstraping class beside it to be the one which are going to load the `development` configuration. For that purpose let’s create in addition to the main class a file called `app-dev.ts` which will contains the following:

```
import {setupConfig} from
                '../app/services/environment/environment-config';
// When serve locally: http://localhost:3002
setupConfig({
    url: location.protocol + '//' + location.hostname + ':3002'
});
```

### Running the application

Now that we have two different entry points to start our application, we should be able to choose between these while running our command lines. For that purpose we are going, firstly, to modify the configuration file `stencil.config.ts` in order to make the `globalScript` property variable.

```
let globalScript: string = 'src/global/app.ts';

const dev: boolean =
           process.argv && process.argv.indexOf('--dev') > -1;
if (dev) {
    globalScript = 'src/global/app-dev.ts';
}
export const config: Config = {
     ...
     globalScript: globalScript,
     ...
};
```

As you could notice in the above code, the configuration will test a parameter `--dev` to check if we want to use the `development` environment or the default one, the `production` .

To pass that parameter from the command line, we are just going to add a new script to our `package.json` . Beside `npm run start` we are going to create a new target `npm run dev` which aims to start the application for the `development` environment.

```
"scripts": {
    "build": "stencil build",
    "start": "stencil build --watch --serve", // Production
    "dev": "stencil build --dev --watch --serve" // Development
}
```

### Reading the variables

Now that we have set up the configuration and the scripts to switch between both environments we have only one final piece to implement, the one regarding actually reading the values, in our example, reading the value of our url.

For that purpose I suggest to create a singleton which aims to load the configurations parameters in memory once and to expose a `get` method which should allow us to query specific variables (as we may have more than one environments variables 😉). We could create that new service in a new separate file called `environment-config.service.tsx` :

```
import {EnvironmentConfig} from './environment-config';

export class EnvironmentConfigService {

    private static instance: EnvironmentConfigService;

    private m: Map<keyof EnvironmentConfig, any>;

    private constructor() {
        // Private constructor, singleton
        this.init();
    }

    static getInstance() {
        if (!EnvironmentConfigService.instance) {
            EnvironmentConfigService.instance =
                              new EnvironmentConfigService();
        }
        return EnvironmentConfigService.instance;
    }

    private init() {
        if (!window) {
            return;
        }

        const win = window as any;
        const DeckGo = win.DeckGo;

        this.m = new Map<keyof EnvironmentConfig, any>(Object.entries(DeckGo.config) as any);
    }

    get(key: keyof EnvironmentConfig, fallback?: any): any {
        const value = this.m.get(key);
        return (value !== undefined) ? value : fallback;
    }
}
```

That’s it, that was the last piece needed to implement environment variables in a Stencil project or an Ionic PWA toolkit application 🎉

To get a variable, you could now simply call anywhere in your code your service and ask for the value of a parameter, like in the following example:

```
const url: string =
                EnvironmentConfigService.getInstance().get('url');
console.log('My environment variable value:', url);
```

### Cherry on the cake 🍒🎂

Like I said in my introduction, this solution is implemented in the remote control of my project DeckDeckGo, and guess what, this project is open source. Therefore, if you would like to checkout a concrete example of such implementation, you could browse or clone the DeckDeckGo repository 😃

```
git clone https://github.com/deckgo/deckdeckgo
```

To infinity and beyond 🚀

David
