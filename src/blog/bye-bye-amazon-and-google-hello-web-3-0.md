---
path: "/blog/bye-bye-amazon-and-google-hello-web-3-0"
date: "2021-10-12"
title: "Bye-Bye Amazon & Google, Hello Web 3.0"
description: "We are migrating our web application to the DFINITY's Internet Computer."
tags: "#webdev #serverless #blockchain #motivation"
image: "https://cdn-images-1.medium.com/max/1600/1*YNwx6BRv02H0wpV7xsKhtg.png"
canonical: "https://daviddalbusco.medium.com/dynamically-import-esm-modules-from-a-cdn-5a6f741e2a1c"
---

![](https://cdn-images-1.medium.com/max/1600/1*YNwx6BRv02H0wpV7xsKhtg.png)

It’s decided, we are porting our web editor for slides, [DeckDeckGo](https://deckdeckgo.com/), to [DFINITY](https://dfinity.org/)’s Internet Computer!

Thanks to the help of a second 25k USD grant from the DFINITY foundation, we will wrap up the work needed for running a beta version of DeckDeckGo on the Internet Computer ([sign up](http://eepurl.com/hKeMLD) to help us test it!).

*****

### Why?

Of course getting grants helps get motivated to use a new technology but, the reasons why we believe such a move is the right one have other motivations.

*****

#### Decentralization

Even though at first glance **decentralization** might not seem to bring much to a presentation editor (who needs decentralized slides?), we think the extra level of **security** it adds is an incredible opportunity.

We foresee an architecture in which each user gets one (or multiple) database-like smart contracts for their data. Users will get a clear ownership on their data and there won’t be one single node containing all the content.

Moreover, thanks to the [Internet Identity](https://sdk.dfinity.org/docs/ic-identity-guide/what-is-ic-identity.html) that enables a secure anonymous authentication, the **privacy** will also be improved.

Finally, the nature of the system makes it also unstoppable and less prone to failure.

Think about it, as I am writing these lines Wednesday Oct. 6, it was just reported that Twitch reportedly suffered a massive data leak. It was reported that more than 100GB of data (including revenue, activities and even passwords) is available online.

In addition, two days ago, Monday Oct. 5, Facebook suffered a massive blackout of seven hours during which none of their services were reachable. It was even reported that some employees could not access their building because their door were connected to the same networks.

Decentralization might not be the silver bullet but, these two recent incidents of major platforms showed me once again that the current model has its limits and comforts me in our decision.

*****

#### Governance

As a decentralized blockchain, all changes to the configuration and behavior of the Internet Computer are controlled by a governance body called the Network Nervous System (NNS — [source](https://sdk.dfinity.org/docs/developers-guide/concepts/governance.html)).

According to certain criteria (see “neurons” in the linked source), it is possible to get voting rights to define the future of the network.

In other words, it is possible to become an actor and to get involved in the development of the network.

*****

#### Open Source

We share our learnings through blog posts and our project’s **open source** code is published on [GitHub](https://github.com/deckgo/deckdeckgo/).

Using a technology and providers that share, and apply itself, the same values goes without saying.

*****

#### GAFAM

I originally intended to hit quite hard on the big tech in this chapter because I am convinced there is something viscerally rotten in their monopolistic influences on our life but, I think I will just summarize everything with one simple question: do you really want to pay for services that send Jeff Bezos to space?

*****

### When?

We have no exact goal on the productive launch date. To the contrary, without putting ourselves too much pressure, we do have for objective to reach a Beta milestone till end  of year or begin of next one. At that time, we hope to count on you to help us test the platform before its effective release.

Meanwhile, we are also planning to unleash in production a transitional version of our editor that has been transformed to an “offline first” approach.

Because we are planing no migration of the data, it will allow users to save their content to static files. The new version of the editor can open and save presentations to files as you would do with any desktop applications.

*****

### How?

To fulfill the proof of concept, we already completed three milestones: “Offline first and Hosting”, “Authentication” and “Data Persistence”.

In order to achieve our short-term goal, and to get our second grant 😜, we have defined the following two new milestones:

*****

#### Milestone 4 — Assets

The Internet Computer is primarily a distributed and decentralized platform for running software. To persist data and run programs on it, the applications have to be deployed as WebAssembly modules. These are executed inside of a conceptual computational unit called a software canister ([source](https://sdk.dfinity.org/docs/developers-guide/concepts/canisters-code.html)).

To create slides, users must be able to upload their assets (images and csv files). That data is currently persisted in CDN Storage.

This milestone is the re-implementation of a similar system on the Internet Computer using one or multiple canisters. As for the data, we aim to empower the ownership and privacy of the users’ content with a decentralized architecture.

*****

#### Milestone 5 — Functions

Various features that interact with the Internet Computer through async canisters calls are time consuming (e.g. delete all canisters upon user deletion). Tasks like this should be run in the background by dedicated canisters.

In other words: our overall goal is to transform our editor in a way that user should not even notice that it is powered by a blockchain network, its usage should feel like using any other slick modern web application.

*****

### Future?

From day one and until today, DeckDeckGo has always been a side project. Even though we do display an [Enterprise](https://deckdeckgo.com/en/enterprise) offering on our website, we never actively did any sales activities nor found the perfect partners (or time) to start such a collaboration.

However, as we are about to transition to a new network model that require [cycles](https://sdk.dfinity.org/docs/developers-guide/concepts/tokens-cycles.html), which are used to pay for resource consumption, and have for goal to release kind of a unique tool, we do know have monetization in mind with nothing less than tokenization.

*****

### Further Reading?

“Sharing is caring”, here is the list of blog posts I published since we started the project with the Internet Computer:

* [We Received A Grant To Port Our Web App To The Internet Computer](https://daviddalbusco.com/blog/we-received-a-grant-to-port-our-web-app-to-the-internet-computer)
* [Hosting on the Internet Computer](https://daviddalbusco.com/blog/getting-started-with-the-internet-computer-web-hosting)
* [Singleton & Factory Patterns With TypeScript](https://daviddalbusco.com/blog/singleton-and-factory-patterns-with-typescript)
* [Internet Computer: Web App Decentralized Database Architecture](https://daviddalbusco.com/blog/internet-computer-web-app-decentralized-database-architecture)
* [Dynamically Import ESM Modules From A CDN](https://daviddalbusco.com/blog/dynamically-import-esm-modules-from-a-cdn)

*****

### Keep In Touch

To follow our adventure, you can star and watch our [GitHub repo](https://github.com/deckgo/deckdeckgo) ⭐️ and [sign up](http://eepurl.com/hKeMLD) to join the list of beta tester.

*****

### Conclusion

A journey of a thousand miles begins with a single step and this blog post was mine.

To DFINITY and beyond.

David
