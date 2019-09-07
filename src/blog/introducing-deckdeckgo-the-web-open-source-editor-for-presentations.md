---
path: "/blog/introducing-deckdeckgo-the-web-open-source-editor-for-presentations"
date: "2019-09-XX"
title: "Introducing DeckDeckGo: the web open source editor for presentations"
description: "Introducing DeckDeckGo: the web open source editor for presentations"
tags: "#webdev #showdev #opensource #motivation"
image: "https://cdn-images-1.medium.com/max/1600/1*qSYqGVlUNNhJgsYDxenv9A.jpeg"
---

![](https://cdn-images-1.medium.com/max/2400/1*TmZb15Yzu3mGVG7uMkHvHw.png)

We are very happy and excited to share with you today our web open source editor for presentations: [DeckDeckGo](https://beta.deckdeckgo.com)

I still almost not believe that we managed to reach such a milestone. It took us a couple of months this year to develop it just for fun at nights and on weekends,  but yes, we did it  🎉

Before going further we would like first to thank all our off- and online friends, communities, contributors and early testers which always gave us plenty of motivation to develop our, as I like to call it, “pet” project. You are truly awesome ❤️

### But why yet again another editor for presentations?

![](https://cdn-images-1.medium.com/max/1600/1*Ireg4JWSR6Se4c_UP8iJ6w.gif)

*Sure why? Seriously why?*

We are fully aware that no one, absolutely no one, asked for yet again another editor for presentations and that even probably there is no such need. But you know what? We are fine with that. Of course we would love and hope that our editor and concept will be useful to some persons, but even if we might cry a bit if no one will use it, we are (kind of) ok with that. 

We develop our project because we are, well, nerds and because we use this experience to improve our skills. Furthermore, we are engineers you know, we like to implement products from scratch until launch 😉

### So what makes it different?

![](https://cdn-images-1.medium.com/max/1600/1*MNW_kIkOJqNvRGBRFNIbfg.gif)

*Everything.*

Of course I’m joking, not everything is different, it’s even became a private joke between us. As soon as something is a bit new we say to each other “Mais mec, c’est le future” 😹

That being said and as I briefly introduced it above, we had some, I hope you will find too, interesting ideas. 

#### Cloud solution

![](https://cdn-images-1.medium.com/max/1600/1*9odqQrlsXeP0zykRe3lyaQ.gif)

*My mum better understood “a cloud solution” than “we developed it with the web”*

DeckDeckGo is a cloud solution. It works everywhere on any devices, **projectors**, **desktops**, **mobiles** or **tablets** without any prior installation and without data save locally 🎥🖥️💻📱☁️

There is by the way even no “Save” button in our editor, it does the job for you and save your data when these have to be saved 😁

#### Use an app to share apps

![](https://cdn-images-1.medium.com/max/1600/1*4sMOauhgBsqV4wZzJ3fZqA.gif)

*Use an app to share other apps*

No export to PDF (at least not yet), therefore you may ask your self: How my gosh David, how I’m going to share my presentation then?

Well, here’s a cool thing: DeckDeckGo package and publish every single presentation you would like to **share as a standalone application.** Most precisely as Progressive Web Apps. Basically you are not going to send a PDF to your friends a colleagues but you are going to send them a link to your app respectively to your presentation which is compatible with any device’s screen size and SEO friendly 🚀

#### Online feed

![](https://cdn-images-1.medium.com/max/1600/1*QyNE4kixGi60FyZ8Y0we2Q.gif)

*Discover and share presentations*

DeckDeckGo isn’t “just” an editor. It was actually developed to be also an **online feed**. A place where presentations can be discovered, shared and ultimately, if we let our selves dream a bit about the future, are indexed according your interests and maybe even can be discussed.

### Features

Moreover, more than being able to develop slides with our editor, we also thought that adding some handy features would make the user experience a bit more enjoyable.

#### Full screen edition

Are you constantly switching between full screen and normal mode while editing your deck for your next presentation? Or did it you had more than one to correct a typo a couple of seconds before your talk? With our editor, your presentation is editable even in full screen mode.

![](https://cdn-images-1.medium.com/max/1600/1*QM9ylLr7Tzj8ZYE-ZJUXoA.gif)

*More than edition, per design all features are available in full screen mode too*

#### Unsplash

We have integrated [Unsplash](https://unsplash.com/) to our tool to let your find and use stock photos easily. The editor keeps also track of the last 10 media you would have used for even a quicker access.

![](https://cdn-images-1.medium.com/max/1600/1*_rEqbFfwTocrElky3mLJQA.gif)
*Unsplash is integrated*

#### Tenor

Gifs are life (probably). Same as the stock photo, [Tenor](https://tenor.com/) is integrated, to let you find and integrate Gifs easily. There is even a special template which takes care of fitting the animated content to the all screen.

![](https://cdn-images-1.medium.com/max/1600/1*bsyb3eakx7dcvI2CftHEzw.gif)

*Gifs are life*

#### Youtube

I was a bit more lazy on the integration of [Youtube](https://www.youtube.com) videos, we didn’t interconnected any API, but still, it’s pretty damn easy to add any videos from that source to your deck. Cherry on top, you could start and pause the videos remotely with our app too.

![](https://cdn-images-1.medium.com/max/1600/1*lyVzJnkv2MzOKCCRaSfkMg.gif)

*Drop Youtube videos in your presentation*

#### Remote control

Out of the box, without any special hardware, any presentations could be remote controlled with our “remote control” application. It handles currently actions like swiping slides, displaying notes, drawing on the presentation and even offers a countdown feature. We are also taking advantages of QR codes in order to establish easily the connection between the controller and the decks.

<iframe width="280" height="158" src="https://www.youtube.com/embed/3o3oGBTTRSs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe
<br/>

*Hey, it’s me, David 👋*

### Technical fun facts

I won’t deep to dive too much in the technical facts, as I hope that we will find time in the future to share articles about them, but to summarize, our application is developed with [StencilJS](http://stenciljs.com) Web Components. On the other side, our publication engine is developed with [Haskell](https://www.haskell.org), [Nix](https://nixos.org/nix/) and [Terraform](https://www.terraform.io) 🚀

We are using [Google Firebase](https://firebase.google.com/) for the authentication and to store the data (data you are editing and as storage) and are using [Amazon AWS](https://aws.amazon.com/) to deploy online the publications you would share.

### Open source

DeckDeckGo is open source, it’s in our DNA, sharing is caring. All our libraries are published under MIT license and our applications and infrastructure are published under AGPLv3 and above license.

Of course we are always looking for new contributors. We would love to hear from you, don’t hesitate to join us on our [slack channel](https://join.slack.com/t/deckdeckgo/shared_invite/enQtNzM0NjMwOTc3NTI0LTBlNmFhODNhYmRkMWUxZmU4ZTQ2MDJiNjlmYWZiODNjMDU5OGRjYThlZmZjMTc5YmQ3MzUzMDlhMzk0ZDgzMDY) or on [Github](https://github.com/deckgo/deckdeckgo) 🙏

### Developer mindset

Something I particularly like in our project is that both the editor and our developer starter kit are using the exact same Web Components as engine 🤪 Any improvements in these libraries and applications are then automatically echoed to anyone regardless if you are using the graphical editor or are coding your own presentation using HTML or markdown, it’s kind of the cherry on the cake 🍒🎂

### Get started now 🔥

A picture speaks a thousand words, get started now to create your next presentation: [https://deckdeckgo.com](https://deckdeckgo.com)

To infinity and beyond 🚀

David

P.S.: Background photo of the cover by [wisconsinpictures](https://unsplash.com/@wisconsinpictures?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
