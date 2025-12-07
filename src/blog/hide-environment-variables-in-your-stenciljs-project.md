---
path: "/blog/hide-environment-variables-in-your-stenciljs-project"
date: "2019-03-27"
title: "Hide environment variables in your StencilJS project"
description: "How to hide environment variables in the repo of your projects developed with StencilJS or the Ionic PWA Toolkit"
tags: "#webcomponents #stencil #javascript #html"
image: "https://daviddalbusco.com/assets/images/1*uC9a-6ZDkV2PKxYv0QW6Kw.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*uC9a-6ZDkV2PKxYv0QW6Kw.jpeg)

In a previous [article](https://medium.com/stencil-tricks/environment-variables-with-stenciljs-57e9da591280) I described how I implemented environment variables in my [Stencil’s](https://stenciljs.com/) projects or in my projects created with the [Ionic PWA toolkit](https://ionicframework.com/pwa/toolkit).

Since this publication, we began to work actively on our upcoming editor for PWA presentations, [DeckDeckGo](https://deckdeckgo.com), and as the project is open source and published on [GitHub](https://github.com/deckgo/deckdeckgo), we thought that it would maybe be a not too bad idea to not publish our API keys and other [Firebase](https://firebase.google.com) tokens online in our public repo 😉

For that reason, I had to go a step further than my previous post respectively I had to find and develop a solution to save separately our keys. Therefore I’m happy to share my solution with this new blog post 😃

#### Side note

Yes, we are aware that our environment variables will be contained in our client bundle and therefore exposed to anyone with a bit of retro engineering but we thought that it would be a bit cleaner to not push them in our Git repo.

### Getting started

Stencil’s projects relies on [Rollup](https://rollupjs.org), therefore we are not going to reinvent the wheel, we are just going to use the Rollup’s plugin [rollup plugin-replace](https://github.com/rollup/rollup-plugin-replace) which we install running the following command line:

```
npm install rollup-plugin-replace --save-dev
```

This plugin will allow us to replace values at bundle time.

### Configuring the environments

Once the plugin installed, we could edit our configuration in our bootstrap classes respectively we could edit our `app.ts` file in order to replace the values we want to hide. In this specific post we are going to hide the url of the API. To do so, we are going to replace the values with a unique selector (which will be automatically replaced with the real values at bundling time once we have implemented the all solution):

```
import {setupConfig} from
                '../app/services/environment/environment-config';

setupConfig({
    url: '<@API_URL@>',
    production: true
});
```

In my previous article we defined two different environments and therefore I will still assume that our goal is to handle two environments, respectively `production` and `development` .

Identically we are then going to replace the API url with our selector in the development configuration, respectively in the `app-dev.ts` file:

```
import {setupConfig} from
                '../app/services/environment/environment-config';

setupConfig({
    url: '<@API_URL@>',
    production: false
});
```

_Note that we are using `<@` and `@>` to make our selector really unique. These attributes aren’t static, if you rather like to use others it’s absolutely up-to you, no problem. You should then just reflect later in this tutorial your modifications when you will configure the plugin._

#### Defining the selectors’ values

To finalize the configuration, we should now create “somewhere” some files which will contain the real values for our selectors. Personally, I have chosen a solution where I handle the values in `json` files, placed at the root of my project and excluded from Git (I have added them to the list of Git `.ignored` files). We could therefore for example create a new file `config.prod.json` at the root of the project and edit it with our selector and real values:

```
{
  "API_URL": "https://api.production.com"
}
```

Of course, we should also now create another configuration file `config.dev.json` for the selector and values or our development environment:

```
{
  "API_URL": "http://localhost:3002"
}
```

### Running the application

Now that our configuration is ready, we should just configure and use the plugin we installed before in order to replace the selector with the real values at bundle time. For that purpose we are going to edit `stencil.config.ts` like the following:

```
import replace from 'rollup-plugin-replace';

// See my previous article for development detection

const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;

import devConfig from './config.dev.json';
import prodConfig from './config.prod.json';

const configValues = dev ? devConfig : prodConfig;

export const config: Config = {
    ...
    plugins: [
      replace({
        exclude: 'node_modules/**',
        delimiters: ['<@', '@>'],
        values: configValues
      }),
    ...
};
```

Voilà, nothing more, nothing less 🎉 From now on, each time you application will be bundled, the configuration values you saved separately or you didn’t committed in your repo will be injected at bundle time, easy peasy 👻

### Cherry on the cake 🍒🎂

Like I said in my introduction, this solution is implemented in our upcoming editor for PWA presentations DeckDeckGo and, as this project is open source, you are most welcomed to have a look at the solution I have implemented. You will notice that I implemented the exact same code and configuration as above but you will not find any `config.prod.json` or `config.dev.json` in our repo 😉

```
https://github.com/deckgo/deckdeckgo/tree/master/studio
```

To infinity and beyond 🚀

David
