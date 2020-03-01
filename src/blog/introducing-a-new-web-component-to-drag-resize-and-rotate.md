---
path: "/blog/introducing-a-new-web-component-to-drag-resize-and-rotate"
date: "2020-03-03"
title: "Introducing A New Web Component To Drag, Resize And Rotate"
description: "Add drag, drop and resize capabilities to your web apps with this new Web Component compatible with or without any modern frameworks"
tags: "#webdev #showdev #javascript #opensource"
image: "https://cdn-images-1.medium.com/max/1600/1*1pqUKDcoxfwUQ6jN6tZ0xQ.png"
canonical: https://medium.com/@david.dalbusco/syntax-highlighting-displayed-in-ubuntu-terminal-like-a7e9c310b504
---

![](https://cdn-images-1.medium.com/max/1600/1*1pqUKDcoxfwUQ6jN6tZ0xQ.png)

We are happy to unleash today a new open source Web Component we have developed for our web editor for presentations, [DeckDeckGo](https://deckdeckgo.com), which can help you add a **drag**, **resize** and **rotate** feature to your applications or websites, regardless of whether or not you are using a modern web framework. Moreover it works out of the box without any extra JavaScript codes need.

A demo is worth a thousand words, therefore here's what you can expect from it respectively how we are using it to let our users manipulate elements:

![](https://cdn-images-1.medium.com/max/1600/1*_hmiwuTByWYJXuViGPBxFQ.gif)

### Back Story

Performances and dependencies  do really matters to us that’s why we tend to be a bit bundleophibic and let’s face it, we are also nerds 🤷. Coding is a much a job as a hobby. That’s why we do like to spend our evenings and weekends to develop these kind of stuffs.

A couple of months ago, when we were brainstorming new ideas, [Nicolas](https://twitter.com/nasmattia) suggested to add a new template which would let users draw technical schema directly in our editor. This concept implied two complexities, preserving the aspect ratio of the content of the slide across devices and being able to manipulate (drag, resize and rotate) its content, that’s why it took us a bit to schedule and realize it.

Moreover, even if at first glance it might looks easy to implement, we discovered while developing it, that the required maths were actually more challenging than expected and therefore obviously even more fun 😉

*Nicolas published today a post in which he details the mathematical problems and solutions. [Check it out on his blog]([Check it out on his blog](https://nmattia.com/posts/2020-03-03-drag-resize-rotate.html)).*

### Getting Started

The easiest way to try out our component is probably using  it, with the help of [Unpkg](https://unpkg.com/), in a plain HTML file.

```html
<html>
<head>
  <script type="module" src="https://unpkg.com/@deckdeckgo/drag-resize-rotate@latest/dist/deckdeckgo-drag-resize/deckdeckgo-drag-resize.esm.js"></script>
  <script nomodule="" src="https://unpkg.com/@deckdeckgo/drag-resize-rotate@latest/dist/deckdeckgo-drag-resize/deckdeckgo-drag-resize.js"></script>
</head>
<body>

</body>
</html>
```

Once the component imported, it can be used to drag, resize or rotate any elements. For that purpose, it should be just wrapped around each of these which have to be manipulated. For example, let’s say we have a division element.

```html
<div style="background: purple;"></div>
```

If we want to make it movable, draggable and resizable, we wrap it in our Web Component `<deckgo-drr/>` , we specify its default size and position with CSS4 variables and … that’s it 🎉.

```html
<deckgo-drr
  style="--width: 10%; --height: 19%; --top: 15%; --left: 12.5%;">
  <div style="background: purple;"></div>
</deckgo-drr>
```

All together tested in the browser looks like the following.

![](https://cdn-images-1.medium.com/max/1600/1*XUNHKbM_Q7ht6KyiHhDezA.gif)

### Options

The cool thing, I think, about this component is that you don’t have to write any JavaScript code to use it. It should just be wrapped around and element and “it works”. It provides a couple of options, which are all documented in the related [chapter](https://docs.deckdeckgo.com/components/drr) of our documentation for developers. It notably does support various units (percent, viewport related or pixels) and each actions could be disabled separately. Its design can be customized with various CSS4 variables and finally it bubbles two events, one when the component is selected or unselected and another one when it has changed.

It is also worth to notice that it does support both mouse and touch interactions.

### What’s Next

What’s coming next is actually up to you 😉. We are open source and are eager to hear your feedback. Ping us on our [Slack](https://join.slack.com/t/deckdeckgo/shared_invite/enQtNzM0NjMwOTc3NTI0LTBlNmFhODNhYmRkMWUxZmU4ZTQ2MDJiNjlmYWZiODNjMDU5OGRjYThlZmZjMTc5YmQ3MzUzMDlhMzk0ZDgzMDY) channel, open an issue in our [repo](https://github.com/deckgo/deckdeckgo) or even provide a Pull Request, you are most welcomed to contribute to our pet project [DeckDeckGo](https://deckdeckgo.com) in any ways or simply by using it to compose your next slides 🙏.

To infinite and beyond 🚀!

David
