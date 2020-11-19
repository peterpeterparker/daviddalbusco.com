---
path: "/blog/stenciljs-and-web-worker-a-fairy-tale"
date: "2020-11-19"
title: "StencilJS & Web Worker: A Fairy Tale"
description: "The story of the Stencil's compiler and its magical integration of the Web Worker API."
tags: "#stencil #showdev #javascript #typescript"
image: "https://cdn-images-1.medium.com/max/1600/1*WXwuHYRWLLamBbB5zg6gtg.png"
canonical: "https://daviddalbusco.medium.com/stenciljs-web-worker-a-fairy-tale-ec48343fce17"
---

![](https://cdn-images-1.medium.com/max/1600/1*WXwuHYRWLLamBbB5zg6gtg.png)

*****

Once upon a time, there was a compiler that generates Web Components and builds high performance web apps called [StencilJS](https://stenciljs.com). Among all the build-time tool ever created, it had for goal to build faster, more capable components that worked across all major frameworks.

On the internet next door, there lived a boy (me 😉). And the boy watched the compiler grow more and more effective, more and more developer friendly with each passing year.

One day, as he was developing something new in his beloved project [DeckDeckGo](https://deckdeckgo.com), the boy had the idea to experiment a feature of the compiler he had never tried so far, the integration of [Web Workers](https://stenciljs.com/docs/web-workers).

He was so blew away by the results, that he had to share that magical encounter.

*****

### Chapter One: Abracadabra

A boy publishes a blog post but would not reveal any unknown secret spells. Meanwhile, there would be no good fairy tale without magic words.

Fortunately, the compiler has shared its sorcery to anyone publicly in a very well documented grimoire called “[documentation](https://stenciljs.com/docs/web-workers)”.

Valiant knights seeking to technically defeat such implementation, let me suggest you to have a look to these spells but, if to the contrary you are here to find a quest, stay with me and let me tell you the rest of the story.

*****

### Chapter Two: Init Camelot

King Arthur and the Round Table had Camelot, we, developer, have Web Components and shadow DOM, which can be metaphorically represented as castles. That’s why we are initializing a new Stencil playground before experimenting new magical tricks.

```bash
npm init stencil
```

In addition, to replicate the exact formula the boy had tried out, we enhance our fortifications with the usage of [Marked.js](https://marked.js.org/) so that we give our component the goal to render a magical sentence from Markdown to HTML.

```
npm i marked @types/marked
```

Having found some mortar, we are creating a component which aims to reproduce the rendering spell by transforming markdown to HTML when the lifecycle `componentWillLoad` and applying it through the use of a local state.

```javascript
import { Component, h, State } from '@stencil/core';

import { parseMarkdown } from './markdow';

@Component({
  tag: 'my-camelot',
  shadow: true,
})
export class MyCamelot {

  @State()
  private markdownHtml: string;

  async componentWillLoad() {
    this.markdownHtml = await parseMarkdown(`# Choose wisely

For while the true Grail will **bring you life**, the false Grail will take it from you.`
    );
  }

  render() {
    return <div innerHTML={this.markdownHtml}></div>;
  }
}
```

In addition, we externalize the magical function in a separate file we can call `markdown.ts`.

```javascript
import marked from 'marked';

export const parseMarkdown = async (text: string) => {
  const renderer = new marked.Renderer();

  return marked(text, {
    renderer,
    xhtml: true,
  });
};
```

Some who might fear nothing and who might run the above code on their local computers, `npm run start`, might observe the following outcome.

![](https://cdn-images-1.medium.com/max/1600/1*ube4TfnIPeJrXX0vD0wRDA.png)

*****

### Chapter Three: Spell Calling

The boy had already been published articles on Web Workers, one about their native [JavaScript integration in React](https://levelup.gitconnected.com/react-and-web-workers-c9b60b4b6ae8) applications and another one showcasing their [integration with Angular](https://medium.com/swlh/angular-and-web-workers-17cd3bf9acca).

From taking care of making libraries available for the workers, in the Javascript version, to using listeners and creating objects to load these in both of these, even if from a certain perspective it needed few works, it still needed more work, more code.

To the contrary and to the boy wonder, Stencil made all these steps magical by simply calling a unique spell: `mv markdown.ts markdown.worker.ts`

Indeed, as you can notice in following screenshot, any TypeScript file within the `src` directory that ends with `.worker.ts` will automatically use a worker by the Stencil’s compiler making, as far as the boy knows, the most magical Web Worker recipe he ever tried out 🔥.

![](https://cdn-images-1.medium.com/max/1600/1*WjLbi1ajmi4H0rlACo4dPA.png)

*****

### Epilogue

The [Stencil’s](https://stenciljs.com) compiler, having simplified this kind of integration, demonstrated once again all its potential. Together with the Web Worker, they hopefully will have many babies, many amazing Web Components and applications.

To infinity and beyond!

David

*****

You can reach me on [Twitter](https://twitter.com/daviddalbusco) and, why not, give a try to [DeckDeckGo](https://deckdeckgo.com/) for your next presentations.
