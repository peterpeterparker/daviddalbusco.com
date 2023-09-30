---
path: "/blog/the-mutationobserver-web-api"
date: "2021-05-11"
title: "The MutationObserver Web API"
description: "An introduction to the MutationObserver Web API which provides the ability to watch for changes being made to the document."
tags: "#webdev #showdev #javascript #beginner"
image: "https://cdn-images-1.medium.com/max/1600/1*uslRrEbuAeXmZvnKzhpPaQ.jpeg"
canonical: "https://daviddalbusco.medium.com/the-mutationobserver-web-api-cf469261eb36"
---

![](https://cdn-images-1.medium.com/max/1600/1*uslRrEbuAeXmZvnKzhpPaQ.jpeg)

_Source forum [resetera](https://www.resetera.com/threads/magneto-or-professor-x-who-do-you-side-with-more.291911/)_

I recently developed multiple features across projects with the help of the [MutationObserver Web API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver). A bit to my surprise, I noticed that some colleagues never had used it or, even heard about it before. That’s why I got the idea for this blog post.

---

### Introduction

The `MutationObserver` interface provides the ability to watch for changes being made the `DOM` tree (source [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)).

It is a web feature, natively implemented in all browsers (yes even Internet Explorer v11 according [Caniuse](https://caniuse.com/?search=mutationobserver)), which allows us to detect when changes are made to a document, to the web page.

---

### In Other Words

I dislike "The Last stand" movie but, do you remember when Rogue gets the vaccine (1) to remove her powers (2)? Without any other information, we still don't know if the cure was effective or not. To resolve the question (3), we would have to try our luck and get in contact but, without knowing what result to expect. On the other hand, thanks to his psychokinesis power, the professor X would him be able to detect the mutation (4) and knows if it worked out or not.

Our web page follows the same idea.

When we apply a modification to the DOM (1), such as modifying a tag or an attribute, with or without framework, it is interpreted and rendered by the browser (2). Even though the operation is really fast, if we query (3) the DOM elements touched by our changes right afterwards, we cannot be 100% sure that the modifications were already applied. Fortunately, thanks to the `MutationObserver`, we can detect the mutation (4) to get to know when and if it effectively worked out.

---

### Walk-through

To initialize a `MutationObserver` , you shall invoke its `constructor` with, as parameter, a `callback` function to be called when DOM changes occur.

```javascript
const observer = new MutationObserver(callback);
```

The callback gets as parameter an array of the individual DOM mutations which have been applied.

To observe a targeted node and to begin receiving notification through the callback, you can invoke the function `observe()` .

```javascript
observer.observe(targetNode, config);
```

As second parameter, a configuration shall be passed. It defines which kind of mutations we are looking to observe. These are documented on the excellent [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe). When it comes to me, I often use `attributes` to observe modifications to `style` and, `class` or, as in previous example, `childlist` to observe changes to the children of an element.

To stop the `MutationObserver` from receiving further notifications until and unless `observe()` is called again, the function `disconnect()` shall be used. It can be called within the callback or anywhere, as long as it is called on the instance.

```javascript
observer.disconnect();
```

Last but, not least, it exposes a function `takeRecords()` which can be queried to remove all pending notifications.

---

### Concrete Example

I was developing some improvements in the WYSIWYG inline editor of [DeckDeckGo](https://deckdeckgo.com) in which I had to apply a color to the user’s selection, entered via an input field, while preserving the range so that each time the user enters a new color, it would be applied to the same selected text 🤪.

Summarized something like following:

```javascript
class Cmp {

      private range = window.getSelection()?.getRangeAt(0);

      applyColor() {
        const selection = window.getSelection();

        selection?.removeAllRanges();
        selection?.addRange(this.range);

        const color = document.querySelector('input').value;

        document.execCommand('foreColor', false, color);

        this.range = selection?.getRangeAt(0);
      }

    }
```

It should have worked right? Well, no, it did not or at least not fully 😉.

Indeed, getting and applying the color to the selection did work as expected but, I was unable to save the range afterwards, `this.range` was not re-assigned as I was expecting.

Fortunately, I was able to solve the issue with the `MutationObserver` .

```javascript
class Cmp {

      private range = window.getSelection()?.getRangeAt(0);

      applyColor() {
        const selection = window.getSelection();

        selection?.removeAllRanges();
        selection?.addRange(this.range);

        const color = document.querySelector('input').value;

        // A. Create an observer
        const observer = new MutationObserver(_mutations => {
            // D. Disconnect it when triggered as I only needed it once
            observer.disconnect();
            // E. Save the range as previously implemented
            this.range = selection?.getRangeAt(0);
        });

        // B. Get the DOM element to observe
        const anchorNode = selection?.anchorNode;

        // C. Observe 👀
        observer.observe(anchorNode, {childList: true});

        document.execCommand('foreColor', false, color);
      }
    }
```

First (A) I created a new `MutationObserver`. I defined which node element, in my case a parent one, had to be observed (B) and, I configured the observer (C) to begin receiving notifications through its callback function when DOM changes occurred. In the callback, I first disconnected (D) it, as only one event was interesting for my use case and finally (E) was able to save the range as expected 🥳.

---

### Go Further

If you liked this introduction about the `MutationObserver` , I can suggest you to go further and, have a look to the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) and [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver).

The first one can for example be used to detect changes to the size of editable fields and, the second one to lazy load content.

---

### Summary

You might not use the observers every day but, they are extremely useful when it comes to detecting changes applied to the DOM. In addition, it is fun to develop features with these 🤙.

To infinity and beyond!

David
