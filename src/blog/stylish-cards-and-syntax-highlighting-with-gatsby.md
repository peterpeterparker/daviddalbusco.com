---
path: "/blog/stylish-cards-and-syntax-highlighting-with-gatsby"
date: "2019-12-17"
title: "Stylish Cards And Syntax Highlighting With Gatsby"
description: "How to display the code of your Gatsby website and blog with styled cards and code highlighting with a new plugin"
tags: "#gatsby #javascript #webdev #showdev"
image: "https://cdn-images-1.medium.com/max/1600/1*8DbEBAv_L1pK-1Xm03XEzw.png"
---

![](https://cdn-images-1.medium.com/max/1600/1*8DbEBAv_L1pK-1Xm03XEzw.png)

I am a big fan of [Carbon](https://carbon.now.sh)! I often use it to share tips or mistakes I did on my [Twitter](https://twitter.com/daviddalbusco) feed.

The other day, while I was cooking dinner, the idea suddenly hit me: why not improving our [DeckDeckGo](https://deckdeckgo.com) Web Component to highlight code, which use [PrismJS](https://prismjs.com) under the hood, to display per default such stylish cards instead of “just” displaying naked elements.

I ate my dinner and implemented this idea the same night. I woke up the following days and was still pleased with the result. Therefore I even decided to add it to my personal website developed with [Gatsby](https://www.gatsbyjs.org).

That’s why I’m happy to introduce [gatsby-remark-highlight-code](https://github.com/deckgo/gatsby-remark-highlight-code), a new Gatsby plugin to add stylish cards and syntax highlighting to code blocks in markdown files.

### Features

The main advantages, in my opinion, of this new plugin are the followings:

1. Use PrismJS to highlight code and load at runtime any languages which are supported by the library. Nothing to develop or install, the component does the job at runtime.
2. Many styling options through CSS4 variables (see the [documentation](https://docs.deckdeckgo.com/components/code) for the extensive list).
3. Not yet implemented in the plugin, but the component can also display automatically line numbers or highlight selected rows. These features can be added relatively quickly if you would need these.
4. Finally, the plugin use our Web Component developed with [StencilJS](https://stenciljs.com). Therefore, if you are please with the result, you could reuse it easily in any modern web applications regardless of the framework (or none) you are using!

### Getting Started

This plugin can be added in the three following steps:

#### Installation

To install the plugin and the component, run the following command in a terminal:

```bash
npm install gatsby-transformer-remark gatsby-remark-highlight-code @deckdeckgo/highlight-code --save
```

#### Configuration

In your `gatsby-config.js` configure (or add) `gatsby-transformer-remark`:

```javascript
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-highlight-code`
        },
      ],
    },
  },
]
```

#### Load the component

Stencil components should currently be loaded at runtime in Gatsby (see issue [#1724](https://github.com/ionic-team/stencil/issues/1724) which should be soon finally solved as I heard in a Stencil chat recently).

For that purpose, load the [@deckdeckgo/highlight-code](https://twitter.com/deckdeckgo/highlight-code) once in one of your pages or components are mounted.

For example add the following in the main file of your website, in your `index.js`, or in the template of your blog or simply load it where you need it.

```javascript
async componentDidMount() {
  try {
    const deckdeckgoLoader =
      require("@deckdeckgo/highlight-code/dist/loader");
    
    await deckdeckgoLoader.defineCustomElements(window);
  } catch (err) {
    console.error(err);
  }
}
```

That's it, the plugin is configured and ready. After your next build, the code of your blog will be display in stylish cards with syntax highlighting 🎉

### Cherry on the cake 🍒🎂

As I explained above, the exact same Web Component can be used in any modern web applications and is, of course, open source. But the other cherry on the cake is the fact that we are using it in our open source web editor for presentations and developer kit.

Therefore, if you are going to showcase code in an upcoming talk, give a try to [DeckDeckGo](https://deckdeckgo.com)  😃

![](https://cdn-images-1.medium.com/max/1600/1*8SuFF5R9siRlSqAkTSXWjQ.gif)

To infinity and beyond 🚀

David
