---
path: "/blog/outcome-of-our-first-call-for-contributors"
date: "2019-08-01"
title: "Outcome of our first call for contributors"
description: "Outcome of our first call for contributors"
tags: "#motivation #webdev #contributorswanted #opensource"
image: "https://cdn-images-1.medium.com/max/1600/1*tQGx3mWFA0Oq3rGLA4Ypgg.gif"
---

![](https://cdn-images-1.medium.com/max/1600/1*tQGx3mWFA0Oq3rGLA4Ypgg.gif)

_Wow — Owen Wilson_

Last week we published our [first call](https://daviddalbusco.com/blog/contribute-to-our-open-source-project) for contributors for our open source project [DeckDeckGo](https://deckdeckgo.com) and the outcomes are just mesmerizing 🤩 Therefore, before going further, we would like first to thanks each and every persons who read the article, interacted with or volunteered to resolve issues and even sent us Pull Requests. You are truly awesome and your reactions cheered up all up, **THANK YOU** ❤️❤️❤️

### Pull requests

Following our blog post, many persons contacted us to take over the issues we listed and even found other issues to solve in our repo 😜 Some of these are still in progress but two notable features have now been developed, that’s why we thought that it would be cool to display their outcomes and to give credits to their authors.

### Before we start

Something I personally really like in our project is its modularity. All our web components could be use as standalone components in any applications (“with or without any modern frameworks”), or could be use in our starter kit if you are developing your presentation using HTML or Markdown (`npm init deckdeckgo` ) and are also used in our upcoming web editor for presentations.

It’s kind of cool to think, that if you are improving or fixing a component, this improvement could be use in so many constructs.

### Optional line numbers for code highlighting

The goal of this feature was to add an option to our code highlighter component, which use [Prism.js](https://prismjs.com) under the hood, in order to be able to automatically display line numbers at the begin of each lines.

This feature was developed by Stefan Nieuwenhuis ([Twitter](https://twitter.com/stefannhs) / [GitHub](https://github.com/StefanNieuwenhuis)) and was submitted in the PR [#213](https://github.com/deckgo/deckdeckgo/pull/213). Not all heroes wear capes, you are awesome Stefan 👍

![](https://cdn-images-1.medium.com/max/1600/1*nuVLuov6bXRr6SpREDzzxA.gif)

_Automatically display line numbers at the begin of the code you want to showcase_

### Youtube short Url

We faced an issue with our component and “Youtube” template (which allow users and developers to easily integrate Youtube video in their presentations) when short url were used to embed video, as urls have to respect a specific format.

This fix was developed by Rohit Bokade ([GitHub](https://github.com/bokaderohit98)) and was submitted in PR [#207](https://github.com/deckgo/deckdeckgo/pull/207). The force is strong with you Rohit, thanks a lot 👍

![](https://cdn-images-1.medium.com/max/1600/1*GpJzea6l2X946tufjgb5kw.gif)

_Integrate easily a YouTube video to your presentation_

### Cherry on the cake 🍒🎂

We still have [issues](https://github.com/deckgo/deckdeckgo/issues) to solve 🤣 Most of them flagged as “good first issue” are in progress and the others might not be that straight forward, but who knows, you might find one you are interested in and more important, we are really open to any idea or suggestions. Therefore don’t hesitate to submit your feature requests, that would be super cool.

To infinity and beyond 🚀

David
