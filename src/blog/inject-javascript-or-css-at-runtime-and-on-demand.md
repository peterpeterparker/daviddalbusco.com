---
path: "/blog/inject-javascript-or-css-at-runtime-and-on-demand"
date: "2020-03-18"
title: "Inject JavaScript Or CSS At Runtime And OnDemand"
description: "How to load a JavaScript library, component or a style only when you really need it #OneTrickADay-32"
tags: "#webdev #javascript #css #html"
image: "https://cdn-images-1.medium.com/max/1600/1*NFVyLIxNmR6l8QJjFmzIpg.png"
canonical: "https://medium.com/@david.dalbusco/inject-javascript-or-css-at-runtime-and-on-demand-dd89c109c6b3"
---

![](https://cdn-images-1.medium.com/max/1600/1*NFVyLIxNmR6l8QJjFmzIpg.png)

*Photo by [Aditya Saxena](https://unsplash.com/@adityaries?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I [challenged](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) my self to share a blog post each and every single day until end of the current quarantine in Switzerland, the 19th April 2020. Thirty-two days left until hopefully better days.

In this third blog post, I would like to share with you a trick we are using in our open source project [DeckDeckGo](https://deckdeckgo.com) but also one which has been shared by [Cory McArthur](https://twitter.com/Corysmc), an incredible user experience engineer of [Sworkit](https://sworkit.com).

Commonly you are including your dependencies in your app bundle, but some of these might be used only in certain circumstances. For instance, if you are using [Firebase UI](https://github.com/firebase/firebaseui-web) to handle your authentication flow or if like us, you create a Web Component which act as a wrapper around another library like [Prismjs](https://prismjs.com), you might want to load these only when really needed.

Even though a lazy loading pattern might be use in your app, depending of your UX and routing, you might rarely face the case where such libraries are fetched even if actually not needed.

But no worries, here’s a trick to solve such requirement by injecting either a script or css in your page on demand and at runtime.

### Load Conditionally A Script

Let’s try to develop a new Web Component with [Stencil](https://stenciljs.com) which fetch a script when mounted. To do so, we run the following commands in a terminal:

```bash
npm init stencil
cd my-component
npm install
```

Once the project created, we edit the component and add a first test in order to verify if our script has not been added to the DOM before, because our component can be use multiple times in a page and we want to load our script only once.

```javascript
import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  
  async componentDidLoad() {
    const scripts = document.querySelector('[myscript-loaded]');

    if (!scripts) {
      // TODO: load script
    }
  }

  render() {
    return <div>Hello, World!</div>;
  }
}
```

Finally we can add our effective implementation which summarized works like the following: we create a new deferred `<script/>` which references the library or component we would like to load. Before adding it to the `header` of our page, we attach two events to handle both `success` or `error` .

```javascript
import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  async componentDidLoad() {
    const scripts = document.querySelector('[myscript-loaded]');

    if (!scripts) {
      const script = document.createElement('script');

      script.onload = async () => {
        script.setAttribute('myscript-loaded', 'true');
      };

      script.onerror = async ($err) => {
        console.error($err);
      };

      script.src = 'https://unpkg.com/myscript.js';
      script.defer = true;

      document.head.appendChild(script);
    }
  }

  render() {
    return <div>Hello, World!</div>;
  }
}
```

And…that’s it 🎉. By injecting the script in the header, the browser notices the change and proceeds it as it would normally do with any scripts.

### Cory’s Generic Functions

Above solution is cool but generic functions are way cooler and handier 😉. Therefore here is Cory’s awesome solution to load any JavaScript or CSS on demand:

```javascript
function injectJS(id: string, src: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!document) {
      resolve();
      return;
    }

    if (document.getElementById(id)) {
      resolve('JS already loaded.');
      return;
    }
    const script = document.createElement('script');

    script.id = id;
    script.async = true;
    script.defer = true;
    script.src = src;

    script.addEventListener('load', () => resolve('JS loaded.'));

    script.addEventListener('error', () => reject('Error script.'));
    script.addEventListener('abort', () => reject('Aborted.'));

    document.head.appendChild(script);
  });
}

function injectCSS(id: string, src: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!document) {
      resolve();
      return;
    }

    if (document.getElementById(id)) {
      resolve('CSS already loaded.');
      return;
    }

    const link = document.createElement('link');
    link.id = id;
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', src);

    link.addEventListener('load', () => resolve('CSS loaded.'));

    link.addEventListener('error', () => reject('Error css.'));
    link.addEventListener('abort', () => reject('CSS aborted.'));

    document.head.appendChild(link);
  });
}
```

Such utilities can notably use to load Firebase UI only when needed:

```javascript
await injectJS('firebase-ui-script', 'https://cdn.firebase.com/libs/firebaseui/4.0.0/firebaseui.js');
await injectCSS('firebase-ui-css', 'https://cdn.firebase.com/libs/firebaseui/4.0.0/firebaseui.css');
```

### Summary

One downside of the above solution, I’m agree, is the fact that you are handling a version number in, kind of, the middle of your code but to me, that’s a small trade of to be able to fetch some libraries only when needed because of the particular requirements of the UX of our editor, [DeckDeckgo](https://deckdeckgo.com).

I warmly thank [Cory](https://twitter.com/Corysmc) for having shared his solution and also for having answered some of my questions, when I developed our authentication’s flow. Not all heroes wear capes, you are super Cory 🙏

Stay home, stay safe!

David
