---
path: "/blog/contribute-to-our-open-source-project"
date: "2019-07-26"
title: "Contribute to our open source project"
description: "Are you looking to contribute to a new open source project? Or want to get started with technologies like Web Components and StencilJS ? Contribute to our open source project DeckDeckGo"
tags: "#opensource #beginners #motivation #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*5Fjoye88JFo3hqnenly5UQ.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*5Fjoye88JFo3hqnenly5UQ.jpeg)
*Photo by [Álvaro Serrano](https://unsplash.com/@alvaroserrano?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Are you looking to contribute to a new open source project? Or want to get started with technologies like Web Components and [StencilJS](https://stenciljs.com) ?

We are developing [DeckDeckGo](https://deckdeckgo.com), a web open source editor for presentations, and would love to count on you as a contributor to improve our components and applications 🙏

### Get started

As the project’s size grew quite a bit the past couple of months, you might ask yourself, where to get started 🤔?

Well, guess what, I asked my self the same question 🤣 After thinking about it, I came to the conclusion that the process will be iterative for both of us. Moreover than helping us resolve issues, you will help us learn how to better structure issues for contributors and also help us shape the process.

For the purpose of this first experience, I have then selected the following four features which have to be implemented in our “core” and “highlight-code” Web Components developed with StencilJS.

### The countdown template

The presentations developed with DeckDeckGo are based on predefined templates. These could be simple text templates, where the text boxes are for example centered in the slides, or where the slides are split in two columns or even a bit funnier where Gifs could be easily integrated.

A couple of months ago, I went to a meetup where the organizer kept telling “we are beginning in 10 minutes” followed by “we are beginning in 5 minutes” and then in “now in 2 minutes” etc. I thought, specially if there is a large crowd, that it would be maybe cool to just display the information on the big screen. That’s why I came to the idea of having a template where the user could just pass a date and time as parameter and DeckDeckGo takes care or rendering a count down on screen 😁

![](https://cdn-images-1.medium.com/max/1600/1*voVxknfmRH_le-JkDvJD2Q.png)

*Our remote control has a “timer” feature, maybe its design could be use as inspiration*

Interested? 👉 [Issue #45: [core] the countdown slide template](https://github.com/deckgo/deckdeckgo/issues/45)

### Transition “face effect”

The “only” transition effect currently happening when swiping between slides is a “slide” effect (current slide is dragged away of the window and the new one is dragged in).

![](https://cdn-images-1.medium.com/max/1600/1*kEdSJGj91MbKjl3as1w7FA.gif)

*Current “slide” effect*

I thought it would be neat to have an option to select another type of animation beginning with the implementation of a  “fade effect” transition.

Interested? 👉 [Issue #70: [core] Transition animation with “fade effect”](https://github.com/deckgo/deckdeckgo/issues/70)

### Youtube short Url

Among all the templates, there is a [YouTube template](https://docs.deckdeckgo.com/slides/youtube) which helps to easily integrate YouTube videos in the presentations. It is also interconnected with our [remote control](https://deckdeckgo.app) to let the speakers stop/start their video remotely 📱

<iframe width="280" height="158" src="https://www.youtube.com/embed/3o3oGBTTRSs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe
<br/>

*A video I recorded when I released the remote control*

In order to be able to embed a YouTube video, its Url has to follow a specific format which isn’t the same as the one of the short Url exported by the social share component used by Youtube. That’s why, if such Url would be detected, the id of the video would have to be extracted in order to be formatted in a correct link.

We already have implemented this for Url which would be copied/pasted from the browser navigation bar, therefore this improvement would only be an “improvement” to the existing.

Interested? 👉 [Issue #204: [core] Handle Youtube short URL](https://github.com/deckgo/deckdeckgo/issues/204)

### Optional line numbers for code highlighting

With our Web Component to format and highlight code, which use [Prism.js](https://prismjs.com)under the hood, it is already possible to highlight specific lines. I was thinking that adding an option to add automatically line numbers at the begin of each lines would be a nice add-ons. I could think that these numbers could be useful when the speaker want to reference a line while talking or also when the component would be use in a web page, might help if needed to make references more clear.

![](https://cdn-images-1.medium.com/max/1600/1*fv8n52dHip5HUJABheKN2w.png)

*A sneak peek of this component in our upcoming editor for presentations*

Interested? 👉 [Issue #115: [highlight-code] display optionally line numbers](https://github.com/deckgo/deckdeckgo/issues/115)

### Cherry on the cake 🍒🎂

Beside unlocking some karma points, you know what would be cool with your contribution? All the improvements you will submit will not have effect to the components, they will have an impact and be included in our upcoming editor and platform for presentations. Kind of cool to know that something you would develop will for sure be available in an online live application, isn’t it?

To infinity and beyond!

David
