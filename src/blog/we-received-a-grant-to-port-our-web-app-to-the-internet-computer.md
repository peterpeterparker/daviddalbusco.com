---
path: "/blog/we-received-a-grant-to-port-our-web-app-to-the-internet-computer"
date: "2021-07-06"
title: "We Received A Grant To Port Our Web App To The Internet Computer"
description: "Can our web editor for slides work on the futuristic internet of the DFINITY foundation? Let's figure it out."
tags: "#webdev #showdev #opensource #motivation"
image: "https://cdn-images-1.medium.com/max/1600/1*xFkV_aTp7qE6kKOt1NxCbA.jpeg"
canonical: "https://daviddalbusco.medium.com/the-state-of-progressive-web-apps-adoption-by-developers-in-2021-32a2ec405f41"
---

![](https://cdn-images-1.medium.com/max/1600/1*uMo-wgL0-asMeYajl6CSfQ.png)

*Source: DFINITY press kit + DeckDeckGo logo*

*****

Exciting news, we received a grant from the [DFINITY](https://dfinity.org/) foundation to try to port our web editor for slides, [DeckDeckGo](https://deckdeckgo.com), to the [Internet Computer](https://dfinity.org/faq/what-is-the-internet-computer).

In the coming weeks we will build a proof of concept to validate the feasibility of the project. Here are some insights about the scope, goal and milestones of this inspiring project.

*****

### DeckDeckGo

DeckDeckGo is a web [open source](https://github.com/deckgo/deckdeckgo/) editor for slides. Unlike other tools, presentations can be published and viewed online or shared as Progressive Web Apps (PWA). The editor works on all devices (laptop, mobile, etc.), decks can be remotely controlled and interactions with the audience through live polls are also supported.

DeckDeckGo is a side project that my friend [Nicolas](https://www.nmattia.com) and [I](https://daviddalbusco.com/) - together with our community (2000+ registered users) and help of our contributors - have been working on for the last 2.5 years. Here are our values: open source, transparency and knowledge sharing.

*****

### DFINITY

The DFINITY Foundation is a not-for-profit scientific research organization based in Zurich, Switzerland, that oversees research centers around the globe. The Foundation’s mission is to build, promote, and maintain the Internet Computer. Its team is committed to building advanced experimental technologies to improve the public internet ([source](https://dfinity.org/faq)).

*****

### Internet Computer

The Internet Computer extends the functionality of the public Internet so that it can host backend software, transforming it into a global compute platform.

It seeks to address serious long-standing problems that bedevil IT, including system security, and to provide a means to reverse and undo the ever increasing monopolization of internet services, user relationships and data, and restore the Internet to its permissionless, innovative and creative roots.

The Internet Computer is formed by an advanced decentralized protocol called ICP (Internet Computer Protocol) that independent data centers around the world run to combine the power of individual computers into an unstoppable seamless universe where internet native software is hosted and run with the same security guarantees as smart contracts ([source](https://dfinity.org/faq)).

*****

#### In Other Words

The description above is the official one but, let me try to synthesize my understanding:

The Internet Computer is a decentralized blockchain like network on which you can run both smart contracts and web application. To my mum I would even say it is like bitcoin and cloud providers had a baby. In that way, you get best of both worlds and therefore open a new whole area of possibilities, what they call the singularity. In addition, they aim to try to challenge the monopolistic position of the [GAFAM](https://en.wikipedia.org/wiki/Big_Tech).

*****

### Goal

At this stage, our one and only goal is to test the feasibility of the concept: can our platform run and interact** with the Internet Computer? Even if we are really optimistic and everything we read and tried so far seem to validate the hypothesis, the ICP and its infrastructure is still young, it has “only” been officially launched a few weeks ago, on May 7th.

By run* I mean can we host our Progressive Web Apps, our editor, on the Internet Computer and by interact** I mean can it persists and read data, the decks and slides of the users.

*****

### Milestones

To fulfill the proof of concept, and to get our grant 😜, we have defined the following three milestones which must be completed to be able to decide if yes, or no, DeckDeckGo can be migrated to the Internet Computer.

*****

#### 1 — Offline First & Hosting

Intrinsically and because it is still young too, we won’t be able to perform as much HTTP queries as we currently do, because they might be, at least for the time being, a bit slower than our current solution with Firestore. That’s why, we will have to approach the persistence of the data differently.

After some brainstorming, we decided that the most sustainable solution would be to transition from an online first to an offline first strategy. We are going to convert our editor to work primarily with IndexedDB and, to optionally replicate these data to the cloud, ultimately to the Internet Computer.

This also will have the advantage to let anyone use our editor in standalone mode, for example with a Docker container, and will also make more sense for those getting our application through the [Google Play](https://play.google.com/store/apps/details?id=com.deckdeckgo.twa&hl=fr&gl=US) or [Microsoft](https://www.microsoft.com/en-us/p/deckdeckgo/9pfr8n0r5gpp?activetab=pivot:overviewtab) stores.

Finally, in the same challenging milestone, we also aim to deploy our Progressive Web Apps as a static asset on the Internet Computer.

*****

#### Milestone 2 — Authentication

The Internet Computer introduces a new secure method of cryptographic authentication that eliminates the ability for service providers to steal data, or track movements ([source](https://dfinity.org/technicals/web-authentication-identity)).

In short: no more passwords at all 🤯!

That is something we are eager to try, just for curiosity reason and because it does sound super cool.

Of course, from a project perspective, we do need an authentication workflow to persist the users’ data on the network. That’s the cherry on top of the fun 😉.

*****

#### 3 — Data Persistence

Unlike the common web solution to query data through HTTP, there is no such function as `fetch` on the Internet Computer.

The Internet Computer is primarily a distributed and decentralized platform for running software. Therefore, to persist data and run programs on it, the applications have to be deployed as WebAssembly modules. These are executed inside of a conceptual computational unit called a software canister.

Once deployed, end-users can interact with the software canister by accessing the entry point functions you have defined for that canister through a front-end client such as a browser ([source](https://sdk.dfinity.org/docs/developers-guide/concepts/canisters-code.html)).

Summarized: We will have to write some WebAssembly functions to get and set our data in the Internet Computer. From our editor developed with [StencilJS](https://stenciljs.com/), we will then interact with these through async callbacks.

*****

### Keep In Touch

To follow our adventure, you can star  and watch our [GitHub repo](https://github.com/deckgo/deckdeckgo) ⭐️, join our [newsletter](https://deckdeckgo.com/en/newsletter) or [Slack](https://join.slack.com/t/deckdeckgo/shared_invite/enQtNzM0NjMwOTc3NTI0LTBlNmFhODNhYmRkMWUxZmU4ZTQ2MDJiNjlmYWZiODNjMDU5OGRjYThlZmZjMTc5YmQ3MzUzMDlhMzk0ZDgzMDY) channel. We will share some updates following our progress and, as we often do, some of our learning.

*****

### Conclusion

I play it cool but, I am fully aware it is quite a tremendous opportunity and challenging project. Time to hack!

To dfinity and beyond.

David
