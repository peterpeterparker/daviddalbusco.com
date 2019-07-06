---
path: "/blog/my-first-post"
date: "2019-06-30"
title: "Angular services without Angular? Thank you Typescript"
description: "Create a singleton service with Typescript to narrow specific functions or share data across components"
tags: "#javascript #webdev #typescript #beginners"
image: "https://cdn-images-1.medium.com/max/1600/1*Snr-Scxt2w2y3LJa59HX9Q.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*Snr-Scxt2w2y3LJa59HX9Q.jpeg)
*Not related, it’s just that my mum is cooking french fries next to me right now — Photo by [Louis Hansel](https://unsplash.com/@louishansel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/fries?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

One thing we could all agree on, I think, is the fact that using [Angular services](https://angular.io/guide/architecture-services) is just super duper easy. They are a great way to narrow specific functions and are straight forward to understand.

Per default, each service exists once in memory, when the app is running, which typically allow us to share data across components. This concept follows the [singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern) or at least it is they way I always understand these.

Whether in the case of a simple [Node.js](https://nodejs.org/en/) projects or in a Progressive Web Apps developed with [Stencil](https://stenciljs.com/) I recently developed, I didn’t used Angular but I had to implement this particular concept.

Fortunately I was always using [Typescript](https://www.typescriptlang.org/) which allowed me to achieve my goal. That’s why I thought about sharing the outcome in this short new blog post.

### Implementation of a singleton service with Typescript

Typescript is somehow really close to Java, particularly in this specific solution. To implement a singleton we create a class with a constructor set as **private** to not allow “external” instantiations. Doing so, we create then our own “entry point generator” which we are going to declare as a **static** method (static being variables or functions shared between all instances) in order to create and serve only one **static** instance of our service.

```
export class SingletonService {

    private static instance: SingletonService;

    private constructor() {
    }

    static getInstance() {
        if (!SingletonService.instance) {
            SingletonService.instance = new SingletonService();
        }
        return SingletonService.instance;
    }
}
```

### Usage of a singleton service with Typescript

As we have set the constructor as private, we won’t be able to instantiate the service as would we would normally do.

For example, the following:

```
const myService: SingletonService = new SingletonService();
```

would result in the following error:

> TS2673: Constructor of class ‘SingletonService’ is private and only accessible within the class declaration.

That’s why we created our own “entry point generator” and why the correct instantiation of such a singleton service should be implemented like the following:

```
const myService: SingletonService = SingletonService.getInstance();
```

That’s it, nothing more, nothing less, we have created a single service available for all our components 🎉

### Cherry on the cake 🍒🎂

As I said in my introduction, I recently often implemented this singleton pattern concept. I noticed that it particularly works well together with [RxJs](https://rxjs-dev.firebaseapp.com/) and if you are looking for an example, you could have a look to the [documentation](https://docs.deckdeckgo.com/) of our open source project [DeckDeckGo](https://deckdeckgo.com/).

Concretely, here’s an implementation of a singleton service:

https://github.com/deckgo/deckdeckgo/blob/master/docs/src/app/services/menu/menu.service.tsx

And here’s an implementation of its usage:

https://github.com/deckgo/deckdeckgo/blob/1932ecfae03846f09a642858ba85e2fdccd666b4/docs/src/app/app-root.tsx#L19

If you’ve got any idea of improvements, please ping me as the above is the solution we are using in our upcoming web editor for presentations.

To infinity and beyond 🚀

David
