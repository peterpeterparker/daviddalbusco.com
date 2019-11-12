---
path: "/blog/introducing-the-new-remote-control-for-your-presentations"
date: "2019-11-12"
title: "Introducing the new remote control for your presentations"
description: "Introducing the new remote control for your presentations developed with the web open source editor DeckDeckGo"
tags: "#webdev #showdev #opensource #motivation"
image: "https://cdn-images-1.medium.com/max/1600/1*pk4BfD4Sqt6gHIX4lpYO8g.png"
---

![](https://cdn-images-1.medium.com/max/1600/1*pk4BfD4Sqt6gHIX4lpYO8g.png)

> Change is the essential process of all existence - Spock

A little more than a month ago, we [launched](https://daviddalbusco.com/blog/introducing-deckdeckgo-the-web-open-source-editor-for-presentations) our web open source editor for presentations: [DeckDeckGo](https://deckdeckgo.com)

It went way above our expectations, quickly three thousand people had tried out our editor and we received a lot of positive feedback. It was really an unexpected start and just an heartwarming experience. Thank you all, for everything 🙏

Following this release we spent the month of October improving our platform, thanks to our community and many Pull Requests. It was definitely a really nice [Hacktoberfest 2019](http://hacktoberfest.digitalocean.com) season for us.

Finally came the time to ask ourselves: **And now, what’s next?**

We quickly identified two new cool ideas, which would be fun to implement, unique and useful for our users. But you know what? These aren’t the ones we are publishing today 🤣 We thought that before chasing these, we should first resolve one of the most users’ requested feature (“speaker notes”) and improve a long time known weakness, at least in my eyes, the UX of our controller.

That’s why we are happy to launch today our brand new [remote control](https://deckdeckgo.app)  🎉

<iframe width="280" height="158" src="https://www.youtube.com/embed/PnSNT5WpauE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*A demo of our brand new remote control*

### So, what’s new?

Enough teasing, here are the major new features of our remote controller.

### Speaker notes with Markdown support

Through our [Slack](https://join.slack.com/t/deckdeckgo/shared_invite/enQtNzM0NjMwOTc3NTI0LTBlNmFhODNhYmRkMWUxZmU4ZTQ2MDJiNjlmYWZiODNjMDU5OGRjYThlZmZjMTc5YmQ3MzUzMDlhMzk0ZDgzMDY) channel, [GitHub](https://github.com/deckgo/deckdeckgo/projects/4) or messages, being able to add “**speaker notes** for the slides in the web editor” was often the most requested feature. Fortunately, it was already implemented in our core and even available in the developer kit, therefore, the biggest challenge was “only” its integration in terms of UX. Moreover, when implementing the feature, we thought that it would be handy if **Markdown** would be supported too 😃

![](https://cdn-images-1.medium.com/max/1600/1*uKHylyasNOXQu3W3Uc7uhw.png)

*Edit your speaker notes with Markdown in our web open source editor*

### Synchronized content

Ever since I implemented the very first version of our remote control, we always thought that it would be just really cool to synchronize the content between presentation and controller. Guess what, we did it 😉

It’s worth to notice that the presentation don’t have to be published on internet in order to be synchronized. As for the connection and commands, it is performed through WebRTC and therefore work even if you run your presentation locally 😁

*Note: this new solution is a **breaking change**. It is automatically rolled out in our web editor but if you have already published a deck, you just would have to publish it again in order to upgrade it.*

![](https://cdn-images-1.medium.com/max/1600/1*NfYAdoMvNHAuaMOf809-iA.png)

*Synchronized content*

### New user experience

Although all functions (swiping the slides, drawing over the presentations, playing a video, displaying the notes, etc.) were implemented in the remote control, I never felt fully convinced by its UX. I was kind of ok with but had for months somewhere in my mind the idea that I needed to improve its behavior. The actions to trigger the swipe of the slides and to play video were too small, specially to be used during a talk, IRL. That’s why these were the main concern of the redesign and are now filling half of the screen size of the remote control 😊

Moreover, the speaker notes weren’t really cleverly displayed. That’s why we moved them to a new sheet component which could be opened with a “swipe up” gesture.

![](https://cdn-images-1.medium.com/max/1600/1*pQx-i5jfIdweWYTIu_9KzQ.gif)

*New user experience*

### Responsive design for tablets

Earlier October I attended the [DINAcon](https://dinacon.ch) 2019 conference in Bern. The speakers were presenting their subjects on a shiny stage, behind a stylish thin desk which aimed, I guess, to be discrete but on the other hand, they were still using a laptop to have a look at their talk and notes 🤔

![](https://cdn-images-1.medium.com/max/1600/1*iXSRsFNZUOItDFyevXYsqQ.png)

*[Katariina Kari](https://twitter.com/katsi111) speaking about “Knowledge Graph” and having a quick look at her laptop at DINACon 2019 (source [Flickr](https://www.flickr.com/photos/140845441@N04/48947571397/in/album-72157711466719708))*

Suddenly it hit me: why not having a discrete **dashboard** displayed on a **tablet** instead of a laptop? I started to think about it and imagined that delivering a talk could be like being on the USS Enterprise bridge with all its commands to make it fly 🤣

*If you read these lines I’m guessing that now you know why the cover photo is a bit inspired by Star Trek.*

Moreover of the user experience, this new version of our remote control introduces a new responsive design which aims to implement this vision and aims to deliver all the information and commands needed to perform your talk with tablet devices or any browsers in landscape mode as support.

![](https://cdn-images-1.medium.com/max/1600/1*Nhax5Zz-ReP2Qq0E3mOjqQ.gif)

*Inspired from the USS Enterprise bridge*

### Hello darkness my old friend

Last goodies, as we already did with our [documentation](https://docs.deckdeckgo.com) for developers, we also rolled out a light and dark theme switcher 🌓

![](https://cdn-images-1.medium.com/max/1600/1*k_xss5uP7Jeb5zAK7hAwmQ.gif)

*Switch between light and dark theme*

### Get Started Now

A picture speaks a thousand words — give it a try 😉

1. Open the [remote control](https://deckdeckgo.app) on your phone or table
2. Start a [presentation](https://beta.deckdeckgo.io/daviddalbusco/introducing-the-new-deckdeckgo-remotecontrol/) on another device
3. Have fun 🎉

To infinity and beyond 🚀

David

P.S.: Background photo of the cover by [Cerqueira](https://unsplash.com/@shotbycerqueira?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
