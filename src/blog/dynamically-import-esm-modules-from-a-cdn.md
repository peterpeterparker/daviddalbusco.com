---
path: "/blog/dynamically-import-esm-modules-from-a-cdn"
date: "2021-09-27"
title: "Dynamically Import ESM Modules From A CDN"
description: "Lazy load JavaScript code from a content delivery network to serve users only what they need when they need it."
tags: "#javascript #webdev #architecture #programming"
image: "https://daviddalbusco.com/assets/images/1*hC1zkJeJsjBGN56FMa5mJA.jpeg"
canonical: "https://daviddalbusco.medium.com/dynamically-import-esm-modules-from-a-cdn-5a6f741e2a1c"
---

![](https://daviddalbusco.com/assets/images/1*hC1zkJeJsjBGN56FMa5mJA.jpeg)

_Photo by [Daniel Born](https://unsplash.com/@danborn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

What if I told you modern browsers can natively import a single, or sets of functions, of a JavaScript library bundles, at runtime and, from a CDN? Wouldn’t that open up possibilities?

Well, good news. This is not an hypothesis but, a fact. Nowadays, all modern browsers can dynamically import [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) from content delivery networks 🥳.

---

### Introduction

There are a number of libraries and frameworks that enable module usage when developing web frontend applications. Most apps and libraries will have their files “bundled” using tools like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or with more recent bundler such as [esbuild](https://esbuild.github.io/).

Thanks to these tools, the JavaScript code can be analyzed, build and split into smaller chunks.

While this approach works like a charm, it has for downside that ES modules are imported regardless if executed or not.

For example, if you would use an awesome library such as [idb-keyval](https://github.com/jakearchibald/idb-keyval) to print out a value stored in IndexedDB but, had for goal to reserve the function to administrators only.

```javascript
import { get } from "idb-keyval";

const print = async (admin) => {
	if (!admin) {
		return;
	}

	console.log(await get("hello"));
};
```

If the code is build statically, the third party dependency would be added to the ES modules no matter what. As a result, all users, administrators or not, would have to download the related code even if they would never require it.

This is when dynamic import, part of the [official TC39](https://github.com/tc39/proposal-dynamic-importhttps://github.com/tc39/proposal-dynamic-import) proposal and which has been standardized with [ECMAScript 2020](https://tc39.es/ecma262/2020/), comes into play.

It tells the browser to load code on demand and only when it is required.

```javascript
const print = async (admin) => {
	if (!admin) {
		return;
	}

	const { get } = await import("idb-keyval");

	console.log(await get("hello"));
};
```

Only the administrators would now have to download the code of the third party library.

_Note: Dynamic import is not mandatory, your code is all fine. Bundlers and browsers do an incredible job with the dozens of modules of your libraries and applications. It can be helpful in some situations. As in the above example, or when large modules take time to load. It can help improve boot time performance._

---

### Dynamic Import + CDN … But Why?

Imagine now you are developing an application that interact with a backend. Whether you implement your own API or use a third party cloud provider, the code that interact with your data might commonly find place within your frontend app.

![](https://daviddalbusco.com/assets/images/1*YQ5N22V_d5PVclZ7Ups0jg.png)

As we have seen in previous chapter, if you do not take advantages of “dynamic import”, all users might therefore download the code to interact with the backend (displayed in the schema as “services”) regardless if they use it or not.

While this is probably often not an issue - after all, if the application uses an API, there is a good chance that all users use it - it can become one over time because such design is tight to a vendor lock-in.

Some day, you might have to migrate the application to a new backend or another cloud provider and, the complexity of the upgrade might become a problem.

To prevent such issue, you might extract the “Services” to libraries, giving you more flexibility foreseen the pitfall.

![](https://daviddalbusco.com/assets/images/1*zppU1zdm2fm1va-X3WRWxw.png)

However, without “dynamic import”, all users might still download all the code, what would be particularly unfortunate if you would ship the application with both “old” and “new” services at some point.

![](https://daviddalbusco.com/assets/images/1*09yQFPIiesplbZikZN2tEA.png)

Let’s imagine again that everything is in now place. The application leverages “dynamic import”, both “old” and “new” services have been extracted to separate libs.

Even though everything works for the best, at this point, the frontend application has direct dependencies (think `npm i lib --save`) on these libraries.

If you make any changes in the services, you have to re-build and re-deploy everything, what can quickly become tasky. Especially if you have got not “just” two services but lots of them.

This is where the combination of “dynamic import” and CDN is finally going to shine.

These two strategies applied together can transform the frontend application from a monolith to a modular solution.

![](https://daviddalbusco.com/assets/images/1*Q4niQVYzosDUo96OS6jr7Q.png)

For each user request, upon a certain condition such as an environment configuration, the frontend application can request at runtime only the function(s), piece of code, needed to perform the specific queries.

Doing so, not just the user is downloading only what is required to perform the queries but, the application also becomes almost independent of the services. Patching these or even adding a new backend can now be developed and deployed without any changes to the application!

---

### Show Me Some Code

That was a long introduction and explanation, I hope you are still here 😅. A few code is often worth a thousand words, therefore here is how you can dynamically import function(s) from a CDN:

```javascript
import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome implements ComponentInterface {

  async componentDidLoad() {
    const cdn = 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+es';

    const {get, set} = await import(cdn);

    await set('hello', 'world');
    console.log(await get('hello'));
  }

  render() {
    return (
      <mark>dynamic import esm + cdn = ❤️</mark>
    );
  }
}
```

The above code is presented in a [Stencil](https://stenciljs.com/) web component to highlight the fact that it works in any modern browsers.

When the component is mounted, it creates a `string` variable that point to the ES modules that needs to be loaded.

The usage of such a temporary `string` value is useful with TypeScript. Without it, the compiler throws an error `TS2307: Cannot find module 'https://...' or its corresponding type declarations.`

The URL of the library on the CDN can then be used to dynamically import, `await import(cdn)`, the functions we are interested in and voilà, that’s already it 🥳.

---

### Type Safety

Dynamic import is a native feature, therefore supported out of the box in JavaScript. To improve the syntax with TypeScript, I suggest to use interfaces that can be shared by the consumer (the frontend application) and the libraries (the “Services”).

![](https://daviddalbusco.com/assets/images/1*ZP2hO1-pD2NH0vLPqDvfJg.png)

---

For example, we can declare an `interface` of a function that says “hello”:

```javascript
export interface SayHello {
  ({name}: {name: string}): Promise<string>;
}
```

The `library` can implements it as follows:

```javascript
export const say: SayHello =
               async ({name}: {name: string}): Promise<string> => {
  return `Hello ${name}`;
}
```

The `app` can also uses the types to improve the syntax:

```javascript
(async function() {
  const cdn = 'https://..../index.esm.js';

  const {say}: {say: SayHello} = await import(cdn);

  await say({name: 'David'});
}());
```

Moreover, extracting interfaces and types can also ease new development in the future.

---

### Conclusion

This approach, “Dynamic Import + CDN”, is not just words to me. It is the core architecture of the next major release(s) of [DeckDeckGo](https://deckdeckgo.com).

Our main application (source [GitHub](https://github.com/deckgo/deckdeckgo/tree/main/studio)), the core, is an offline first editor for slides that has no dependencies to any API.

It “only” consumes a library (source [GitHub](https://github.com/deckgo/deckdeckgo/tree/main/utils/editor)) that describes and exposes the interfaces for endpoints that can be use if a backend is configured.

As we are currently using in production both [Google Firestore](https://firebase.google.com/products/firestore) (see [GitHub](https://github.com/deckgo/deckdeckgo/tree/main/providers/firebase)) and [AWS Lambda](https://aws.amazon.com/lambda/) (see [GitHub](https://github.com/deckgo/deckdeckgo/tree/main/providers/api)), there are two services that are dynamically imported at runtime through a CDN to perform the operations with these cloud providers.

Meanwhile, we have also developed a (successful) proof of concept to port our web app to the [DFINITY](https://dfinity.org/)’s Internet Computer and we are continuing the work towards this direction because, spoiler alert, it is the future. That is why another service interacts with the blockchain network (see [GitHub](https://github.com/deckgo/deckdeckgo/tree/main/providers/ic)).

Finally, thanks to the modular architecture, we are able to quickly integrate our editor in any networks if some clients are looking to use it on-premises.

Summarized: we are future-proof 🚀.

To infinity and beyond!

David
