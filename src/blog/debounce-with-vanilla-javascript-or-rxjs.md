---
path: "/blog/debounce-with-vanilla-javascript-or-rxjs"
date: "2019-09-18"
title: "Debounce with vanilla JavaScript or RxJS"
description: "Debounce with vanilla JavaScript or RxJS"
tags: "#tutorial #javascript #rxjs #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*710b8KhbLG3vPrV2cL-3dw.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*710b8KhbLG3vPrV2cL-3dw.jpeg)

*Photo by [Barna Bartis](https://unsplash.com/@barnabartis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I recently had to clean the code we are using in [DeckDeckGo](https://deckdeckgo.com) and had notably to refactor singleton methods to stateless functions. One of these gave me a harder time and that's why, guess what, I came to the idea of this new blog post 😅

### What is debouncing?

![](https://cdn-images-1.medium.com/max/1600/1*L2pWuWEFxqMLUPGnmumuaw.gif)

*Sure, what’s “debouncing” ?*

Let’s say you have implemented an `<input/>` in your application which triggers an update into your database each time its content change. For performance reason and maybe even for cost reason (if for example you are using [Google Firestore](https://cloud.google.com/firestore/pricing)) you might not want to trigger a database update every single time a keyboard key is hit but rather perform a save only when needed. For example you might want to only perform the save when the user would mark a pause or when she/he has finished her/his interaction with the component.

Likewise, you may have a function in your application, which might be called multiple times in a row, for which you would rather like to consider only the last call.

That is what debouncing is for me, to make sure that a method is not called too often.

### Debounce time

Commonly, in order to detect which functions should effectively be triggered, a delay between calls is observed. For example, if we are debouncing a function with a debounce time of 300ms, as soon as, or more than, 300ms between two calls are observed, the function will be triggered.

### Vanilla Javascript

![](https://cdn-images-1.medium.com/max/1600/1*1kXFGBTN-o1VZ8nxRn5yjw.gif)

*setTimeout and clearTimeout working together*

There is currently no platform implementation of a standard “debouncing function” supported across browsers (correct me if I am wrong of course 😅). Fortunately, Javascript provide both the ability to delay a function’s call using `setTimeout` and to cancel it using `clearTimeout` which we could combine in order to implement our own solution.

```
export function debounce(func: Function, timeout?: number) {
    let timer: number | undefined;
    return (...args: any[]) => {
        const next = () => func(...args);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(next, timeout > 0 ? timeout : 300);
    };
}
```

In the above code, our function (the one we effectively want to perform, passed as parameter `func` ) is going to be delayed (`setTimeout`). Before effectively doing so, we first check if it was not already called before (using the `timer` reference to the previous call) and if it was, we cancel this previous call (`clearTimeout`) before effectively delaying our target.

We could for example validate this implementation with a simple test. We could call multiple times in a row a function which log a string to the console. If everything works well, the output should occur only one time.

```
const myFunction: Function = debounce(() => {
  console.log('Triggered only once');
});

myFunction(); // Cleared
myFunction(); // Cleared
myFunction(); // Cleared
myFunction(); // Cleared
myFunction(); // Performed and will output: Triggered only once
```

If you wish to observe and test this in action, give a try to this [Codepen](https://codepen.io/peterpeterparker/pen/WNegLNb).

### RxJS

![](https://cdn-images-1.medium.com/max/1600/1*N3XGY3qwrM86jfr-WdqbHg.gif)

*Good dog helping with the cleaning*

The above solution with vanilla Javascript is pretty cool but what about achieving the same result using [RxJS](https://rxjs-dev.firebaseapp.com) (the Reactive Extensions Library for JavaScript)? That would be pretty slick isn’t it? Lucky us, RxJS offers out of the box a solution to debounce easily functions using Observables. Moreover, in my point of view, this solution is a bit cleaner and more readable.

The RxJS function we are going to use is [debounceTime](https://rxjs-dev.firebaseapp.com/api/operators/debounceTime). As explained in the documentation, it delays values emitted by a source Observable, but drops previous pending delayed emissions if a new value arrives on the source Observable. To reproduce the same example as above and to create an observable, we could for example use a `Subject` and triggers multiple times in a row `next()` . If everything goes according plan, again, we should find only a single output in the console.

```
const mySubject: Subject<void> = new Subject();
subject.pipe(debounceTime(300)).subscribe(() => {
  console.log('Triggered only once');
});

mySubject.next(); // Cleared
mySubject.next(); // Cleared
mySubject.next(); // Cleared
mySubject.next(); // Cleared
mySubject.next(); // Performed and will output: Triggered only once
```

That’s it, nothing more nothing else. No custom functions to write, RxJS just solves the debouncing for us.

If you wish to give it a try in action too, have a look at this other [Codepen](https://codepen.io/peterpeterparker/pen/ZEzqXPw).

*Notabene: in the above example I did not, for simplicity reason, took care of unsubscribing the Observable. Obviously if you would use this solution in a real application, please be careful about this.*

### Cherry on the cake 🍒🎂

In our open source project [DeckDeckGo](https://deckdeckgo.com), we are using a small utils package across our applications and components called `deckdeckgo/utils` (published to [npm](https://www.npmjs.com/package/@deckdeckgo/utils)) which offers miscellaneous utilities. One of these being the vanilla Javascript `debounce` function. Therefore, if you need a quick and dirty solution, be our guest and give it a try 🖖

👉 [https://github.com/deckgo/deckdeckgo/tree/master/webcomponents/utils](https://github.com/deckgo/deckdeckgo/tree/master/webcomponents/utils)

To infinity and beyond 🚀

David
