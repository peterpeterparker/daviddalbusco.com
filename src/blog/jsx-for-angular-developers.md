---
path: "/blog/jsx-for-angular-developers"
date: "2020-04-03"
title: "JSX For Angular Developers"
description: "A brief introduction to JSX in Stencil or React for Angular developers"
tags: "#angular #stencil #react #webdev"
image: "https://daviddalbusco.com/assets/images/1*GcEjTmqI8Rq_tPJGMywfnw.png"
canonical: "https://medium.com/@david.dalbusco/jsx-for-angular-developers-23f9d1f21259"
---

![](https://daviddalbusco.com/assets/images/1*GcEjTmqI8Rq_tPJGMywfnw.png)

_Photo by [Maël Renault](https://unsplash.com/@maelrenau?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Sixteen** days left until hopefully better days.

---

At first I wasn’t that much a fan of the [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) syntax when I discovered it while developing my first Web Components with [Stencil](https://stenciljs.com). I was missing the [Angular](https://angular.io) HTML templates.

Nowadays? I might change my mind in the future again, but after having developed such an eco-system as [DeckDeckGo](https://deckdeckgo.com) and having even learned [React](https://reactjs.org), I can definitely say that I actually feels all the contrary, I love JSX ❤️. Even probably more these days as I am developing Angular clients’ projects on a weekly basis.

That’s why I had this idea to write a really brief and I hope beginner friendly introduction to JSX as used in Stencil or React for Angular developers.

---

### JSX vs HTML Templates

If you write an Angular application, **commonly** you are going to separate your components in layers and even probably three separate files: the code (TypeScript), the style (CSS) and the template (HTML, the GUI).

```javascript
import { Component } from "@angular/core";

@Component({
	selector: "app-my-component",
	templateUrl: "./my-component.component.html",
	styleUrls: ["./my-component.component.scss"]
})
export class MyComponentComponent {}
```

And the related template:

```html
<div>Hello, World!</div>
```

With JSX, regardless if Stencil or React, you have this separation of concern too but you are not going to separate your template and code in two separate files. Everything is commonly packed in on file, even in a same `class` or `function` .

The separation of concern occurs on the code side. If you have a `class` , you will have to expose a method `render()` which returns what suppose to be, guess what, rendered. In short: “a method which renders your HTML code”.

```javascript
import { Component, h } from "@stencil/core";

@Component({
	tag: "my-component",
	styleUrl: "my-component.css"
})
export class MyComponent {
	render() {
		return <div>Hello, World!</div>;
	}
}
```

If you have a `function` , then instead of `render` you will have a `return` method which follows the same behavior.

```javascript
import React from 'react';

const MyComponent: React.FC = () => {

    return (
        <div>Hello, World!</div>
    );
};

export default MyComponent;
```

Both Stencil and React do support `class` or `function` . These last type became or are becoming, I think, really popular in React thanks to the use and introduction of `Hooks` , which I am not going to cover in this article. If you are interested in a separate post about it, ping me! I still have many posts to write to fulfill my challenge 😆.

Note also that for the rest of this article, I will display the Stencil examples using `class` and the React one using `functions` .

---

### Root Element

One important difference is the notion of root element. In Angular, you don’t really care about if. If your template contains a single root element or multiple ones, it compiles in any case.

```html
<div>Hello, World!</div>

<div>
	<p>Salut</p>
	<p>Hallo</p>
</div>
```

In JSX, to the contrary, it does matter. Your component should be developed to handle such cases.

Therefore, our first solution might be to group our children under a single HTML node.

```javascript
import { Component, h } from "@stencil/core";

@Component({
	tag: "my-component",
	styleUrl: "my-component.css"
})
export class MyComponent {
	render() {
		return (
			<div>
				<div>Hello, World!</div>

				<div>
					<p>Salut</p>
					<p>Hallo</p>
				</div>
			</div>
		);
	}
}
```

That would work out but this would result on adding a not needed `div` tag, the parent one, to our DOM. That’s why both Stencil and React have their respective similar solution to this problem.

In Stencil you can use a `Host` element.

```javascript
import { Component, h, Host } from "@stencil/core";

@Component({
	tag: "my-component",
	styleUrl: "my-component.css"
})
export class MyComponent {
	render() {
		return (
			<Host>
				<div>Hello, World!</div>

				<div>
					<p>Salut</p>
					<p>Hallo</p>
				</div>
			</Host>
		);
	}
}
```

And in React you can use what is called a [Fragment](https://reactjs.org/docs/fragments.html).

```javascript
import React from 'react';

const MyComponent: React.FC = () => {

    return (
        <>
            <div>Hello, World!</div>

            <div>
                <p>Salut</p>
                <p>Hallo</p>
            </div>
        </>
    );
};

export default MyComponent;
```

Finally, in Stencil, if you rather like not to use such container, you can return an `array` of elements. But I feel like, mostly for styling reason, that I used the above solution more often so far.

```javascript
import { Component, h } from "@stencil/core";

@Component({
	tag: "my-component",
	styleUrl: "my-component.css"
})
export class MyComponent {
	render() {
		return [
			<div>Hello, World!</div>,
			<div>
				<p>Salut</p>
				<p>Hallo</p>
			</div>
		];
	}
}
```

---

### States And Properties

In Angular `public` variables are these used in the templates and for which any changes are triggering a new rendering (“the changes are applied to the GUI”).

Variables made `private` are these which are used internally in the component and for which, no new rendering is needed.

Moreover there is also the [Input](https://angular.io/api/core/Input) decorator which is used to expose a variable as property of the component.

```javascript
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponentComponent {

  @Input()
  count = 0;

  odd = false;

  private even = false;

  inc() {
    // Render again
    this.count++;
    this.odd = this.count % 2 === 1;

    // Do not trigger a new render
    this.even = this.count % 2 === 0;

}
```

And corresponding template:

```html
<div>Hello, World!</div>
<div>{{odd}} {{count}}</div>
```

In JSX, you find the same approach but kind of split in two categories, `state` and `properties` , for which, any changes will trigger a new render of the component. On the other side, if you have a variable which is neither one of these, then no render will be triggered again.

`properties` are kind of the corresponding idea to the `@Input()` fields, these are the exposed properties of the components.

`states` are kind of Angular `public` variables which have not been marked as inputs.

Concretely in Stencil you use `decorator` for such purpose.

```javascript
import {Component, h, Host, Prop, State} from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css'
})
export class MyComponent {

  @Prop()
  count = 0;

  @State()
  private odd = false;

  even = false;

  inc() {
    // Render again
    this.count++;
    this.odd = this.count % 2 === 1;

    // Do not trigger a new render
    this.even = this.count % 2 === 0;
  }

  render() {
    return <Host>
        <div>{this.odd} {this.count}</div>
      </Host>
    ;
  }

}
```

While in React functions you are going to use `hooks` to handle states and `interfaces` to declare your properties.

```javascript
import React, {useEffect, useState} from 'react';

interface MyProps {
    count: number;
}

const MyComponent: React.FC<MyProps> = (props: MyProps) => {

    const [odd, setOdd] = useState<boolean>(false);
    let even = false;

    useEffect(() => {
        // Render again
        props.count++;
        setOdd(props.count % 2 === 1);

        // Do not trigger a new render
        even = props.count % 2 === 0;
    }, [props.count]);

    return (
        <>
            <div>{odd} {props.count}</div>
        </>
    );
};

export default MyComponent;
```

I now, I said I won’t cover hooks in this article, therefore let just summarize these as asynchronous functions, which observe or apply a change to a variable and in case of the hook dedicated to states, `useState` , trigger a new rendering if a change is applied to the observed variable.

---

### Conditional Rendering

Angular exposes is own tags which have to be use in the templates to perform any logical operations, notably `*ngIf` for conditional rendering.

```html
<div>Hello, World!</div>

<div *ngIf="odd">{{count}}</div>
```

One beauty of JSX is that you are not developing in a template, therefore you are using statements as you would do writing code.

In brief, a `if` is a `if` 😉.

Only important thing to remember about conditional rendering: always return something! That’s why, if you do not want to render anything, I suggest to return `undefined` which will have for effect to add nothing to the DOM.

With Stencil:

```javascript
render() {
  return <Host>
    {
      this.odd ? <div>{this.odd} {this.count}</div> : undefined
    }
  </Host>;
}
```

Or with React:

```javascript
return (
	<>
		{odd ? (
			<div>
				{odd} {props.count}
			</div>
		) : undefined}
	</>
);
```

Moreover, you can either inline your condition as above or use it wisely in split render methods.

As in this Stencil example:

```javascript
render() {
  return <Host>
    {this.renderLabel()}
  </Host>;
}

private renderLabel() {
  return this.odd ? <div>{this.odd} {this.count}</div> : undefined;
}
```

Or again in this React one:

```javascript
return <>{renderLabel()}</>;

function renderLabel() {
	return odd ? (
		<div>
			{odd} {props.count}
		</div>
	) : undefined;
}
```

---

### Summary

There is so much left to say and to describe, but unfortunately I have to rush to make steps forwards in a useful, particularly in these special days, mobile application I am developing for a client.

If this appetizer made you eager to know more about JSX from an Angular point of view, let me know. I would be really happy to develop it further in several blog posts. And Like I said, I still got some more in order to accomplish my challenge 😃.

Stay home, stay safe!

David
