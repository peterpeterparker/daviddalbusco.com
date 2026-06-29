---
path: "/blog/syntax-highlighting-displayed-in-ubuntu-terminal-like"
date: "2020-02-24"
title: "Syntax Highlighting Displayed In Ubuntu Terminal Like"
description: "Display the code of your apps, websites or blogs with code highlighting in stylish Ubuntu Terminal like"
tags: "#webdev #showdev #javascript #css"
image: "https://daviddalbusco.com/images/blog/1*sJQnreNU9DZ0ARLHDil8gg.png"
canonical: "https://medium.com/@david.dalbusco/syntax-highlighting-displayed-in-ubuntu-terminal-like-a7e9c310b504"
---

![](https://daviddalbusco.com/images/blog/1*sJQnreNU9DZ0ARLHDil8gg.png)
_Background photo by [MUNMUN SINGH](https://unsplash.com/@munmuns?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

A couple of days ago, [Cody Pearce](https://twitter.com/codyapearce) published an [article](https://dev.to/codypearce/ubuntu-terminal-in-css-1aeo) which picked my curiosity. In his post he was displaying how the unique and immediately recognizable design of the Ubuntu terminal can be reproduced with CSS.

In [DeckDeckGo](https://deckdeckgo.com), our editor for presentations, we are providing a code highlighter Web Component, developed with [Stencil](https://stenciljs.com/), which can be integrated in your slides, apps or even easily in a [Gatsby](https://www.gatsbyjs.org/) website.

That’s why I thought it would be fun to merge Cody’s idea and design 😄.

### HTML

The quickest way to try out the component is probably to plug it, with the help of [Unpkg](https://unpkg.com/), in a plain HTML file. Once the references to fetch its code have been added in the page header, it can be consumed.

Regarding the code to highlight, it should be provided to match the slot name `code` and that’s it, everything you need to highlight the code is ready.

```html
<html>
	<head>
		<script
			type="module"
			src="https://unpkg.com/@deckdeckgo/highlight-code@latest/dist/deckdeckgo-highlight-code/deckdeckgo-highlight-code.esm.js"
		></script>
		<script
			nomodule=""
			src="https://unpkg.com/@deckdeckgo/highlight-code@latest/dist/deckdeckgo-highlight-code/deckdeckgo-highlight-code.js"
		></script>
	</head>
	<body>
		<deckgo-highlight-code>
			<code slot="code">console.log('Hello World');</code>
		</deckgo-highlight-code>
	</body>
</html>
```

Rendered in a browser, the above code looks like the following:

![](https://daviddalbusco.com/images/blog/1*EQdSlwuhodPaVtTKzJ2JwQ.png)

As you may notice, it isn’t yet rendered in a stylish Ubuntu terminal like but in a “Macish” terminal, which is the default behavior. Therefore, to achieve our goal, we just improve the solution by providing the attribute `terminal` set to `ubuntu` .

```html
<deckgo-highlight-code terminal="ubuntu">
	<code slot="code">console.log('Hello World');</code>
</deckgo-highlight-code>
```

And voilà, nothing more, nothing less 😁

![](https://daviddalbusco.com/images/blog/1*K8ZJJL3WohfdOa8pKcCRlg.png)

By the way, don’t you feel too that it is over awesome to be able to write what, five lines of code in a plain HTML file and to already have a “complex” and performing element rendered? Damned, I love Web Components 🚀.

### Gatsby

As briefly mentioned above, we also do provide a [plugin](https://www.gatsbyjs.org/packages/gatsby-remark-highlight-code/) to integrate easily our component in any Gatsby websites and blogs too. At the end of last year I published another [post](https://daviddalbusco.com/blog/stylish-cards-and-syntax-highlighting-with-gatsby) to display how it could be integrated, therefore I won’t cover the setup process again but just I just want to mention that the style could be selected through an optional plugin configuration:

```javascript
// In your gatsby-config.js
plugins: [
	{
		resolve: `gatsby-transformer-remark`,
		options: {
			plugins: [
				{
					resolve: `gatsby-remark-highlight-code`,
					options: {
						terminal: "ubuntu"
					}
				}
			]
		}
	}
];
```

If I would apply the above configuration to my personal website then, after rebuild, automatically all of its blocks of code would be encapsulated in Ubuntu terminal like.

![](https://daviddalbusco.com/images/blog/1*Bpmo6Lcv0WL5OiPRpTtIOA.png)

### Properties And Styling

Beside the default configuration, the components supports [many options](https://docs.deckdeckgo.com/components/code). Notably, because it is a wrapper around [Prism.js](https://prismjs.com), the ability to highlight 205 languages (to be provided though a property `language` ) and offers many styling options through CSS4 variables. From specifying the color of the highlighted code to customizing the terminal or none, even if it’s a shadowed Web Component, it does expose many options and in case you would need more, ping me!

To infinity and beyond 🚀

David

P.S.: Even though the Ubuntu Terminal like are only going to be unleashed in our next major release, such stylish cards do already also look good in slides, so why not giving a try to [DeckDeckGo](https://deckdeckgo.com) for your next talk 😜

![](https://daviddalbusco.com/images/blog/1*IpmwISIqDl__NE3SjrNdng.gif)
