---
path: "/blog/a-year-in-code-my-frontend-work-of-2023"
date: "2023-12-30"
title: "A Year in Code: My Frontend Work of 2023"
description: "A visual journey through the frontend projects I’ve build this year."
tags: "#webdev #showdev #programming #journal"
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JThVguqwUiuW1U8rqNgvMA.png"
canonical: "https://daviddalbusco.medium.com/a-year-in-code-my-frontend-work-of-2023-afd4025560f7"
---

![](https://cdn-images-1.medium.com/max/3584/1*JThVguqwUiuW1U8rqNgvMA.png)

---

I’ve never undertaken such an exercise before, but as another year draws to a close, I’ve realized it’s been quite a fruitful period for developing numerous frontend applications. This includes both my professional freelancing work and projects as an open-source enthusiast hobbyist.

In my view, all these projects have turned out exceptionally well, thanks in large part to the contributions of talented designers. So, I thought it would be a great idea to wrap up my blogging year with a brief visual summary of my work. Let’s dive in!

---

## Juno

You might find it surprising, especially if you follow me on social media, but Juno isn’t even a year old yet. Although I started the proof of concept in late 2022, it was only in February 2023, coincidentally on Valentine’s Day, that I introduced Juno to the world and opened its source code.

For those who don’t follow me, [Juno](https://juno.build/) is a zero-knowledge blockchain platform that provides developers with comprehensive tools to effortlessly create Web3 applications, akin to developing serverless Web2 apps.

In most of my personal projects where aesthetics are key, I collaborate with my friend Didier Renaud from [Customfuture](https://www.customfuture.com/) to refine and enhance the design, and Juno was no exception.

Summarizing Juno in a single screenshot is challenging, given its vast scope (over 1,000 commits, encompassing a website, various backend smart contracts, an admin console, a CLI, numerous examples, etc.). However, the chosen screenshot from the console encapsulates my approach: building everything from scratch, including the UI, without relying on third-party libraries. I prefer crafting my own components and have a fondness for neo-brutalism. I firmly believe that an app should make a memorable first impression on its users. I hope this one does!

![](https://cdn-images-1.medium.com/max/6144/1*Y_yuNbjrOcXHxDoYvWCfZA.png)

---

## ckBTC

This year, I had the chance to continue my contracting collaboration with the [DFINITY Foundation](https://dfinity.org/) and was fortunate to be part of the GIX team. We developed awesome features, notably for [NNS dapp](https://nns.internetcomputer.org/), a decentralized application used for staking and participating in the [Internet Computer](https://internetcomputer.org/)’s governance.

Among the various cross-department projects, I participated in the ckBTC project, which required integration into the dapp. This was definitely just the tip of the iceberg, but it was an interesting project that required several iterations to finalize an acceptable UX.

One exciting thing from a frontend perspective is that we are not relying on third-party UI libraries. Instead, we have built and open-sourced our own [GIX components](https://gix.design/), which can be used by our colleagues in other teams and the community. This way, we not only control our tools but also help others. It’s essentially an awesome job for anyone who’s passionate about OSS.

![](https://cdn-images-1.medium.com/max/6144/1*X6jpzy-pu46yN1XktGIcrg.png)

---

## icdraw

I can’t recall the exact reason, but mid-year, I found myself spending a weekend creating a dapp — which I called [icdraw](https://icdraw.com/) — using Juno. My primary motivation, as far as I can remember, was to dogfood my tools. This practice, I believe, is an excellent way to identify pain points and bugs.

So, I developed a whiteboard dapp for sketching hand-drawn-like diagrams on Web3, incorporating [Excalidraw](https://excalidraw.com/), a sketching tool I’m quite fond of. It was also one of my first forays into integrating Juno’s capabilities with Web Workers, as I have an aversion to ‘save’ buttons. I’m all for UX designs where the app seems to magically save data, and I enjoy crafting such seamless patterns.

As for the UI design, I kept it straightforward but distinctive: I added bold borders, a signature style of mine, and chose a few really vibrant background colors. After all, tools like these can never be too flashy 😉.

![](https://cdn-images-1.medium.com/max/6144/1*XXWwTTiPloOCtXJOq0ZV4g.png)

---

## Oisy Wallet

[Oisy](https://oisy.com/) is more than just a browser-based Ethereum wallet; it’s a testament to innovation, secured by the Internet Computer and offering networked-custody. It began as a simple idea but quickly evolved, brimming with features that each seemed too cool to leave out.

This wallet encompasses not just the frontend application but also a backend that securely derives keys and signs transactions. We even launched an ERC20 token, supported by an airdrop, and managed to bring everything to life in just a few weeks. Being part of a dedicated team, driven by a mission and able to deliver on such a tight schedule, is always a remarkable experience.

I remember that as we were under a bit of pressure to deliver, and while I was working every day, I felt like I needed a bit of fresh air. So, I took my Saturday off and went [running 30+km](https://www.wikiloc.com/trail-running-trails/einsiedeln-tre-30k-loop-kind-of-148007378) in the mountains next to Einsiedeln. This was also an awesome day in my running year, but that’s probably a topic for another type of blog post.

The design was crafted by [Artem Korotkikh](https://twitter.com/artkorotkikh), with whom I enjoy collaborating. He always draws stylish, yet simple-to-understand interfaces, and the foundation is lucky to have him.

From a frontend perspective, there’s a lot going on, but UI-wise, it’s one of the first applications in which I began to really bet on Svelte’s transitions. While not everyone might notice it, most components are designed to transition as smoothly as possible.

![](https://cdn-images-1.medium.com/max/6144/1*v76COgOlJolaRmGlKRM_ng.png)

---

## Voluntary Recycling Credits

The VRC ([Voluntary Recycling Credits](https://recyclingcredit.org/)) proof of concept is another special project we developed this year at the DFINITY Foundation, in collaboration with Roland Berger and BEEAH Group. It demonstrates how the blockchain-powered VRC standard can transform waste management by providing a turnkey solution that incentivizes recycling activities. The project was officially presented at COP28.

In recent years, I collaborated with ETH to create an application aimed at simulating the use of solar electricity. Therefore, on a personal note, I was really happy to be able to contribute to another project that aims to tackle environmental challenges.

The design was realized by Misha Iskandarov with additional contributions from Artem, and in my opinion, the outcome looks great. While one might expect a cumbersome interface for a ‘waste marketplace,’ I believe the result is user-friendly and visually appealing. As a user, it’s definitely something I would like to use.

![](https://cdn-images-1.medium.com/max/6144/1*h4NsFyeaJz1Mb0WeoBvCsg.png)

---

## proposals.network

While using or developing on the Internet Computer (IC), especially using Juno, is great, there are always areas for improvement. Fortunately, since ICP is governed by the NNS DAO, it’s possible to submit ideas for improvements. However, one would have had to use a command line interface to do this, which is an absolute no-go for me.

Given the limitation mentioned above, the absence of a dapp that allows for submitting proposals for Snses through a UI, and the fact that dogfooding Juno is always beneficial, I decided to create [proposals.network](https://proposals.network/).

This project took more than just a weekend to complete — it was more like a week of hobby work, but I’m quite pleased with the result. For the design, I employed patterns and colors from the [Neo-Brutalism UI](https://neo-brutalism-ui-library.vercel.app/) component library and experimented with [Titap](https://tiptap.dev/). I chose to do this because a year ago, I developed [Stylo.js](https://stylojs.com/), and even though I’ve essentially deprecated that project, I wanted to see how it would hold up in practice.

It was fascinating to note that integrating authentication, data persistence, custom domains, and even analytics was actually the quickest part of the process. I might not be doing something entirely wrong with [Juno](https://juno.build/).

![](https://cdn-images-1.medium.com/max/6144/1*pSAP0xQMaOGKD0kx5wovxg.png)

---

## Conclusion

This year has been a learning journey, filled with challenges and growth. I’m thankful for the collaborative efforts, the opportunity to work with amazing people , and the shared passion that made these projects possible.

Looking ahead, I’m excited to see what the next year brings. Here’s to continued collaboration, learning, and coding in the ever-evolving world of web development.
