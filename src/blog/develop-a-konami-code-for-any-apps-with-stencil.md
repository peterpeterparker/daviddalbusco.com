---
path: "/blog/develop-a-konami-code-for-any-apps-with-stencil"
date: "2020-04-19"
title: "Develop A Konami Code For Any Apps With Stencil"
description: "How to create  a Web Component with Stencil to add a Konami Code feature in any modern web applications"
tags: "#javascript #webdev #beginners #tutorial"
image: "https://daviddalbusco.com/assets/images/1*xQKl3mFjtshpfAN2gQZ4Bw.png"
canonical: "https://medium.com/@david.dalbusco/develop-a-konami-code-for-any-apps-with-stencil-bd8b11a50071"
---

![](https://daviddalbusco.com/assets/images/1*xQKl3mFjtshpfAN2gQZ4Bw.png)

_Photo by [Mohamed Nohassi](https://unsplash.com/@coopery?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I have shared 35 daily ”[One Trick A Day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context)” blog posts in a row until today, the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020.

This milestone has been postponed but even though we have to continue the effort, some small positive signs have emerged. Hopefully better days are ahead.

---

The [Konami Code](https://en.wikipedia.org/wiki/Konami_Code) is a cheat code which appeared in many Konami video games which allow(ed) players to reveal hidden features or unlock achievements while pressing a sequence of buttons on their game controller: ⬆️, ⬆️, ⬇️, ⬇️, ⬅️, ➡️, ⬅️, ➡️, 🅱️, 🅰️.

As it found a place in the popular culture, many websites or applications are nowadays using it to provide animation which are going to make us, geeks and nerds, smile 😄.

That’s why I thought that it was a good example to introduce [Stencil](https://stenciljs.com/) but a fun idea to conclude this series of articles.

![](https://daviddalbusco.com/assets/images/1*4ys6BI2a0KM10GxgnxNmpQ.gif)

---

### Get Started

To get started we create a new standalone components using the Cli.

```bash
npm init stencil
```

When prompted, select `component` as type of starter and provide `konami-code` as project name. Once over, jump into the directory and install the dependencies.

```bash
cd konami-code && npm install
```

---

### Blank Component

The starter component is created with some “hello world” type code. That’s why, to make this tutorial easier to follow, we firstly “clean it” a bit.

Note that we are not going to rename the packages and files as we would do if we would publish it to [npm](https://www.npmjs.com/) afterwards.

We edit `./src/component/my-component/my-component.tsx` to modify the attribute tag in order to use our component as `<konami-code/>` . Moreover it will also render “Hadouken!” because “Street Fighter II Turbo” put the regular code in before the initial splash screen to enable turbo up to 8 Stars ⭐.

```javascript
import { Component, h } from "@stencil/core";

@Component({
	tag: "konami-code",
	styleUrl: "my-component.css",
	shadow: true
})
export class MyComponent {
	render() {
		return <div>Hadouken!</div>;
	}
}
```

We don’t modify yet the CSS but we do modify the `./src/index.html` for test purpose and to reflect the new `tag` name.

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

		<script type="module" src="/build/konami-code.esm.js"></script>
		<script nomodule src="/build/konami-code.js"></script>
	</head>
	<body>
		<h1>Konami Code</h1>

		<p>Develop A "Konami Code" For Any Apps With Stencil</p>

		<p>Hit: ⬆️, ⬆️, ⬇️, ⬇️, ⬅️, ➡️️, ⬅️, ➡️, 🅱️, 🅰️</p>

		<konami-code></konami-code>
	</body>
</html>
```

If we run our project ( `npm run start` ), your default browser should automatically open itself at the address `http://localhost:3333` and you should be able to see the following elements rendered:

![](https://daviddalbusco.com/assets/images/1*eQHNSTCKskWew5o9IQvidg.png)

---

### Detection

Per default we are going to hide our component content and are looking to display it only if a particular sequence of keyboard keys (⬆️, ⬆️, ⬇️, ⬇️, ⬅️, ➡️, ⬅️, ➡️, 🅱️, 🅰️) are going to be hit.

Therefor we can define it in our `./src/components/my-component/my-component.tsx` as a readonly array.

```javascript
private readonly konamiCode: string[] = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA"
];
```

To listen to events, we generally register and unregister [EventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventListener). One of the cool thing of Stencil is that it makes possible to do such things by using [decorators](https://stenciljs.com/docs/events). Pretty neat to keep the code clean.

As we are interested to “track” keyboard keys, we are listening to the [keydown](https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event) event.

Moreover, to compare the list of user keys with the code sequence, we save the keys in a new array. We also take care of limiting its maximal length to the exact same length as the sequence (with `shift` we remove the first object in the array respectively the oldest key kept in memory) and are finally comparing these as `string` ( `join` parse array using the provided delimiter).

```javascript
private keys: string[] = [];

@Listen("keydown", { target: "document" })
onKeydown($event: KeyboardEvent) {
  this.keys.push($event.code);

  if (this.keys.length > this.konamiCode.length) {
    this.keys.shift();
  }

  const match = this.konamiCode.join(",") === this.keys.join(",");
}
```

At this point our layout should not change but if we would add a `console.log($event.code, match);` at the end of our listener function for demo purpose, we should be able to test our component by observing the debugger.

![](https://daviddalbusco.com/assets/images/1*wQ5VT43wJ_V_1FU1hCDfag.gif)

---

### Conditional Rendering

To render conditionally the outcome of our code, we introduce a new [state](https://stenciljs.com/docs/state) variable, which, if modified, will cause the component `render` function to be called again.

We are using it to render conditionally our message “Hadouken!”.

```javascript
import {Component, h, Listen, State} from '@stencil/core';

@Component({
  tag: "konami-code",
  styleUrl: "my-component.css",
  shadow: true,
})
export class MyComponent {
  @State()
  private match: boolean = false;

  private readonly konamiCode: string[] = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  private keys: string[] = [];

  @Listen("keydown", { target: "document" })
  onKeydown($event: KeyboardEvent) {
    this.keys.push($event.code);

    if (this.keys.length > this.konamiCode.length) {
      this.keys.shift();
    }

    this.match =
         this.konamiCode.join(",") === this.keys.join(",");
  }

  render() {
    return <div>{this.match ? "Hadouken!" : undefined}</div>;
  }
}
```

If you would test it in your browser, you should now notice that the message as per default disappear but that you are able to make it appearing as soon as you have hit the Konami code sequence 🎉.

![](https://daviddalbusco.com/assets/images/1*v9T9jbZxtk5CwbdXL54iZQ.gif)

---

### Dynamic Content

You may be interested to let users specify their own message rather “Hadouken!”. After all, maybe some would rather like to display “Shoryuken!” 😁.

That’s why we can transform our fixed text to a `<slot/>` .

```javascript
render() {
  return <div>{this.match ? <slot>Hadouken!</slot> : undefined}
         </div>;
}
```

Something I learned recently, we can provide a default value to the `<slot/>`. Doing so, if a slotted element is provided, it will be displayed, if not, the default “Hadouken!” is going to be used.

For example, `<konami-code></konami-code>` displays “Hadouken!” but `<konami-code>Shoryuken!</konami-code>` renders, well, “Shoryuken!”.

![](https://daviddalbusco.com/assets/images/1*6vLBzlgN4xZ-6xXvbdUfaw.gif)

---

### Style

Even though it does the job, our component can be a bit styled. That’s why instead of a logical render I suggest that we modify it to be `visible` or not.

We can also maybe display the message in the center of the screen.

That’s why we are introducing a [Host element](https://stenciljs.com/docs/host-element) to style the all component conditionally.

```javascript
render() {
  return <Host class={this.match ? 'visible' : undefined}>
    <div><slot>Hadouken!</slot></div>
  </Host>;
}
```

Note that the `<Host/>` element has to be imported from the `@stencil/core` .

To style the component we modify its related style `./src/components/my-component/my-components.css` . We defined our `:host` , the component, to cover the all screen and we set our message to be displayed in middle of the screen.

Because we are applying the visibility of the message through a class, set or not, on the container we add a related style `:host(.visible)` to actually display the message.

```css
:host {
	display: block;

	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1;

	visibility: hidden;
	opacity: 0;

	background: rgba(0, 0, 0, 0.8);
	transition: opacity 250ms ease-in;
}

:host(.visible) {
	visibility: inherit;
	opacity: 1;
}

div {
	position: absolute;

	top: 50%;
	left: 50%;

	transform: translate(-50%, -50%);

	color: white;
	font-size: 4rem;
}
```

If we try out our component again in the browser the result should be a bit more smooth.

![](https://daviddalbusco.com/assets/images/1*TCSHaGf7dWwmPEDxobD4XA.gif)

---

### Close The Easter Egg

Fine we have displayed smoothly an easter egg in our application if the Konami code sequence is hit but, as you may have noticed, the message remains open once displayed.

There are several possible way to handle this. One quick solution is a `click` event on the container which reset our `match` state.

```javascript
render() {
  return <Host
          class={this.match ? 'visible' : undefined}
          onClick={() => this.match = false}>
    <div><slot>Hadouken!</slot></div>
  </Host>;
}
```

Just in case, I also suggest to “block” events on the container when not active using style.

```css
:host {
	pointer-events: none;
}

:host(.visible) {
	visibility: inherit;
	opacity: 1;
}
```

We are now able to close our message with a mouse click.

![](https://daviddalbusco.com/assets/images/1*ybD_Ot6mbL3MMjuWp2B3RQ.gif)

---

### Altogether

Altogether our component contains few codes:

```javascript
import {Component, h, Listen, State, Host} from '@stencil/core';

@Component({
  tag: "konami-code",
  styleUrl: "my-component.css",
  shadow: true,
})
export class MyComponent {
  @State()
  private match: boolean = false;

  private readonly konamiCode: string[] = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  private keys: string[] = [];

  @Listen("keydown", { target: "document" })
  onKeydown($event: KeyboardEvent) {
    this.keys.push($event.code);

    if (this.keys.length > this.konamiCode.length) {
      this.keys.shift();
    }

    this.match =
         this.konamiCode.join(",") === this.keys.join(",");
  }

  render() {
    return <Host
          class={this.match ? 'visible' : undefined}
          onClick={() => this.match = false}>
      <div><slot>Hadouken!</slot></div>
    </Host>;
  }
}
```

Our style is almost as long as our component 😅.

```css
:host {
	display: block;

	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1;

	visibility: hidden;
	opacity: 0;

	background: rgba(0, 0, 0, 0.8);
	transition: opacity 250ms ease-in;

	pointer-events: none;
}

:host(.visible) {
	visibility: inherit;
	opacity: 1;

	pointer-events: all;
	cursor: pointer;
}

div {
	position: absolute;

	top: 50%;
	left: 50%;

	transform: translate(-50%, -50%);

	color: white;
	font-size: 4rem;
}
```

---

### Bonus

I also wrote a small component to display to keyboard events for the demo purpose, the first Gif of this article. If interested, here’s its code. Nothing particular regarding what we already have implemented.

The only “tricks” to be aware of are these linked to arrays. If you are manipulating one, you have to create new one to trigger a new call of the function `render` . Moreover, if it is dynamically rendered, it is safer to set a `key` attribute to each items.

```javascript
import {Component, h, Listen, State} from '@stencil/core';

@Component({
  tag: "konami-keys",
  shadow: true,
})
export class MyKeys {
  @State()
  private keys: string[] = [];

  @Listen("keydown", { target: "document" })
  onKeydown($event: KeyboardEvent) {
    this.keys = [...this.keys, $event.code];
    // 10 being the length of the Konami Code
    if (this.keys.length > 10) {
      this.keys.shift();
    }
  }

  render() {
    return this.keys.map((key: string, i: number) => {
      return <span key={i}>{this.renderKey(key)}&nbsp;</span>;
    });
  }

  private renderKey(key: string) {
    if (key=== "ArrowUp") {
      return "⬆️";
    } else if (key=== "ArrowDown") {
      return "⬇️";
    } else if (key=== "ArrowLeft") {
      return "⬅️";
    } else if (key=== "ArrowRight") {
      return "➡️";
    } else if (key=== "KeyB") {
      return "🅱️";
    } else if (key=== "KeyA") {
      return "🅰️";
    } else {
      return key;
    }
  }
}
```

---

### Summary

I am aware none of these 35 daily blog posts have helped or will help solved the current crisis. However, I hope that maybe they might help someone, somewhere, someday.

Stay home, stay safe!

David
