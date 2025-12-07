---
path: "/blog/more-jsx-for-angular-developers"
date: "2020-04-04"
title: "More JSX For Angular Developers"
description: "A follow up introduction to JSX in Stencil or React for Angular developers"
tags: "#angular #stencil #react #webdev"
image: "https://daviddalbusco.com/assets/images/1*3SoWAzehzRTddHWjP-apUg.png"
canonical: "https://medium.com/@david.dalbusco/more-jsx-for-angular-developers-9c6367b06503"
---

![](https://daviddalbusco.com/assets/images/1*3SoWAzehzRTddHWjP-apUg.png)

_Photo by [Luyi Yang](https://unsplash.com/@louieomelet?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Fifteen** days left until hopefully better days.

---

It is Saturday, I cleaned my flat, I could begin the writing of my today’s challenge blog post 😉.

Yesterday I published a brief introduction to [JSX for Angular Developers](https://daviddalbusco.com/blog/jjsx-for-angular-developers). When I was about to finish writing, I noticed that there were still some materials which can be presented, that’s why I follow up with some more information regarding [JSX](https://reactjs.org/docs/glossary.html#jsx), the syntax extension to JavaScript.

---

### Data Binding

I should have mentioned it in my yesterday’s post, but as [Angular](https://angular.io) use its own [templating syntax](https://angular.io/guide/template-syntax), the one from JSX differs a bit.

Commonly you use double braces `{{}}` to bind values or brackets `[]` to set for examples conditional classes or pass variables to a component.

```html
<div *ngIf="odd" [class.danger]="count > 1">{{count}}</div>

<app-my-component count="{{count}}"></app-my-component>
```

Meanwhile with JSX, you are going to use single braces `{}`. Furthermore we can also take advantages of the `render` or `return` functions to use, if we would like, temporary variables to make the code even a bit cleaner by avoiding some long inline expressions.

The above coded with [Stencil](https://stenciljs.com):

```javascript
render() {
  const myClass = this.count > 1 ? 'danger' : undefined;

  return <Host>
    <div class={myClass}>{this.count}</div>

    <my-component count={this.count}></my-component>
  </Host>;
}
```

Funny thing, you will not use `class` to define such in [React](https://reactjs.org) but rather `className` .

```javascript
return (
	<>
		{renderLabel()}

		<MyComponent count={props.count}></MyComponent>
	</>
);

function renderLabel() {
	const myClass = props.count > 1 ? "danger" : undefined;

	return <div className={myClass}>{props.count}</div>;
}
```

---

### Loops

Is it `in` or `of` or `let` , what’s the proper syntax of `*ngFor`? It has always been for me one of these things for which I have to think twice before being sure, what’s the proper way of writing it 😅.

```html
<p *ngFor="let value of values;">{{value}}</p>
```

While with JSX, there is not particular templating structure to remember, but rather how to use the array `map()` function.

Moreover, it is also worth to notice that if your list or collection aims to be dynamic, it is mandatory to add a `key` attribute to each entries to preserve the ordering.

Regardless if Stencil or React, beside the object reference `this` for Stencil, the code is the same.

```javascript
render() {
  return this.values.map((entry, index) => {
    return <p key={index}>{entry}</p>
  });
}
```

---

### Content Projection

Even though it is maybe not something you probably use, or at least I use, every day, it is possible to pass content to an Angular component using `ng-content` .

```html
<ng-content select="[start]"></ng-content>

<ng-content select="[end]"></ng-content>
```

Doing so, the component becomes more reusable as it is possible to use it with some more flexibility regarding its content.

```html
<app-my-component>
	<h1 start>Hello</h1>
	<h2 end>World</h2>
</app-my-component>
```

To the contrary, content projection is something you may, or at least I may, use really often with Stencil because `slot` are a core features of the Web Components.

```javascript
render() {
  return <Host>
    <slot name="start"></slot>
    <slot name="end"></slot>
  </Host>;
}
```

They can be use “anywhere”, with or without any modern frontend framework. That’s why they, Web Components, really shine to my eyes.

```javascript
<my-component>
	<h1 slot="start">Hello</h1>
	<h2 slot="end">World</h2>
</my-component>
```

In React, a common way to solve composition is done through the use of the default [special children](https://reactjs.org/docs/composition-vs-inheritance.html) prop which would allow you to pass multiple children to a component.

```javascript
import React, {ReactNode} from 'react';

interface MyProps {
    children: ReactNode;
}

const MyComponent: React.FC<MyProps> = (props: MyProps) => {

    return <>
        {props.children}
     </>;
};

export default MyComponent;
```

---

### Events

Finally, the Angular syntax expect parenthesis as declarations for events interactions.

```html
<button (click)="inc()">Increment</button>
```

JSX is to some extension closer to vanilla JavaScript as the events are prefixed with the `on` keyword followed by a function’s call. Note again, that beside `this` , the syntax is the same for both Stencil and React.

```javascript
render() {
  return <button onClick={() => this.inc()}>Increment</button>
}
```

---

### Summary

My two blog posts were really light introductions to JSX and I am pretty sure that you are eager to discover more technical details about it. That’s why I would say, give either Stencil or React a try, or even better, give them both a try as they both use the JSX syntax. It makes kind of accessible the switch from one to the other without too much pain.

Stay home, stay safe!

David
