---
path: "/blog/more-gatsby-i18n-tips-and-tricks"
date: "2020-12-24"
title: "More Gatsby i18n Tips And Tricks"
description: "A follow-up to my article about the internationalization of Gatsby websites."
tags: "#gatsby #react #javascript #i18n"
image: "https://daviddalbusco.com/assets/images/1*pWteHjwMcqePrFNKqgq2ug.jpeg"
canonical: "https://daviddalbusco.medium.com/more-gatsby-i18n-tips-and-tricks-4b71fc692136"
---

![](https://daviddalbusco.com/assets/images/1*pWteHjwMcqePrFNKqgq2ug.jpeg)

_Photo by [pure julia](https://unsplash.com/@purejulia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/world-map?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

Earlier this year (2020), when I was publishing a blog post every day during the lockdown, I shared [my solution](https://daviddalbusco.com/blog/internationalization-with-gatsby) to internationalize website build with [Gatsby](https://www.gatsbyjs.com/).

The past few days, I have re-build from the ground up the website of [DeckDeckGo](https://deckdeckgo.com) with the goals to extract static content from our editor for slides and, to develop the foundation to internationalize our platform.

At first, I was looking to experiment a new method but, did not find any which worked well for me. That’s why I developed this new website with Gatsby using my own recipe, again.

Doing so, I learned a couple of new tricks and also improved, I hope, the solution.

---

### Meta

This article is a follow-up to my March 2020 blog post: [Internationalization With Gatsby](https://daviddalbusco.com/blog/internationalization-with-gatsby).

The current post was written in December 2020 using Gatsby v2, [gatsby-plugin-i18n](https://github.com/angeloocana/gatsby-plugin-i18n) v1, [React](https://reactjs.org/) v17 and [react-intl](https://github.com/formatjs/formatjs) v5.

Its code snippets are taken from our open source website on [GitHub](https://github.com/deckgo/deckdeckgo/tree/master/site).

---

### JSON Translation Files

In the previous article, I was relying on JavaScript files to handle translations (`i18n/en.js`).

```javascript
module.exports = {
	hello: "Hello world"
};
```

Needless to say, I was never a big fan of such method. That’s why in our new website, I replaced these by JSON data (`i18n/en.json`).

```json
{
	"hello": "Hello world"
}
```

These JSON files can then be imported in their respective language `Layout` component as I used to do with JS import (`layout/en.js` ).

```javascript
import React from "react";
import Layout from "./layout";

// Previously with JS
// import messages from '../../i18n/en';

// New with JSON
import messages from "../../i18n/en.json";

import "@formatjs/intl-pluralrules/locale-data/en";

export default (props) => <Layout {...props} messages={messages} />;
```

I did not make any changes in the common `Layout` component itself. It still declares the layout and wrap the children in a `IntlProvider` .

```javascript
import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import { IntlProvider } from "react-intl";
import "@formatjs/intl-pluralrules/polyfill";

import { getCurrentLangKey } from "ptz-i18n";

export default ({ children, location, messages }) => {
	const data = useStaticQuery(graphql`
		query SiteTitleQuery {
			site {
				siteMetadata {
					title
					languages {
						defaultLangKey
						langs
					}
				}
			}
		}
	`);

	const { langs, defaultLangKey } = data.site.siteMetadata.languages;
	const langKey = getCurrentLangKey(langs, defaultLangKey, location.pathname);

	return (
		<IntlProvider locale={langKey} messages={messages}>
			{children}
		</IntlProvider>
	);
};
```

---

### Multiple JSON Data

Don’t know if this idiom exists in English but, in French, with can say something such as “Don’t put all the eggs in the same basket”. Indeed, we might not want to handle all our translations in a single file but, split these in multiple data.

Thanks to JSON, I was able to resolve this need quite easily. For example, I created two separate files `i18n/index.json` and `i18n/common.json` .

Important to notice, I prefixed the translations’ keys with keywords, such as `index` or `common`, to avoid duplicate keys.

```json
// A new file i18n/index.json
{
  "index.hello": "Hello"
}

// Another file i18n/common.json
{
  "common.hello": "Hello"
}
```

Each files can finally be imported and concatenated, thanks to destructing objects, to the list of translations in their related language layout (`layout/en.js` in this example).

```javascript
import React from "react";
import Layout from "./layout";

import index from "../../i18n/index.json";
import common from "../../i18n/common.json";

import "@formatjs/intl-pluralrules/locale-data/en";

export default (props) => (
	<Layout
		{...props}
		messages={{
			...index,
			...common
		}}
	/>
);
```

Using this method, we can split our translations in as much separate files as we would like, we “just” have to import and concatenate each new file we would create.

---

### Placeholder, alt, aria-label and title

In an [article](https://medium.com/@Yuschick/translating-placeholder-alt-title-text-with-react-intl-a99d31f4194c) of [Daniel Yuschick](https://twitter.com/Yuschick) I discovered that react-intl now exposes a `useIntl` hook which turns out to be kind handy to translate placeholder, alt, aria-label and title.

```javascript
import React from "react";

import { useIntl } from "react-intl";

export const Contact = () => {
	const intl = useIntl();

	return (
		<section>
			<textarea placeholder={intl.formatMessage({ id: "hello.world" })} name="message" rows={4} />
			<img alt={intl.formatMessage({ id: "hello.yolo" })} src="./yolo.png" />
		</section>
	);
};
```

---

### Links

Translations sometimes contain HTML elements such as links. A sentence such a `The source code on <a href="...">GitHub</a> is super.` would either need multiple entries for the translations or, a handy react-intl solution 😉.

The trick can be done by introducing a “placeholder” for the link in the translation (such as for example `{githubLink}` ).

```json
{
	"source.code": "The source code is available on {githubLink}."
}
```

When using the `FormattedMessage` component provided by react-intl, we can then parse, or replace, this “placeholder” with the effective link (HTML element).

```javascript
<FormattedMessage
	id="source.code"
	values={{
		githubLink: <a href="https://github.com/deckgo/deckdeckgo">GitHub</a>
	}}
/>
```

---

### Overwrite Main Index.js

Even though, as displayed in my previous article, I configured the website to route root path queries to the default language, I noticed that it is safe(r) to deploy the website with an `index.js` file.

```javascript
// ./gatsby-browser.js
exports.onClientEntry = () => {
	if (window.location.pathname === "/") {
		window.location.pathname = `/en`;
	}
};
```

Because I don’t want to maintain multiple entry files manually, I created a pre-build script which copy `index.en.js` (my main index file) to `index.js` at build time.

In addition, the script also adds a comment at the start of the target file, so that I will remember that I should not edit it manually 😅.

```javascript
// copy-index.js

const fs = require("fs");

try {
	fs.copyFileSync("./src/pages/index.en.js", "./src/pages/index.js");

	const content = fs.readFileSync("./src/pages/index.js");

	const comment =
		"/**\n * Do not modify! This file is overwritten by index.en.js at build time.\n */\n";

	fs.writeFileSync("./src/pages/index.js", comment + content);

	console.log(`index.en.js copied to index.js!`);
} catch (err) {
	console.error(`Cannot copy index.en.js`);
}
```

I set up this script by adding a `prebuild` target to my `package.json` .

```json
"scripts": {
  "prebuild": "node ./copy-index.js",
  "develop": "gatsby develop",
  "start": "gatsby develop",
  "build": "gatsby build",
  "serve": "gatsby serve",
  "clean": "gatsby clean"
},
```

---

### Summary

There might be some other easier solution to translate Gatsby website but, for having use my own recipe twice now, I am happy with the result and, the developer experience as well. That being said, I might search again for another solution next time, afterwards, never stop learning is what makes development fun.

Merry Christmas 🎄. To infinity and beyond!

David
