---
path: "/blog/create-a-react-custom-hooks-for-your-web-components"
date: "2020-02-12"
title: "Create A React Custom Hooks For Your Web Components"
description: "How to create a React custom hooks to bind your Web Components events with useEffect"
tags: "#react #javascript #tutorial #webdev"
image: "https://daviddalbusco.com/assets/images/1*5KdZblpLM1bckDE3zr4kFA.jpeg"
canonical: "https://medium.com/@david.dalbusco/create-a-react-custom-hooks-for-your-web-components-f4319bb4bc35"
---

![](https://daviddalbusco.com/assets/images/1*5KdZblpLM1bckDE3zr4kFA.jpeg)

_Photo by [Tamara Gore](https://unsplash.com/@thenightstxlker?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

When I walk up this morning, I said to myself: “Look David, now is the day, you should try to develop a [React](https://reactjs.org) custom hooks”.

The experiment went well and was implemented faster than I expected, therefore I thought I could take some time to write about it 😁.

### Introduction

Web Components are working everywhere, period. That being said, when used in React, the implementation tends to become a bit more verbose, notably because `events` have to be attached “manually”. For example, you would not be able **out of the box** with a [Stencil](https://stenciljs.com) Web Component to do the following.

```javascript
<my-component onMyEvent={($event) => console.log($event)}></my-component>
```

To overcome this issue, you could bundle your Web Component with their related output targets using the [stencil-ds-plugins](https://github.com/ionic-team/stencil-ds-plugins) and the problem is solved. But if you don’t, or can’t, then you have to manually register event listeners which, as I said above, could quickly become a bit verbose.

```javascript
const ref = useRef();

ref.current.addEventListener("myEvent", ($event) => console.log($event));

<my-component ref={ref}></my-component>;
```

Fortunately, it is possible to create custom hooks and therefore possible to create reusable pieces of code for our application to make it more readable.

### Let’s Get Started

For the purpose of this article we are going to start with the very begin, by creating a new React app.

```bash
npx create-react-app custom-hook-app
cd custom-hook-app
```

We want to experiment Web Component, let’s now install one to our application. For example, we can use the [color picker](https://docs.deckdeckgo.com/components/color) of our web open source editor for presentations, [DeckDeckGo](https://deckdeckgo.com).

```bash
npm install @deckdeckgo/color
```

Once installed, we can `import` and declare it in you application respectively in `src/App.js` .

```javascript
import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { defineCustomElements } from "@deckdeckgo/color/dist/loader";
defineCustomElements(window);

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<deckgo-color></deckgo-color>

				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
```

If everything went according plan, once we run (`npm run start` ) our application, the default sample page with our color picker should be rendered.

![](https://daviddalbusco.com/assets/images/1*UkXaxAlAOLW955WUmaLm2g.gif)

### Implement The Events Listener

Before creating our custom hooks, let’s first implement the events listener as we would do without it. We create a reference `useRef` for our component and a `state` to render the selected color.

```javascript
const colorRef = useRef();

const [color, setColor] = useState();

return (
	<div className="App">
		<header className="App-header">
			<deckgo-color ref={colorRef}></deckgo-color>

			<img src={logo} className="App-logo" alt="logo" style={{ background: color }} />
		</header>
	</div>
);
```

Finally, to attach the events, we use the hooks `useEffect` to bind these when our component’s reference is ready.

```javascript
useEffect(() => {
	const ref = colorRef.current;

	const colorListener = ($event) => {
		// $event.detail.hex is the selected color
		setColor($event.detail.hex);
	};

	// attach the event to the component
	ref.addEventListener("colorChange", colorListener, false);

	// remove event on component unmount
	return () => {
		ref.removeEventListener("colorChange", colorListener, true);
	};
}, [colorRef]);
```

I’m agree, not the best UX I ever developed 🤣, but still, we should now be able to select colors and apply them to the background of the React logo.

![](https://daviddalbusco.com/assets/images/1*sCVKl0QyIYWC0quTalcgzg.gif)

### Create A Custom Hooks

Time to have fun by refactoring our previous implementation in order to create a custom hooks. Firstly, we create a function, the hooks itself, which takes the reference to the component as parameter, contains and return a new state.

```javascript
function useColorChange(paramColorRef) {
	const [data, setData] = useState(undefined);

	return [data];
}
```

To complete our hooks, we move our previous `useEffect` code to this new hooks and we adjust the component states to the hooks states. The effect watches the reference passed as parameters and the listener applies the selected color to the hooks state.

```javascript
function useColorChange(paramColorRef) {
	const [data, setData] = useState(undefined);

	useEffect(() => {
		const ref = paramColorRef.current;

		const colorListener = ($event) => {
			setData($event.detail.hex);
		};

		ref.addEventListener("colorChange", colorListener, false);

		return () => {
			ref.removeEventListener("colorChange", colorListener, true);
		};
	}, [paramColorRef]);

	return [data];
}
```

Finally, we use our hooks in our application respectively we replace the previous `useState` and `useEffect.`

```javascript
function App() {
	const colorRef = useRef();

	const [color] = useColorChange(colorRef);

	return (
		<div className="App">
			<header className="App-header">
				<deckgo-color ref={colorRef}></deckgo-color>

				<img src={logo} className="App-logo" alt="logo" style={{ background: color }} />
			</header>
		</div>
	);
}
```

Voilà, isn’t that a cleaner code and pretty cool? And of course, if we redo our test, it should still work out, we should still be able to select a color and apply it to the background of the React logo 😸.

![](https://daviddalbusco.com/assets/images/1*xZ8UwUQcpfn_15YDwmekew.gif)

### Conclusion

I don’t pretend that the above implementation is the best one, my goal was to try to build a React custom hooks out and to share a comprehensive step by step blog post. I’m pretty sure it could be improved and I would be super duper happy to hear your suggestions about it, ping me with your comments!

To infinity and beyond 🚀

David
