---
path: "/blog/highlight-markdown-code-with-remarkable-and-a-web-component"
date: "2019-11-02"
title: "Highlight Markdown code with Remarkable and a Web Component"
description: "Highlight Markdown code with Remarkable and a Web Component"
tags: "#javascript #markdown #webdev #showdev"
image: "https://cdn-images-1.medium.com/max/1600/1*TfrSMW1qpZb_6x0opEVNwQ.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*TfrSMW1qpZb_6x0opEVNwQ.jpeg)

*Photo by [Tim Patch](https://unsplash.com/@tdpatch?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/highlight?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

We are currently developing many improvements for the upcoming new release of the remote control of [DeckDeckGo](https://deckdeckgo.com), our open source web editor for presentations. One of these will give our users the ability to write notes in our editor and to display them in the controller more conveniently. But more than that, it will also be possible to write these using Markdown 😃

Earlier today, [Foad Sojoodi Farimani](https://twitter.com/fsfarimani) shared with us the excellent idea of going a step further with the goal to highlight the code blocks provided as Markdown notes.

I found the idea absolutely awesome and I almost began directly to implement it (almost because I had to clean my flat first, weekend duties are the best 🤣). While commonly you would provide a library to the markdown parser you are using, in our case [Remarkable](https://github.com/jonschlinkert/remarkable) from [Jon Schlinkert](https://twitter.com/jonschlinkert), to highlight the code, I solved it instead by actually parsing it with the help of our  Web Component `<deckgo-highlight-code/>` 🤪.

This [component](https://docs.deckdeckgo.com/components/code) is a wrapper which under the hood use [PrismJS](https://prismjs.com), from [Lea Verou](http://lea.verou.me) and [James DiGioia](https://twitter.com/jamesdigioia). It has the advantage to fetch at runtime the definition of the language it has to interpret which is kind of handy if the provided code could be from any types.

As it took me a bit of time to figure out how to bring everything together, I thought about letting a trace of it through this new blog post.

### Installation

In your project, install both the markdown parser and the Web Component:

```bash
npm install remarkable @deckdeckgo/highlight-code --save
```

### Importation

One installed, import the library and the component in your application:

```javascript
import {Remarkable} from 'remarkable';

import '@deckdeckgo/highlight-code';
```

### Solution

Instead of providing a highlighter function when instantiating a new Remarkable object, as displayed in the documentation, we are going to define our own custom rule to parse the  code respectively we don’t provide any highlighter.

```javascript
const md: Remarkable = new Remarkable({
    html: true,
    xhtmlOut: true,
    breaks: true
});
```

Our goal is to replace the automatically generated HTML code `<pre><code/><pre>` with our custom Web Component `<deckgo-highlight-code/>`. Therefore we create our own rule in a custom function. Moreover, as the code could be either inlined or provided as block, we add a variable to the function in order to handle both cases respectively both styles.

```javascript
const codeRule = (inline: boolean) => 
  (tokens, idx, _options, _env) => {
    return `<deckgo-highlight-code 
            ${inline ? 'class="inline"' : ''}
            language="${tokens[idx].params ?
                tokens[idx].params : 'javascript'}">
                    <code slot="code">${tokens[idx].content}</code>
        </deckgo-highlight-code>`;
};
```

Our custom rule being defined, we set it to Remarkable in order to transform code (“inline code”) and fence (“block of code”).

```javascript
md.renderer.rules.code = codeRule(true);
md.renderer.rules.fence = codeRule(false);
```

To parse the Markdown content to HTML, we finally proceed as we would do normally using the `render` method.

```javascript
md.render(content);
```

### Style

To handle both styles, inline and block, we provide a specific display to the inlined one.

```sass
deckgo-highlight-code {
  &.inline {
    --deckgo-highlight-code-container-display: inline-flex;
  }
}
```

### Test

We can finally try out our solution. For that purpose, we try to render a simple piece of code to the console.

```javascript
const content: string = `# Title
A line \`console.log('Inline code');\`
    
\`\`\`
console.log('Block code');
\`\`\`
                `;

console.log(md.render(content));
```

If everything goes according plan, the output should be the following:

```html
<h1>Title</h1>

<p>A line <deckgo-highlight-code
              class="inline" language="javascript">
                  <code slot="code">console.log('Inline code');
                  </code>
          </deckgo-highlight-code>
</p>

<deckgo-highlight-code 
        language="javascript">
              <code slot="code">console.log('Block code');
              </code>
</deckgo-highlight-code>
```

Voilà, that’s it, we did it, we are highlighting dynamically Markdown code with Remarkable and a Web Component 🎉

### Cherry on the cake 🍒🎂

DeckDeckGo is open source, therefore, you could have a look to the source code of our implementation on [GitHub](https://github.com/deckgo/deckdeckgo/blob/63a76e3a4d7b40ef0cb70dc30cae818da02d4d94/remote/src/app/components/app-notes/app-notes.tsx#L31).

To infinity and beyond 🚀

David
