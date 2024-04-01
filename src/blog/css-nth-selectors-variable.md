---
path: "/blog/css-nth-selectors-variable"
date: "2021-06-09"
title: "CSS nth- Selectors Variable"
description: "A practical hack to make CSS nth- selectors variable within Web Components."
tags: "#javascript #webdev #webcomponents #css"
image: "https://cdn-images-1.medium.com/max/1600/1*bCYvMc19HUEZEmZylGOoGg.jpeg"
canonical: "https://daviddalbusco.medium.com/css-nth-selectors-variable-502eccae2e03"
---

![](https://cdn-images-1.medium.com/max/1600/1*bCYvMc19HUEZEmZylGOoGg.jpeg)
_Photo by [Mario Gogh](https://unsplash.com/@mariogogh?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

Using CSS variables, at least when I’m writing these lines in June 2021, is not supported in media queries or selector, e.g. `:nth-child(var(--my-variable))` does not work.

This is a bit unfortunate but, not unsolvable. In some recent development I bypassed this limitation by injecting `style` elements in the DOM, into my Web Components, in order to animate block of codes in [DeckDeckGo](https://deckdeckgo.com).

<iframe width="280" height="158" src="https://www.youtube.com/embed/nast1X6dKo8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/>

---

### Introduction

Stricto sensu the following trick is not reserve to Web Components and, probably works with any elements too. I just only used it so far with such technology 😜.

I will first display the idea with the help a vanilla component and, end the article with the same approach but, implemented with a [StencilJS](https://stenciljs.com/) functional component.

---

### Goal Of The Tutorial

We are going to develop a Web Component which renders a `<ul/>` list and, which can animate the display of its entries.

![](https://cdn-images-1.medium.com/max/1600/1*V_biZYrvRQsoYUdph7U_qQ.gif)

No semantic elements are going to be added or removed from the DOM once the component is load. The animation will happen by modifying the `style` , more precisely by applying a different style on the selected `li:nth-child(n)` .

---

### Vanilla JS

To display the idea without anything else than the web, we create an `index.html` page. It consumes the Vanilla component we are about to develop. We also add a `button` to triggers the animation.

```html
<html>
	<head>
		<script type="module" src="./my-component.js"></script>
	</head>
	<body>
		<my-component></my-component>
		<button>Next</button>
		<script>
			document
				.querySelector("button")
				.addEventListener("click", () => document.querySelector("my-component").next());
		</script>
	</body>
</html>
```

In a separate file, called `my-component.js` , we create the Web Component. At this point without any animation. We declare it [open](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to be able to access the shadow DOM (through `shadowRoot` ), we create a style to hide all `li` and define the `transition` . Finally, we add the `ul` list and its children `li` .

```javascript
class MyComponent extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: "open" });

		const style = this.initStyle();
		const ul = this.initElement();

		this.shadowRoot.appendChild(style);
		this.shadowRoot.appendChild(ul);
	}

	connectedCallback() {
		this.className = "hydrated";
	}

	next() {
		// TODO in next chapter
	}

	initStyle() {
		const style = document.createElement("style");

		style.innerHTML = `
          :host {
            display: block;
          }
          
          li {
            opacity: 0;
            transition: opacity 0.5s ease-out;
          }
        `;

		return style;
	}

	initElement() {
		const ul = document.createElement("ul");

		const li1 = document.createElement("li");
		li1.innerHTML = "Spine";

		const li2 = document.createElement("li");
		li2.innerHTML = "Cowboy";

		const li3 = document.createElement("li");
		li3.innerHTML = "Shelving";

		ul.append(li1, li2, li3);

		return ul;
	}
}

customElements.define("my-component", MyComponent);
```

At this point, if we open our example in a browser (`npx serve .`), we should find a component, with a hidden content, and a button which has no effect yet. Not much to see, but that’s a start 😁.

![](https://cdn-images-1.medium.com/max/1600/1*ODDEgNnoHmsbGwgIPuT5zA.png)

To develop the animation, we have to keep track of the displayed `li` , that’s why we add a state (`index`) to the component.

```javascript
class MyComponent extends HTMLElement {
    index = 0;

    constructor() {
...
```

Thanks to it, we can implement the `next()` method, the one called from the button we added earlier in the HTML page.

> Not my most beautiful code ever. Let’s agree it has only a demo purpose 😅.

```javascript
next() {
    this.index = this.index === 3 ? 1 : this.index + 1;

    const selector = `
      li:nth-child(${this.index}) {
        opacity: 1;
      }
    `;

    let style = this.shadowRoot.querySelector('style#animation');

    if (style) {
        style.innerHTML = selector;
        return;
    }

    style = document.createElement('style');
    style.setAttribute('id', 'animation');

    style.innerHTML = selector;

    this.shadowRoot.appendChild(style);
}
```

What’s happening there?

It first set the next `index` , `li`, to be displayed and, create a CSS `selector` to apply the `opacity` styling. In short, this replaces the CSS variable we cannot use.

Afterwards, we check if the shadowed content of our Web Component already contains a dedicated style to apply the animation. If it does, we update the style with the new value — selector and, if not, we create a new style tag.

Each time this method is call, a new `style` is applied and, therefore another `li:nth-child(n)` is displayed.

If we open again our browser to give it a try, items should be animated among click on our button `next` and, if we go further and observe the component in the inspector, we should notice that the shadowed `style` element change on each method call.

![](https://cdn-images-1.medium.com/max/1600/1*G76KWZf9do9aBnCo2rtLdw.png)

---

### StencilJS

Let’s double the fun with the same example but, using a [StencilJS](https://stenciljs.com/) functional component 🤙.

> You can start a new project with the command line `npm init stencil`

Because we are developing the exact same component, we can copy the previous HTML content (declaring the component and, adding a `button` ) in the `./src/index.html` of the project with an only slight small difference, the method `next()` has to be declared and, called with async — await. This is a requirement — best practice of Stencil, public method of components have to be `async` .

```html
<!doctype html>
<html dir="ltr" lang="en">
	<head>
		<meta charset="utf-8" />
		<meta
			name="viewport"
			content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0"
		/>
		<title>Stencil Component Starter</title>

		<script type="module" src="/build/demo-stencil.esm.js"></script>
		<script nomodule src="/build/demo-stencil.js"></script>
	</head>
	<body>
		<!-- Same code as in previous chapter -->
		<my-component></my-component>

		<button>Next</button>

		<script>
			document
				.querySelector("button")
				.addEventListener("click", async () => await document.querySelector("my-component").next());
		</script>
		<!-- Same code as in previous chapter -->
	</body>
</html>
```

We can also repeat previous steps and, create first a component which does nothing else than rendering a `ul` list and, hidden items `li`.

```javascript
import { Component, h } from "@stencil/core";

@Component({
	tag: "my-component",
	styles: `
		:host {
			display: block;
		}

		li {
			opacity: 0;
			transition: opacity 0.5s ease-out;
		}
	`,
	shadow: true
})
export class MyComponent {
	render() {
		return (
			<ul>
				<li>Spine</li>
				<li>Cowboy</li>
				<li>Shelving</li>
			</ul>
		);
	}
}
```

By testing the component (`npm run start`) we should get the same result too 😉.

![](https://cdn-images-1.medium.com/max/1600/1*qw2VVn0rZlENtjlYY9Yp1Q.png)

To keep track of the `li` to highlight, we need a state and, the function `state` . We add both to our component.

```javascript
@State()
private index: number = 0;

@Method()
async next() {
  this.index = this.index === 3 ? 1 : this.index + 1;
}
```

In comparison to the Vanilla component, because we are using a bundler which simplify the development, we do not have to take care of re-rendering by our selves. Each modification of the `state` will trigger a re-render which, ultimately, update the nodes which have to be updated (and only those who have to be updated).

Still, we do have to implement the CSS selector variable. For such purpose, as briefly mentioned, we are going to use a functional component. It might work with a class component but, I feel like a functional one is well suited for the job.

```javascript
const Animate: FunctionalComponent<{index: number;}> = ({index}) => {
  return (
    <style>{`
    li:nth-child(${index}) {
      opacity: 1;
    }
  `}</style>
  );
};
```

This component renders a `style` element for the value we path as parameter, our `state`.

Finally, we have to use the functional component and, bind it to our state value. Doing so, it will be re-rendered each time its value changes.

```javascript
render() {
  return <Host>
    <Animate index={this.index}></Animate>
    <ul>
      <li>Spine</li>
      <li>Cowboy</li>
      <li>Shelving</li>
    </ul>
  </Host>
}
```

That’s already it, we were able to replicate the same component 🥳.

![](https://cdn-images-1.medium.com/max/1600/1*9DoGPKFedgsKnVMQp5wWIg.gif)

The above component in a single block of code:

```javascript
import { Component, FunctionalComponent, h, Host, Method, State } from '@stencil/core';

const Animate: FunctionalComponent<{index: number;}> = ({index}) => {
  return (
    <style>{`
    li:nth-child(${index}) {
      opacity: 1;
    }
  `}</style>
  );
};

@Component({
  tag: 'my-component',
  styles: `:host {
      display: block;
    }

    li {
      opacity: 0;
      transition: opacity 0.5s ease-out;
    }
  `,
  shadow: true,
})
export class MyComponent {

  @State()
  private index: number = 0;

  @Method()
  async next() {
    this.index = this.index === 3 ? 1 : this.index + 1;
  }

  render() {
    return <Host>
      <Animate index={this.index}></Animate>
      <ul>
        <li>Spine</li>
        <li>Cowboy</li>
        <li>Shelving</li>
      </ul>
    </Host>
  }
}
```

---

### Summary

I am honestly not sure that this article will ever find its audience, nor do I think it may be useful to someone some day but, well, I love to use that trick 😜. In addition, it was fun to develop for demo purpose the same piece of code with Vanilla JS or Stencil.

To infinity and beyond!

David
