---
path: "/blog/angular-state-management-without-rxjs-an-experiment"
date: "2020-09-14"
title: "Angular State Management Without RxJS - An Experiment"
description: "Angular state management without RxJS - An Experiment. Can it be done with the Stencil Store?"
tags: "#angular #javascript #rxjs #webdev"
image: "https://daviddalbusco.com/assets/images/1*cwU_XXxEkjzRiSXxuNYTeQ.png"
canonical: "https://medium.com/@david.dalbusco/angular-state-management-without-rxjs-an-experiment-243de024d396"
---

![](https://daviddalbusco.com/assets/images/1*cwU_XXxEkjzRiSXxuNYTeQ.png)

Implementing a state management in modern web [Angular](https://angular.io/) applications can be tricky.

There are many libraries, such [Ngrx](https://ngrx.io/), [ngxs](https://www.ngxs.io/), [Akita](https://datorama.github.io/akita/), which can be integrated to manage stores but, these are strongly opinionated and have impact on the architecture of the solution.

If we omit the concept displayed by [Jonas Bandi](https://twitter.com/jbandi) in his interesting [article](https://medium.jonasbandi.net/the-most-simple-state-management-solution-for-angular-1d32706e6f1c), a common alternative to not using 3rd party libraries, is the development of custom stores with [RxJS](https://rxjs.dev/).

In both cases, libraries or custom, RxJS is used 🤷‍.

Even though RxJS is a wonderful piece of technology, is nowadays a de facto standard when it comes to Angular development, and installed per default with almost any starter kits, it can be still opted-out.

That’s why I was interested to get to know if it would be possible to develop an Angular application using a modern state management but, **without** using RxJS.

---

### Goals

To narrow the goals of the experiment, these are those I was looking to test:

- Can a property be bind and updated in a template, without having to write extra code or trigger the change detection, as it would be solved with an observable?
- Can store’s values be accessed in different routes?
- Can store’s values be retrieved in child components?
- Can store’s values be used in providers?
- Is it easy to integrate it in unit tests?

Let’s try to answer these questions, but first, let setup another kind of state management.

---

### Stencil Store

> The [@stencil/store](https://github.com/ionic-team/stencil-store) is a lightweight shared state library by the [StencilJS](https://stenciljs.com/) core team. It implements a simple key/value map that efficiently re-renders components when necessary.

![](https://daviddalbusco.com/assets/images/1*QE-QFGXyHgVLowWutgUA5A.gif)

I use it in our web open source editor for presentations, [DeckDeckGo](https://deckdeckgo.com), and I have to admit, I kind of have a crush for this lightweight store. It is so bare minimum simple, and effective, I obviously selected it to perform my experiment.

Even though it would work out of the box with Angular, note that I had to create a [fork](https://github.com/peterpeterparker/stencil-store). The Webpack’s build was complaining about it and, since we do not need this requirement in case of an Angular usage, I just removed it.

If I, or anyone, would use it for a real application, the library dependency could be patched easily I am guessing.

---

### Source Code

Before going further, note that this experiment’s source code is available on [GitHub](https://github.com/peterpeterparker/angular-store-demo).

---

### Setup

To set up for such a store for an application, we can create a new TypeScript file, such as `clicks.store.ts` , and use the `createStore` function exposed by the Stencil Store.

```javascript
import { createStore } from "@stencil/store";

const { state } = createStore({
	clicks: 0
});

export default { state };
```

That’s it. It is the minimum to expose a global `clicks` store for an app.

Because I was eager to give a try to the few other features of the store, I also added the usage of the functions `onChange` , to test if property listening to changes would also be re-rendered, and the `dispose` feature needed for testing purpose.

```javascript
import { createStore } from "@stencil/store";

const { state, onChange, reset, dispose } = createStore({
	clicks: 0,
	count: 0
});

onChange("clicks", (value) => {
	state.count = value * 2;
});

export default { state, dispose };
```

Pretty slim in my humble opinion 😉.

It is also worth to notice that it is possible to create as many stores as we would need.

---

### #1: Property Binding And Re-render

I tried different ways to use the properties of the store in the templates and, figured out that the easiest way was to bind the `state` with a component’s variable.

```javascript
import { Component } from "@angular/core";

import store from "../../stores/clicks.store";

@Component({
	selector: "app-page1",
	templateUrl: "./page1.component.html",
	styleUrls: ["./page1.component.css"]
})
export class Page1Component {
	state$$ = store.state;
}
```

It can then be use in a template to display the values of the store.

```html
<p>Clicks: {{state$$.clicks}}</p>

<p>Count: {{state$$.count}}</p>
```

Does it get re-rendered, when the store changes?

To try out this hypothesis, I added a function to the component, which increments the `clicks`.

```javascript
inc() {
  store.state.clicks++;
}
```

Therefore, if everything works as expected, each time I would call the above function, the `clicks` should be incremented and displayed. Because I registered an `onChange` on such property, the `count` should be actualized with twice the value.

![](https://daviddalbusco.com/assets/images/1*8b1SV-obHx5L-N0dMEfOFg.gif)

**Success** ✅

It exactly behaves as expected. Store properties are modified and, the layout is re-rendered. In addition, I did not have to implement any custom change detection calls or what so ever.

---

### #2: Routes

The second question I was looking to answer, was related to sharing data between routes. To answer it, I created another page component, added it to the routing and used the store exactly in the same way as previously.

```javascript
import { Component } from "@angular/core";

import store from "../../stores/clicks.store";

@Component({
	selector: "app-page2",
	template: `<h1>Page 2</h1>
		<p>Clicks: {{ state$$.clicks }}</p>
		<p>Count: {{ state$$.count }}</p>`
})
export class Page2Component {
	state$$ = store.state;
}
```

If this would work out, once I would navigate, I would find the exact same value in each page without having to implement anything else respectively without the need to pass values between routes.

![](https://daviddalbusco.com/assets/images/1*G-kIoh5UTY9rSAq8bKWWpw.gif)

**Success** ✅

Indeed, stores data can be shared between routes.

---

### #3: Components

Likewise, instead of routes, are data accessible from a component?

To test this hypothesis, I refactored the `page2` to move the code to a separate component `card` .

```javascript
import { Component } from "@angular/core";

import store from "../../stores/clicks.store";

@Component({
	selector: "app-card",
	template: `<p>Clicks: {{ state$$.clicks }}</p>
		<p>Count: {{ state$$.count }}</p>`,
	styleUrls: ["./card.component.css"]
})
export class CardComponent {
	state$$ = store.state;
}
```

I then used it in `page2` . Note that doing so, this component, page, does not have to include the store anymore.

```javascript
import { Component } from "@angular/core";

@Component({
	selector: "app-page2",
	template: `<h1>Page 2</h1>
		<app-card></app-card>`
})
export class Page2Component {}
```

As for previous test, this would be validated, if values would be displayed and updated even if use in a child component.

![](https://daviddalbusco.com/assets/images/1*tKYc1DwBsGcrUU_x4Q8Apg.gif)

**Success** ✅

As previously, it works as expected.

---

### #4: Services

I was asking my self if data could also be used in `providers` , therefore I added a service to test this specific question.

```javascript
import { Injectable } from "@angular/core";

import store from "../stores/clicks.store";

@Injectable({
	providedIn: "root"
})
export class AlertService {
	show() {
		alert(`Count: ${store.state.count}`);
	}
}
```

If I call the service’s function, an alert should be triggered and the current `count` value of the store should be displayed.

![](https://daviddalbusco.com/assets/images/1*-KQgSKTCDBWsW7y9jW8ZlA.gif)

**Success** ✅

Providers have access to the store.

---

### #5: Test

In addition to the runtime, I was also curious about the integration in unit tests. Probably even more than the integration in applications, the usage of stores and RxJS in tests can be also tricky.

Therefore, I created a test which should increment the `clicks` and validate that the value has, well, been incremented.

```javascript
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page1Component } from './page1.component';

import store from '../../stores/clicks.store';

describe('Page1Component', () => {
  let component: Page1Component;
  let fixture: ComponentFixture<Page1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Page1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    store.dispose();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment', () => {
    component.inc();

    fixture.detectChanges();

    const paragraph =
          fixture.nativeElement.querySelector('p:first-of-type');

    expect(paragraph.textContent).toEqual('Clicks: 1');
  });
});
```

If this would be correct, the test should pass.

![](https://daviddalbusco.com/assets/images/1*xumQL55FR4t0S9XCU0spqA.png)

![](https://daviddalbusco.com/assets/images/1*PsZJK-IrkOwtSWGRCmNbNQ.png)

**Success** ✅

It is possible to use the store in unit tests and thus, without any particular headache. It works in tests the same manner as it work when used in the application.

---

### Summary

All hypothesis, re-rendering data, accessing these and testing the store were a success ✅.

![](https://daviddalbusco.com/assets/images/1*KE-3sINtqGTzJ4JgEcw0yA.gif)

---

### Considerations

The scope of this experiment was to some extension, limited and, it might need a bit more analysis before being applied to a real life application. I think in particular at the following questions:

- Would it be possible to scope the store, not to the root, but to a particular module? Even though providers provided in `root` are often used, I think, it would be a nice add-on.
- How does the rendering performs with a lot of nodes contained in the store? My spontaneous guess is that it behaves exactly like it would behave with or without any other stores but, it is probably worth a try to go a step further and try to render a lot of information.
- What’s the cost of the Stencil Store in comparison to any other libraries based on RxJS or RxJS itself. If I would have to bet right now, I would bet on the fact that the Stencil Store is maybe the lightest. According [bundlephobia](https://bundlephobia.com/result?p=@stencil/store@1.3.0), it costs only 899 bytes (minified + gzipped) 🤯.
- Stencil is server side rendering (SSR) and pre-rendering [compatible](https://stenciljs.com/docs/static-site-generation-server-side-rendering-ssr). Therefore, as the store has been developed in first place for such technology, I am guessing that it would be also the case with Angular. However, this would have to be tested too.

If you are interested in these questions, let me know. I would love to hear from you, to get your feedbacks and would be happy to continue the experiment 😃.

---

### Take Away

Honestly? I am that close to find a new idea of application, just to try out concretely the Stencil Store in a modern web Angular application. There is often no better way to experiment, than developing a real application.

To infinity and beyond!

David

---

Reach me out on [Twitter](https://twitter.com/daviddalbusco) and, why not, give a try to [DeckDeckGo](https://deckdeckgo.com) for your next presentations!

It deploys your decks online as Progressive Web Apps and can even push your slides’ source code to GitHub.
