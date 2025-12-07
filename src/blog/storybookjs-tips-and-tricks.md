---
path: "/blog/storybookjs-tips-and-tricks"
date: "2021-05-05"
title: "StorybookJS: Tips & Tricks"
description: "Import Markdown files as Docs only pages, use a CDN to load dependencies & sort stories."
tags: "#javascript #storybook #webdev #webcomponents"
image: "https://daviddalbusco.com/assets/images/1*0yBFNNJGxc4vkhEPgV21aA.jpeg"
canonical: "https://daviddalbusco.medium.com/storybookjs-tips-tricks-785bc39aacbe"
---

![](https://daviddalbusco.com/assets/images/1*0yBFNNJGxc4vkhEPgV21aA.jpeg)

_Photo by [Florencia Viadana](https://unsplash.com/@florenciaviadana?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/books?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I just migrated the [documentation](https://docs.deckdeckgo.com) of DeckDeckGo to [StorybookJS](https://storybook.js.org/). More than its ability to simplify building and testing, I like to use it for documentation purpose because it allows me to integrate the README.md files that [StencilJS](https://stenciljs.com/) generates automatically. Sparring steps between code and documentation is the best don’t you think?

Here are a couple of tips & tricks I reused, or discovered, along the process.

---

### Import Markdown Files Into StorybookJS

One particularly cool feature of StencilJS is that, out of the box, it auto-generates `readme.md` files in markdown from the code’s comments. Isn’t that neat?

I think it is. Therefore, to even push to concept further, I set up StorybookJS to import these Markdown files as Docs only pages. In that way, the documentation remains and, is edited as close as possible of the code and delivered to the end user without any interruption.

---

#### Meta

At the time of writing the StorybookJS issue [#11981](https://github.com/storybookjs/storybook/issues/11981) list miscellaneous solutions, including using the `transcludeMarkdown` settings or raw loader. If following solution does not suit you, try one of these.

---

#### Limitation

Even though it works very well, I did not manage to highlight the block of codes displayed in the pages and imported from Markdown files. I [commented](https://github.com/storybookjs/storybook/issues/11981#issuecomment-830158237) the issue accordingly.

If you manage to solve this, let me now or, even better, send me a [Pull Request](https://github.com/deckgo/deckdeckgo/) on GitHub 😉.

---

#### Solution

I am using the HTML version of Storybook, I handle my stories in `.js` files as for example in a `Text.stories.js` in which I document a paragraph that accepts a background color as argument.

```javascript
export default {
	title: "Components/Text",
	argTypes: {
		bg: { control: "color" }
	}
};

export const Text = ({ bg }) => {
	return `<p style="background: ${bg};">
    Hello World
  </p>`;
};

Text.args = {
	bg: "#FF6900"
};
```

According [StorybookJS](https://storybook.js.org/docs/react/writing-docs/docs-page), we can replace the DocsPage template on a Component-Level to showcase our own documentation with MDX docs or a custom component. That’s why, next to our story we create a new file `Text.mdx` , which we import and provide as `page` to our story.

```javascript
import { Doc } from "./Text.mdx";

export default {
	title: "Components/Text",
	parameters: {
		docs: {
			page: Doc
		}
	},
	argTypes: {
		bg: { control: "color" }
	}
};

export const Text = ({ bg }) => {
	return `<p style="background: ${bg};">
    Hello World
  </p>`;
};

Text.args = {
	bg: "#FF6900"
};
```

Finally, in our `.mdx` file, we import our `README.md` file (or any other Markdown files) and, we remix the DocsPage with a custom documentation, using the basic Storybook `Description` block.

```javascript
import { Description } from "@storybook/addon-docs/blocks";

import readme from "./readme.md";

export const Doc = () => <Description markdown={readme} />;
```

That’s it, the Markdown file is integrated as Docs pages in StorybookJS 🥳.

---

#### Use A CDN To Load Dependencies

Not sure anyone would ever had that requirements but, if like me, you would need to load dependencies from a CDN, here’s the trick: add your `script` to `./storybook/preview-head.html` . It will be evaluated with your stories.

Likewise, if you would like to define some `style` or load a specific Google Font for your components, you can modify the same file as well.

Some examples taken from my [preview-head.html](https://github.com/deckgo/deckdeckgo/blob/main/docs/.storybook/preview-head.html) file:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link
	href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
	rel="stylesheet"
/>

<script
	type="module"
	src="https://unpkg.com/@deckdeckgo/color@latest/dist/deckdeckgo-color/deckdeckgo-color.esm.js"
></script>

<style>
	pre:not(.prismjs) > div {
		box-shadow: none;
		margin: 25px 0;
	}
</style>
```

---

#### Sort Stories

A specific order for the stories can be defined in `./storybook/preview.js` using the property `storySort`. Each chapter have to be provided as `string` and their list of stories as an `array` .

```javascript
import theme from "./theme";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	options: {
		storySort: {
			order: ["Introduction", ["Introduction", "Getting Started"], "Edit", ["HTML", "Lazy Loading"]]
		}
	},
	docs: {
		theme
	}
};
```

The names should match these provided as `title` in the stories.

With `MDX` using `meta` :

```javascript
import { Meta } from "@storybook/addon-docs/blocks";
<Meta title="Introduction/Getting Started" />;
```

With `JS` through the default `title` :

```javascript
export default {
	title: "Components/Lazy Image",
	argTypes: {
		imgSrc: { control: "text" }
	}
};
```

---

### Summary

[StencilJS](https://stenciljs.com/) + [StorybookJS](https://storybook.js.org/) =
Awesome 💪

To infinity and beyond!

David
