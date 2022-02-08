---
path: "/blog/stylo-another-kind-of-rich-text-editor"
date: "2022-02-08"
title: "Stylo - Another Kind Of Rich Text Editor"
description: "So, I developed a new open source WYSIWYG interactive editor for JavaScript."
tags: "#javascript #showdev #webdev #webcomponents"
image: "https://cdn-images-1.medium.com/max/1600/1*kPGH8RB1reGGiq6nU0UaIg.jpeg"
canonical: "https://zhx6p-eqaaa-aaaai-abbrq-cai.raw.ic0.app/d/converting-svg-to-image-in-javascript"
---

![](https://cdn-images-1.medium.com/max/1600/1*kPGH8RB1reGGiq6nU0UaIg.jpeg)

*Photo by [Amy Hirschi](https://unsplash.com/@amyhirschi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/pen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

*****

So, I developed a new open source WYSIWYG interactive editor for JavaScript. Its goal is to bring great user experience and interactivity to the web, for everyone, with no dependencies. I called it: [Stylo](https://stylojs.com/).

*****

### But Why?

Last year, while migrating our web editor for slides, [DeckDeckGo](https://deckdeckgo.com), to [DFINITY](https://dfinity.org)’s Internet Computer, we started playing around with some new code to support documents as well.

As a very first test, I wrote and published a blog post on our platform. Although I was satisfied with the result, I thought: this can be better.

That’s why I had the idea to extract the rich text editor capabilities of the core of our application -- under the assumption that it would be easier to improve and fix the text editor in isolation.

In addition, by publishing the new library as a new open source repo, I was also hoping it would benefit from community feedback and contributions.

What can I add? I am an engineer, I like to code 😉.

*****

### Features

Not looking to oversell what Stylo can do — or do differently — but here are in my humble opinion a list of cool things it can do:

*****

#### Interactive Design 🎯

Unlike other WYSIWYG editors, Stylo has no sticky toolbar. It is inspired by design and user experience of platforms that I like — i.e [Notion](https://www.notion.so/) and [Medium](https://medium.com/).

![](https://cdn-images-1.medium.com/max/1600/1*D-YYgIa5cY0Ya8FAN0Lyiw.gif)

When writing the document, the user can use different types of paragraph that can be added through a floating menu. These elements can be simple HTML elements — i.e. h1, h2, code etc. — or more complex block — i.e. any Web Component.

For styling purposes, another toolbar gives the user the ability to modify text — e.g. bold, italic, colors, etc. — and add hyperlinks.

Last but not least, for an optimized experience on desktop, many actions can be performed without the mouse. Opening the list of paragraphs can be triggered hitting “/” and **bold**, *italic* and `mark` are accessible through keyboard shortcuts.

*****

#### Customizable 💪

Conceptually, only one main element — a container — has to be set as editable and all its children are either HTML Elements or Web Components — i.e. no direct text node descendant.

This decision was made for performance reasons. In the future we might need to lazy load the content or improve the scrolling experience with some sort of infinite scrolling or some other virtual scrolling approach. By limiting children to elements, it is possible to assign attributes such as unique ids directly in the DOM.

This brings us to the customization. The various types of paragraphs that can be added by the user - e.g. block of code, titles, etc. - is fully customizable. Each type - i.e. plugin - is defined with a ​text​, an ​icon​ and a​ function that adds a new element to the document.

For example, if we were to implement a plugin that generates a new paragraph that is itself a Web Component name <hello-world/>, the solution would look something like this:

```javascript
import {createEmptyElement, StyloPlugin, StyloPluginCreateParagraphsParams, transformParagraph} from '@papyrs/stylo';
export const hr: StyloPlugin = {
  text: 'My Hello World',
  icon: `<svg width="32" height="32" viewBox="0 0 512 512">
        ...
    </svg>
  `,
  createParagraphs: async ({container, paragraph}: StyloPluginCreateParagraphsParams) => {
    // Create your Web Component or HTML Element
    const helloWorld = document.createElement('hello-world');
    // Set properties, attributes or styles
    helloWorld.setAttributes('yolo', 'true');
     transformParagraph({
       elements: [helloWorld, createEmptyElement({nodeName: 'div'})],
       paragraph,
       container,
       focus: 'first'
     })
  }
};
```

Stylo exposes interfaces and utilities to ease the development of custom plugins. The most important being maybe `transformParagraph` which adds the elements to the DOM.

Finally, it is worth noting that the function `createParagraphs` is async which means the process of creating new elements can totally be hijacked by your application. As for example, when integrated in DeckDeckGo, the function does not always directly create new elements. For some more complex use cases, when the function is triggered, it opens modals that require more user interactions such as selecting an image before effectively modifying the content.

![](https://cdn-images-1.medium.com/max/1600/1*9GgkGbx_4D-hIwT8PxJivQ.gif)

*****

#### Framework Agnostic 😎

Stylo is a framework agnostic library of reusable components developed with [StencilJS](https://stenciljs.com/). It works on all modern browsers.

*****

#### Lightweight 🪶

30kb gzipped might in certain circumstances already sound like a lot, especially to me, but in terms of WYSIWYG editor it actually turns out be lightweight.

From what I observed, it might even be the lightest. There is also probably room for improvement.

*****

#### Future Proof 🚀

While a handful of actions in the alpha version still rely on `execCommand` to apply styles (e.g. bold, italic) — the core of the library does not.

Stylo controls what happens on every mutation. It uses the MutationObserver API to keep track of the changes and stacks them in a custom “undo-redo” implementation. It also forwards the information about what changed in the DOM to your application with custom events.

Plugins are applied using plain vanilla JavaScript and the Selection API is also used to detect and apply transformations.

That's why, regardless of what happens to the deprecated API, Stylo is built for the future.

*****

#### Open Source ⭐️

The components are licensed under MIT license. They can be used by anyone, anywhere where the web is used and this even in a closed source application.

To contribute and follow the adventure, watch and star the [GitHub repo](https://github.com/papyrs/stylo).

*****

### Is It Production Ready?

![](https://cdn-images-1.medium.com/max/1600/1*snbd7Pn0GcdqaEa9m48cIQ.gif)

Stylo is currently an **alpha** version! ⚠️ The project is under active development and contributions on GitHub are most welcome.

I did use it — not without noticing many bugs I need to fix — to write this article. It might probably not be ready tomorrow nor the day after but I am confident that it will be ready to start the beta phase of our project that will run on the Internet Computer.

*****

### Conclusion

I am well aware there is still quite some work to make [Stylo](https://stylojs.com) bulletproof but it is quite exciting because it is also challenging 😉.

To infinity and beyond!
David


*****

### Further Reading

Wanna read more about our project? We are porting [DeckDeckGo](https://deckdeckgo.com/) to [DFINITY’s](https://dfinity.org/) Internet Computer. Here is the list of blog posts I published since we started the project:

* [Converting SVG To Image (PNG, Webp, etc.) in JavaScript](https://daviddalbusco.com/blog/converting-svg-to-image-png-webp-etc-in-javascript)
* [A Simple KeyVal Store Implemented in Motoko](https://daviddalbusco.com/blog/a-simple-keyval-store-implemented-in-motoko)
* [TypeScript Utilities For Candid](https://daviddalbusco.com/blog/typescript-utilities-for-candid)
* [Bye-Bye Amazon & Google, Hello Web 3.0](https://daviddalbusco.com/blog/bye-bye-amazon-and-google-hello-web-3-0)
* [Dynamically Import ESM Modules From A CDN](https://daviddalbusco.com/blog/dynamically-import-esm-modules-from-a-cdn)
* [Internet Computer: Web App Decentralized Database Architecture](https://daviddalbusco.com/blog/internet-computer-web-app-decentralized-database-architecture)
* [Singleton & Factory Patterns With TypeScript](https://daviddalbusco.com/blog/singleton-and-factory-patterns-with-typescript)
* [Hosting on the Internet Computer](https://daviddalbusco.com/blog/getting-started-with-the-internet-computer-web-hosting)
* [We Received A Grant To Port Our Web App To The Internet Computer](https://daviddalbusco.com/blog/we-received-a-grant-to-port-our-web-app-to-the-internet-computer)
