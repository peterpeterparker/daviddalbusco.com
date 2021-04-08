---
path: "/blog/turn-your-figma-designs-into-animated-slides"
date: "2021-04-08"
title: "Turn Your Figma Designs Into Animated Slides"
description: "Export your Figma frames to presentations with DeckDeckGo."
tags: "#showdev #webdev #figma #javascript"
image: "https://cdn-images-1.medium.com/max/1600/1*_b7FQUkfmVU7O9IAVt90zw.png"
canonical: "https://daviddalbusco.medium.com/turn-your-figma-designs-into-animated-slides-7eea5c47c49"
---

I am thrilled to unveil a new way to turn your Figma designs into animated slide decks thanks to the open source plugin I recently published: [Figma to DeckDeckGo](https://www.figma.com/community/plugin/950777256486678678/Figma-to-DeckDeckGo) 🥳.

<iframe width="280" height="158" src="https://www.youtube.com/embed/arabVqr-1Do" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/>

*****

### But... Why?

You may ask yourself why would you export your content from [Figma](https://www.figma.com/) to [DeckDeckGo](https://deckdeckgo.com)? After-all it is possible to present a design without a 3rd party platform. I get that but, before making up your mind, let me list some advantages I do see in such a solution.

![](https://cdn-images-1.medium.com/max/1600/1*-rC78uti7YtY_5rnCh7D7g.gif)

*****

#### Animate, edit and share

By importing your slides in DeckDeckGo you get a comprehensive way to chain and reorder your slides. Even though we do not offer yet a zillion of different options, transitions between these are going to be animated.

You can also decide if you want or not extract the text components of your frames. If you do so, these are going to remain editable, which is for example handy in case you have a last minute typo to correct or, if you would use a presentation again months after its creation and would have to modify an information which would not be up-to-date anymore.

Instead of sharing a PDF, you are going to transform your presentation to a standalone Progressive Web Apps, which can be share with your attendees easily. Beside the fact that doing so your deck remains dynamic, I do see also value here as you do not have to share a file of X megabytes but, only share a link to your optimized content.

*****

#### Reuse your design

The plugin splits the text of the design. The graphic components are exported in a single layer, in `webp` images. Again here, you can probably notice my obsession for performances. WebP images are smaller than their JPEG and PNG counterparts — usually on the magnitude of a 25–35% reduction in filesize (source [web.dev](https://web.dev/serve-images-webp/)).

These images, once imported in DeckDeckGo, are added to your collection of assets. This means that they can be (re)used across all your slides. You can then create and style slides with your existing images as background.

![](https://cdn-images-1.medium.com/max/1600/1*OFXb-3GA8T3ZqqDZQcwIcQ.gif)

*****

#### Add slides and live polls

Decks you are importing from Figma are not written in stones, you are able to add slides to these using the variety of templates available in DeckDeckGo.

You can even engage your audience or class in real time by adding built-in live polls to your presentations. Your attendees will be able to contribute with their smartphones and, the results will be shown live.

<iframe width="280" height="158" src="https://www.youtube.com/embed/nx4N07_6-x4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/>

*****

#### Remote control

Finally, out of the box, there is a remote application, also open source, to control your presentations. Of course, it works out with the content you import from Figma too and, it does offer the exact same features (draw over your slides, display your notes, countdown, etc.).

<iframe width="280" height="158" src="https://www.youtube.com/embed/tcO94-txZ2E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/>

*****

### Open Source

I would lie if I could say that the plugin is currently rock solid. I tested it successfully with different decks but, I expect that some improvements are going to be needed regarding the extraction of the texts.

The good thing is that you are not going to be blocked in case this process would be sluggish. You can always export your frames as images only and, still enjoy almost all other features.

For the rest, I count on you to help us shape and improve the plugin. Like any other parts of our platforms, it is open source! Ping me with your issues and best ideas in its related [GitHub repo](https://github.com/deckgo/figma-deckdeckgo-plugin).

*****

### Code

From a technical point of view, the plugin is developed with JavaScript, nothing fancy new here. Even though, it might be interesting because it is bundled with [esbuild](https://esbuild.github.io/) (which is not something documented by Figma) and contains some vanilla Web Components I created for its design (button, checkbox etc.). If those particular subjects are interesting to you, let me know, I would be happy to blog about it.

*****

### Summary

![](https://cdn-images-1.medium.com/max/1600/1*QW4oGxrM0iLJjjPXoxJvAQ.gif)

This plugin is my first ever Figma plugin and needless to say, it was super fun to develop. I am very happy to launch this new feature for our eco-system, [give it a try](https://www.figma.com/community/plugin/950777256486678678/Figma-to-DeckDeckGo) 🤗.

To infinity and beyond!

David
