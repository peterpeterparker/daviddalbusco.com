---
path: "/blog/announcing-papyrs-blog-on-web3"
date: "2022-06-08"
title: "Announcing Papyrs: Blog on web3"
description: "I have developed a new open-source, privacy-first, decentralized blogging platform that lives 100% on chain and today I am making it available to anyone."
tags: "#startup #programming #web3 #blockchain"
image: "https://cdn-images-1.medium.com/max/1600/1*gEI9lNAq_sce_TsPXSt5Tg.jpeg"
canonical: "https://medium.com/dfinity/dynamically-create-canister-smart-contracts-in-motoko-d3b38a748c07"
---

So, I have developed a new open-source, privacy-first, decentralized blogging platform that lives 100% on chain and today I am making it available to anyone. I called it: [Papyrs](https://app.papy.rs).

* * *

## What a ride!

Last year, I was lucky enough to receive grants from the DFINITY foundation to port our web editor for slides, [DeckDeckGo](https://deckdeckgo.com/), to the [Internet Computer](https://smartcontracts.org/).

While I completed all milestones, I did not migrate it yet.

Along the way, I had the idea of extending the platform to support documents. One thing leading to another, I ended developing my own rich text editor library, [Stylo](https://stylojs.com/), and decided to focus first on this new format; which is why today I'm launching a new blogging platform.

On the one hand, thanks to this approach, I limit the number of features I launch on the IC, which allows me to gain experience to later deploy our presentation editor more serenely.

On the other hand, I like to develop new ideas and thus double the fun 😜.

* * *

## Manifesto

So, why launch another blogging application? After-all there are already many platforms that allow you to write articles, right 🤷‍♂️?

Sure there is but none are following the guidelines that drive me.

* * *

### Decentralization & blockchain

The concept of decentralization - or web3 - is linked to a certain form of romanticism for developers that [Chris Dixon](https://twitter.com/cdixon) summarizes in following terms:

*The lesson is that when you compare centralized and decentralized systems you need to consider them dynamically, as processes, instead of statically, as rigid products. Centralized systems often start out fully baked, but only get better at the rate at which employees at the sponsoring company improve them. Decentralized systems start out half-baked but, under the right conditions, grow exponentially as they attract new contributors ([source](https://twg.io/whiteboard/why-decentralization-matters/)).*

As a programmer myself, this idea is appealing. I also think that blockchain technology might lead to interesting new perspectives for the future.

I can for instance imagine that consensus and other certification mechanisms could potentially be useful to prove the validity of the articles shared with Papyrs - i.e. could be used to prevent fake news and misinformation.

But that is for the future. Right now, my main commitment is empowering users ownership of their data by taking advantages of smart contracts.

Between ads networks - that I cannot stand - and Big Tech companies that exploit our private data, I developed a bit a pessimist view on the what the Internet has become. Furthermore, as my parents say when they are pessimistic, it also feels that "the best is not to come".

That's why I developed Papyrs with a true privacy first approach.

* * *

### Privacy-first

The editor works primarily offline and requires no sign-in. The blog posts can be loaded and exported to the file system. There is a Chrome [plugin](https://chrome.google.com/webstore/detail/papyrs-to-markdown/caacmbgdcjpdpmccocmbiljodkbkjglh) to convert these to markdown.

If you are interested in storing and sharing your blog posts online - on chain - then an authentication with [Internet Identity](https://identity.ic0.app/) is required.

However, unlike any other auth providers, using this powerful password-less method preserves anonymity!

Finally, as currently implemented, I - as the admin of the platform - have absolutely no privileges to read your data. As long as you do not share any content publicly, it remains fully private.

Your data are your own, period.

* * *

### Open-source

In my opinion, there can be no privacy without open source code. It is a matter of trust.

Therefore, here are all the links to each and every single lines of code I wrote for Papyrs:

*   [Papyrs](https://github.com/papyrs/papyrs): the main repo - the web application
*   [IC](https://github.com/papyrs/ic): canisters and sign-in providers
*   [CDN](https://github.com/papyrs/cdn): libraries and assets used across the platform

*   [Unsplash-proxy](https://github.com/papyrs/unsplash-proxy): a proxy used to query Unsplash

*   [Stylo](https://github.com/papyrs/stylo): another kind of rich text editor

*   [Kit](https://github.com/papyrs/kit): the templates for the posts that are published on chain

*   [Papyrs to markdown](https://github.com/papyrs/markdown-plugin): a Chrome plugin to convert to markdown

*   [DeckDeckGo](https://github.com/deckgo/deckdeckgo/): various web components, utilities and the providers for the offline persistence and synchronization of the data

As the saying goes, "sharing is caring" 🤗. I hope what I implemented can help any developer starts building on the Internet Computer. Furthermore, I am also looking forward to feedbacks and contributions (🤞) in order to improve the project.

* * *

### Indie hacking

Beside my opinionated point of view and the fact that I am the first user of my own project, I would lie if I would not admit that I have also some small hopes for Papyrs to generate revenue in the future.

All this cannot happen without users but if some would be interested, I am convinced there will be a way to find a model that can be both profitable for Papyrs and the content creators while absolutely making no concession on my values.

* * *

## Features

As mentioned in the previous chapter, I use the platform for blogging purpose myself. That is why I designed it the way I want with the features I often need.

e.g. browsing [Unsplash](https://unsplash.com/) to select images for presentation purpose.

![https://unsplash.com/photos/uNNCs5kL70Q](https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw0OXx8ZG9nJTIwaGVsbG98ZW58MHx8fHwxNjU0NDMzNDEy&ixlib=rb-1.2.1&q=80&w=1080)

*Photo by [Jamie Street](https://unsplash.com/@jamie452?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Adding GIFs from [Tenor](https://tenor.com/) for comic relief.

![a good laugh](https://media.tenor.com/images/e82c2cd09db0bf410917cda2ef22ffd4/tenor.gif)

Showcasing code snippets and editing these with the [Monaco editor](https://microsoft.github.io/monaco-editor/).

```typescript
export const addParagraph = ({
  paragraph,
  container,
  fragment
}: {
  container: HTMLElement;
  paragraph: HTMLElement;
  fragment: DocumentFragment;
}): Promise<Node | undefined> => {
  return new Promise<Node | undefined>((resolve) => {
    const addObserver = 
      new MutationObserver((mutations: MutationRecord[]) => {
        addObserver.disconnect();

        resolve(mutations[0]?.addedNodes?.[0]);
    });

    addObserver.observe(container, {childList: true, subtree: true});

    paragraph.after(fragment);
  });
};
```

Sketching hand-draw like diagrams with [Excalidraw](https://excalidraw.com/).

![https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/excalidraw-1655146692059.webp?token=Pc79eylT4f4H9_sg_mIlt](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/excalidraw-1655146692059.webp?token=Pc79eylT4f4H9_sg_mIlt)

And more to come...

* * *

## Call for writers

Today, my blogging platform is becoming accessible to everyone, but that doesn't mean that it really lives. It needs a community, it needs content, it needs writers, it needs YOU!

Get started now to write your next blog posts: [https://app.papy.rs](https://app.papy.rs)

To infinity and beyond

David
