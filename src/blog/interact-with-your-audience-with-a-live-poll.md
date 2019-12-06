---
path: "/blog/interact-with-your-audience-with-a-live-poll"
date: "2019-12-05"
title: "Interact With Your Audience With A Live Poll"
description: "We are introducing a new feature to let your interact with your audience without leaving your presentation"
tags: "#webdev #javascript #opensource #speaking"
image: "https://cdn-images-1.medium.com/max/1600/1*VST3XVmoX1R3hAXJ8OGw4A.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*ULPgfU4_6DDEHDLDCdUMKQ.jpeg)

*Photo by [Nicholas Green](https://unsplash.com/@nickxshotz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

We had this idea for a long time and it took us a bit of time to realize it, that’s why we are so excited to introduce today the new feature of [DeckDeckGo](https://deckdeckgo.com/), our web open-source editor for presentations, to make possible the interaction with your audience through live polling without having to leave your slides 🔥

<iframe width="280" height="158" src="https://www.youtube.com/embed/GuF58XBzTj0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe
<br/>

### User Experience

UX could often be discussed and I have to say that, for that feature in particular, many solutions are feasible. I scratched my head for days, filling papers and taking notes until I finally figured out the core principles of the solution which were meaningful to me and hopefully to others too:

* An audience could be a crowd, a small or large. In case of live polling, not all participants are on the same page. Some might be fast to vote, some might be slow. Some people are near the projected slides or screen, others are probably far away. Some might even be asleep, some might have their phones in their bags, etc.

* As a speaker I notably find convenient when I don’t have to switch between multiple applications, it could even to some extension makes me a bit less stressed. As an attendee, I tend to think that it needs me less effort to follow a presentation without to many media cut-offs. Summarized, I like when the presentation’s flow remains as smooth as possible.

That’s why, at least in this first version of the features, all information are available at the same time and any time. Question, answers, connection information and even results of the vote, which are updated in real time, are all displayed on the same slide. Moreover, as I do think that QR codes are the best way to share links with the participants, the template also contains such a deep link to point them directly to the answers on their phones.

![](https://cdn-images-1.medium.com/max/1600/1*6DlXoX4G2WZer9xVYymqug.gif)

### Developer Mindset

Since day one we always kept a developer mindset. That’s why both the editor and our developer starter kit are using the exact same core, the same web components as engine. Needless to say that it didn’t changed. This new feature isn’t just available in our editor but also available with our starter kit. If you rather like to develop your presentation using HTML or Markdown, it’s all cool and you have access to the exact same feature.

```html
<deckgo-deck>
  <deckgo-slide-poll>
    <h1 slot="question">Do you like my presentation?</h2>
    <p slot="answer-1">Sure cool</p>
    <p slot="answer-2">No</p>
    <p slot="answer-3">Potatoes</p>
    <p slot="how-to">Go to <a href="https://deckdeckgo.com/poll">deckdeckgo.com/poll</a> and use the code {0}</p>
    <p slot="awaiting-votes">Awaiting first votes</p>
  </deckgo-slide-poll>
</deckgo-deck>
```

### An Unlimited Amount Of Possibilities

Of course, the above goals have an impact on our technical decisions but we have designed our architecture to be relatively flexible and to be able to handle such scenarios. And that’s probably even the technical beauty of  DeckDeckGo. It is template based with the goal to make them self-contained. 

Each template is an independent Web Component developed with [StencilJS](https://stenciljs.com), therefore each of them are basically the Web. And what could you do with the Web? Anything 🤯

You want to create a template for live polling with DeckDeckGo? That’s possible.

You want to create a template which integrates a space invaders game? That’s possible too.

You want to create a series of reusable templates with shiny designer effects? Of course you could.

Or you even want to create a template to load some Web Assembly code to run directly in your presentation the new prototype of your blockchain AI powered startup for slow food? That’s possible too.

It is just an unlimited amount of possibilities and it is only the beginning!

### Get Started Now

Get started now to create your next presentation: [https://deckdeckgo.com](https://deckdeckgo.com/).

To infinity and beyond 🚀

David
