---
path: "/blog/deckdeckgo-kick-starting-2020-with-so-much-improvements"
date: "2020-01-20"
title: "DeckDeckGo: Kick-starting 2020 with so much improvements"
description: "We are unleashing Google Fonts, private assets, accessibility improvements and many new features in our web open source editor for presentations."
tags: "#showdev #webdev #motivation #productivity"
image: "https://cdn-images-1.medium.com/max/1600/1*Y4bkN-RtF1ROgb9jnGaE4g.png"
canonical: "https://medium.com/@david.dalbusco/deckdeckgo-kick-starting-2020-with-so-much-improvements-2e5f5636f881"
---

![](https://cdn-images-1.medium.com/max/1600/1*Y4bkN-RtF1ROgb9jnGaE4g.png)
*Background photo by [SpaceX](https://unsplash.com/@spacex?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

We have been relatively quiet since begin of last December, not on purpose, you know, just life, but recently, we increased our efforts and were even able to put together our biggest release so far! What a way of starting 2020.

Therefore, we are happy to release today the new version of our web open source editor for presentations: [DeckDeckGo](https://deckdeckgo.com).

It contains many improvements, fixes and notably the following features, which we hope, you are going to like.

### Google Fonts

Even if it was, and still is,  already included our [developer starter kit](https://docs.deckdeckgo.com), we never took the time to add the option to let our users customize easily the font of their decks. As of now, you will be able to use [Google Fonts](https://fonts.google.com) for your presentation.

![](https://cdn-images-1.medium.com/max/1600/1*U4Uc7u26qI7Seutz1ITlqQ.gif)

### Private Assets For Every Users

Even though it was actually already the case, we are also really happy to communicate that moreover the content, all custom assets (images or charts data) uploaded in our cloud (powered by the [Firebase Storage](https://firebase.google.com/docs/storage)) are private for every users too.

These are becoming public only once you would share your presentations online.

It might sounds silly to highlight this fact but we invested  some times in this particular subject as we worship the principle of “privacy per default”.

### Clone Presentations

When you develop a platform you often have to develop more than “just” its core process, about which I tend sometimes to be a bit obsessed 😅, but also utilities around it. Once of these which was still missing, was the ability to clone presentations. This has now been solved.

![](https://cdn-images-1.medium.com/max/1600/1*1CgaF2DzIeI1OK25f8Y-qg.gif)

### Landing Page

I’m agree that is maybe not the most meaningful feature for our existing users but without “landing page”, we guess that it was probably difficult for anyone landing on DeckDeckGo to actually understand quickly what’s all about, even if it is possible to create a couple of slides without having to register. Something which, by the way, doesn’t seems to be the norm nowadays on the internet and which is  really important to us.

It is worth to notice, notably as DeckDeckGo is a Progressive Web Apps and could be used in any mobile devices, that once registered, the “landing page” doesn’t appear anymore and our feed of recently shared presentations becomes again the welcoming screen.

![](https://cdn-images-1.medium.com/max/1600/1*AHvgqdYhGiNjNFgshMsLyw.gif)

### Accessibility

We just have one thing to say about accessibility: Roy ([Twitter](https://twitter.com/donroyco) / [GitHub](https://github.com/donroyco)) is a **hero**.

A cold Saturday last December, my inbox began to throw notifications about new GitHub issues which were recently opened, one after the other for quite an amount of time. All had to do with accessibility and moreover all were really well documented and totally correct, not questions ask. All these inputs were provided by Rob. He took some times, out of nowhere, to go through DeckDeckGo in order to test its accessibility. Afterwards he even provided three different GitHub issues’ templates which were missing too.

Really what could I say, if you don’t have faith in humanity and open source, Roy’s story is there to show you the opposite.

Thank you so much Roy 🙏

![](https://cdn-images-1.medium.com/max/1600/1*mgg66qja7oR8xi9kxtQMdA.gif)

It is also worth to notice that Grant ([Twitter](https://twitter.com/gherman1990) / [GitHub](https://github.com/grantlouisherman)) contributed **again** to one of our release which is super cool. Grant you are a hero too, thank you 🙏

### Embed Code

The decks you will edit and share with our online editor are as now of embeddable in any web pages. At first I thought that we should solve this with a super complex solution but finally I opted for a standard iFrame solution “à la Youtube”.

![](https://cdn-images-1.medium.com/max/1600/1*luu29-ONP3EAumNue6opKA.gif)

### Template “Author” New Design

DeckDeckGo is based on templates. The goal is to create presentations which fit any responsive device screens but also to be able to create these quickly. The template “Author” is a perfect example of this as it is using your registered (optional) data to prefill the slides with your informations (name, description, social links).

In this release, we have improved its layout, have added some options to the editor, like for example being able to opt out and not display your profile picture if you would rather like. We have also fix a long time issue and the slides will now display your social handles and not the name of the platform (“@daviddalbusco” instead of “Twitter”).

![](https://cdn-images-1.medium.com/max/1600/1*OS2ouBoXzZOFOQzWCRUYkw.gif)

We hope these features are quite intriguing and slick to you.  If you have any feedback, don’t hesitate to reach us on [Slack](https://join.slack.com/t/deckdeckgo/shared_invite/enQtNzM0NjMwOTc3NTI0LTBlNmFhODNhYmRkMWUxZmU4ZTQ2MDJiNjlmYWZiODNjMDU5OGRjYThlZmZjMTc5YmQ3MzUzMDlhMzk0ZDgzMDY) or found me on [Twitter](https://twitter.com/daviddalbusco).

And of course, the more important, if you have to create a presentation soon, go give a try to [DeckDeckGo](https://deckdeckgo.com)!

To infinity and beyond,

David
