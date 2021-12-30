---
path: "/blog/getting-started-with-the-internet-computer-web-hosting"
date: "2021-07-19"
title: "Getting Started With The Internet Computer Web-Hosting"
description: "An introduction to deploy web applications on the decentralized blockchain network of the DFINITY foundation."
tags: "#webdev #serverless #hosting #programming"
image: "https://cdn-images-1.medium.com/max/1600/1*VhdLdSsOyW8gtDkZoyE70g.jpeg"
canonical: "https://daviddalbusco.medium.com/getting-started-with-the-internet-computer-web-hosting-b9b748350fc2"
---

![](https://cdn-images-1.medium.com/max/1600/1*VhdLdSsOyW8gtDkZoyE70g.jpeg)

*Photo by [Bradley Dunn](https://unsplash.com/@bradleycdunn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

We are building a proof of concept to port our web app, [DeckDeckGo](https://deckdeckgo.com), to the Internet Computer of the [DFINITY](https://dfinity.org/) foundation.

Our project’s [first milestone](https://github.com/deckgo/deckdeckgo/milestone/50) is not yet completely reached but, I managed to successfully deploy our editor.

Here are the few things I learned along the way. Hopefully it will help you get started too.

*Last update: Oct. 20, 2021*

*****

### Introduction

For our project I chose the path to set up everything by my own, using the [DFINITY SDK](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html) and tools. The following information, notably these regarding cost and deployment, are linked to such approach.

If you are looking to ease the process of web-hosting, [Fleek](https://fleek.co/) seems to be the solution you are looking for.

*****

### No Free Tier

In comparison to established cloud providers, the DFINITY foundation does not offer any free tier plan to explore the Internet Computer yet.

That being said, it is possible to get free cycles to start building on the IC through their [Cycles Faucet](https://medium.com/dfinity/cycles-faucet-free-cycles-to-build-on-the-internet-computer-789166a95140) initiative.

In addition, a [CHF 200 million program](https://medium.com/dfinity/dfinity-announces-chf-200-million-program-to-support-the-internet-computer-developer-ecosystem-c65aa290548c) to support the developer ecosystem, award teams to build dapps, tooling, and infrastructure on the Internet Computer.

You can submit a grant application [here](https://dfinity.org/grants#utm_source=home&utm_medium=banner&utm_campaign=grants). Good luck 🤞.

*****

### Prepaid Hosting

Something which makes always a little scary before launching a new application is its related costs in case it would become widely used. Specially if the cloud provider does not offer you a straight forward option to turn down everything but, only provide warning notifications.

The Internet Computer works differently.  You don't register your credit cards to buy computing power. You charge in advance a wallet with credits, what they called "cycles", to run your application.

When there is no more credit available, I am guessing the application stops. I find this approach interesting and kind of reassuring.

*****

### How To Buy Cycles

You have to own Internet Computer Protocol tokens (ICP tokens), a native utility token with a value determined on the open market, to buy cycles.

In other words: you cannot buy directly cycles with your credit cards and dollars.You have first to buy ICP on a cryptocurrency exchange platform and transfer these to your wallet to ultimately convert them to cycles.

Still confused?

1. Create an account on a cryptocurrency exchange platform, I used [Coinbase](https://www.coinbase.com), and buy some ICP tokens with your credit cards. If you just want to give it a try, ~$5 USD should be fine.

2. You will need an identity and a wallet on the Internet Computer to transfer and receive the tokens you just bought. The easiest way is using the [NNS app](https://nns.ic0.app/) that allows anyone to interact with the Internet Computer’s Network Nervous System with a user-friendly UI.

3. In NNS app, you get a default main wallet. You can create more accounts but, I just went with the default one. On the main screen, copy the related ID, the identifier to transfer ICP from the exchange platform.

![](https://cdn-images-1.medium.com/max/1600/1*BTLt8V5QsOJd-HEyIBREKA.png)

4. On the exchange platform, find the option “Send and receive” in your dashboard and use the above ID as receiver. In Coinbase, you shall enter it in the input field accepting phone number and email. Yes that’s right, it goes there 😉.

That’s it, the tokens should be transferred within a couple of seconds and you will be able to convert ICP to cycles.

*****

### How To Deploy To The Internet Computer

I read the [documentation](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html) back and forth but, did not find any better guide than this 👉 [article](https://medium.com/dfinity/how-to-deploy-your-first-canister-using-the-nns-dapp-c8b75e01a05b) 👈.

It displays step by step the most comprehensive way to deploy to the Internet Computer a web application. Kudos to its author, [Kyle Peacock](https://github.com/krpeacock) 🙏.

*****

### Webpack And React First

All examples you find in the documentation and [forum](https://forum.dfinity.org/) are mostly focused on [Webpack](https://webpack.js.org/) and [React](https://reactjs.org).

I use these in many projects, and can understand that a team has to give priority to particular topics but, I would rather like a framework/bundlers-less first approach.

Anyway and fortunately, contributor [MioQuispe](https://github.com/MioQuispe) has created a CLI, [create-ic-app](https://github.com/MioQuispe/create-ic-app), which provides different flavor of starter kits.

If you are using [Rollup](https://rollupjs.org/), as we do through [Stencil](https://stenciljs.com/), you can also check our repo (see [stencil.config.ts](https://github.com/deckgo/deckdeckgo/blob/main/providers/ic/stencil.config.ts) and [dfx.config.ts](https://github.com/deckgo/deckdeckgo/blob/main/providers/ic/dfx.config.ts)).

*****

### Deployment

At first, I had the feeling the Internet Computer's was not really well suited for JavaScript bundles split in multiple chunks (ES modules) but, I was wrong.

After some iterations, I solved my issues and answered my questions.

*****

#### Cost Of Upload

Uploading assets to a canister takes time and costs. Each resource is process and deploy in exchange for a few cycles.

I did not find or get how these are calculated but, it seems that the amount of operations, of files transfer, has a bigger impact on the related costs than the size. Being said, it's my observation, this might be incorrect.

Each asset is analyzed and processed, it takes a few seconds to upload one resource.

A hash is created for every uploaded assets and, if no changes are detected, files will not be analyzed and imported again. Therefore, the very first upload needs more resources than those who will follow.

Nevertheless, I let you picture what it meant when I first tried to upload our application which contains >290 JavaScript chunks and >1'000 SVG images 🤪.

Anyway, I ultimately  managed to set up my project for the best. I notably removed all unused SVG (<100 are actually used) and other resources such as `.map`.

I also observed more in details the cost of uploading these >290 JS chunks, which weight for the most only a couple of thousands bytes, and noticed that the related cost  was actually low.

If I get it right, according [documentation](https://sdk.dfinity.org/docs/developers-guide/computation-and-storage-costs.html), the 0.013 tera Cycles which were debited from my account for such operation actually represent less than $0.02.

*****

#### Boot Time

Once the application deployed, if you use the default URL `<your-app-id>.ic0.app` , a service worker will check that [all delivered assets are certified before load](https://forum.dfinity.org/t/service-worker-the-script-has-an-unsupported-mime-type-text-html/5941/5?u=peterparker).

This means that the more assets you have, the more JavaScript files you have, the slower it starts.

Fortunately, there is another sub-domain, `<your-app-id>.raw.ic0.app`  where no such check is performs. The load time is de facto improve.

*****

### ES Modules

For a long period of time, I did not manage to deploy, or use, our application on the simulated local network.

I was using the test URL [http://localhost:8000/?canisterId=canister_id](http://localhost:8000/?canisterId=canister_id) which fails at loading ES modules because it cannot set the referrer correctly.

Fortunately, thanks to a feedback of the DFINITY team, we figured out that using the canister id as a local subdomain instead of a query URL solves the issue: [https://canister_id.localhost:8000/](https://canister_id.localhost:8000/)

*****

### Summary

I still got a bit of work on the agenda but, our first milestone is coming well together. Yesterday I even started to have a look at the authentication (part of our second milestone). I hope above tips and tricks might help some other developers to get started with this exciting new technology.

To infinity and beyond!

David
