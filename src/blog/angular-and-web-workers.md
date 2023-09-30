---
path: "/blog/angular-and-web-workers"
date: "2020-04-15"
title: "Angular And Web Workers"
description: "How to integrate Web Workers to your Angular applications"
tags: "#angular #javascript #showdev #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*0EDeEWFc3O8KxelyJArjjA.png"
canonical: "https://medium.com/@david.dalbusco/angular-and-web-workers-17cd3bf9acca"
---

![](https://cdn-images-1.medium.com/max/1600/1*0EDeEWFc3O8KxelyJArjjA.png)

_Photo by [Darya Tryfanava](https://unsplash.com/@darya_tryfanava?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Four** days left until this first milestone. Hopefully better days are ahead.

---

It has been a long time since the last time [Angular](https://angular.io/) did not make me say out at loud “Wow, that’s pretty neat”, but today was the day again!

Together with my client’s colleagues we had a new requirement which had to do with [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). For such purpose we notably had to clear the data. As many entries can have been stored, such process can take a while and it was important to not block the UI and the user interaction.

That’s why we developed our feature using [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and why I am sharing this new blog post.

---

### Adding A Web Worker

The Angular team made an outstanding job. Their CLI integration works seamlessly and the [documentation](https://angular.io/guide/web-worker) is straight forward.

To add a Web Worker, we run the command `ng generate web-worker` followed by the target location, most commonly our `app` .

```bash
ng generate web-worker app
```

The command will take care of adding a new [TypeScript](https://www.typescriptlang.org/) compiler configuration for our worker but will also generate a sample and its usage within the app.

The sample will find place in `./src/app/app.worker.ts` . It contains the TypeScript reference and register a listener which can be called to start its work in the worker thread.

```javascript
/// <reference lib="webworker" />

addEventListener("message", ({ data }) => {
	const response = `worker response to ${data}`;
	postMessage(response);
});
```

Its usage will be added to `./src/app/app.component.ts` . It tests if workers are supported and if yes, build a new object and call the worker respectively instructs it to start its job.

```javascript
if (typeof Worker !== "undefined") {
	// Create a new
	const worker = new Worker("./app.worker", { type: "module" });
	worker.onmessage = ({ data }) => {
		console.log(`page got message: ${data}`);
	};
	worker.postMessage("hello");
} else {
	// Web Workers are not supported in this environment.
	// You should add a fallback so that your program still executes correctly.
}
```

---

### Refactor

In order to use this worker, there is a good chance that we might want to refactor it. I personally like to group my workers in a subfolder `./src/app/workers/` . I do not know if it is a best practice or not, but a bit like the services, I think it is cool.

Moreover, we may have more than workers in our app. That’s why I also suggest to rename it, for example, let’s call it `hello.worker.ts` .

In the same way, we might want to call the worker from a `service` and not from `app.component.ts` .

Note that in the following example I also rename the worker and modify the relative path to point to the correct location.

```javascript
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class HelloService {
	async sayHello() {
		if (typeof Worker !== "undefined") {
			const worker = new Worker("../workers/hello.worker", { type: "module" });

			worker.onmessage = ({ data }) => {
				console.log(`page got message: ${data}`);
			};

			worker.postMessage("hello");
		}
	}
}
```

Finally, in order to be able to run a test, I call my service from the main page of my application.

```javascript
import {Component, OnInit} from '@angular/core';

import {HelloService} from './hello.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private helloService: HelloService) {
  }

  async ngOnInit() {
    await this.helloService.sayHello();
  }

}
```

All set, we can try to run a test. If everything goes according plan, you should be able to discover a message in the console which follow the exchange between the app and the worker.

![](https://cdn-images-1.medium.com/max/1600/1*YJ9O5OKJO2ZWHSYbVOrmww.png)

---

### Simulate A Blocked User Interface

We might like now to test that effectively our worker is performing a job that is not blocking the UI.

I displayed such a test in a previous article about [React and Web Worker](https://daviddalbusco.com/blog/react-and-web-workers), that’s why we kind of follow the same idea here too. We create two buttons, once which increment “Tomato” using the JavaScript thread and ultimately one which increment “Apple” using a worker thread. But first, let’s do all the work in the JavaScript thread.

In our main template we add these two buttons and link these with their related functions. We also display two labels to show their current values.

```html
<ion-content [fullscreen]="true">
	<ion-label> Tomato: {{countTomato}} | Apple: {{countApple}} </ion-label>

	<div className="ion-padding-top">
		<ion-button (click)="incTomato()" color="primary">Tomato</ion-button>

		<ion-button (click)="incApple()" color="secondary">Apple</ion-button>
	</div>
</ion-content>
```

We also implement these states and functions in our main component. Moreover we are adding explicitly a custom delay in our function `incApple()` in order to simulate a blocking UI interactions.

```javascript
import {Component, OnInit} from '@angular/core';

import {HelloService} from '../services/hello.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private countTomato = 0;
  private countApple = 0;

  constructor(private helloService: HelloService) {
  }

  async ngOnInit() {
    await this.helloService.sayHello();
  }

  incTomato() {
    this.countTomato++;
  }

  incApple() {
    const start = Date.now();
    while (Date.now() < start + 5000) {
    }
    this.countApple++;
  }

}
```

If you would test the above in your browser you would effectively notice that as long the “Apple” counter is not resolved, the GUI will not be rendered again and therefor will not been updated.

![](https://cdn-images-1.medium.com/max/1600/1*OTDF80thurZxQLMwbHtvTA.gif)

---

### Defer Work With Web Workers

Let’s now try to solve the situation by deferring this custom made delay to our worker thread.

---

#### Web Workers

We move our blocker code to our `hello.worker` and we also modify it in order to use the `data` as input for the current counter value.

```javascript
/// <reference lib="webworker" />

addEventListener("message", ({ data }) => {
	const start = Date.now();
	while (Date.now() < start + 5000) {}

	postMessage(data + 1);
});
```

---

#### Services

To pass data between services and components you can of course either use [RxJS](https://rxjs-dev.firebaseapp.com/) or any other global store solution but for simplicity reason I have use a callback to pass by the result from the web worker to our component state.

What it does is creating the worker object and registering a listener `onmessage` which listen to the result of the web worker and call our callback with it. Finally it calls the worker to start the job with `postMessage` and provide the current counter as parameter.

```javascript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelloService {

  async countApple(counter: number,
                   updateCounter: (value: number) => void) {
    if (typeof Worker !== 'undefined') {
      const worker =
          new Worker('../workers/hello.worker', { type: 'module' });

      worker.onmessage = ({ data }) => {
        updateCounter(data);
      };

      worker.postMessage(counter);
    }
  }
}
```

---

#### Component

Our service has changed, that’s why we have to reflect the modification in the component. On the template side nothing needs to be modified but on the code side we have to use the new exposed function `countApple` from the service and have to provide both current “Apple” counter value and a callback to update this
state once the worker will have finish its computation.

```javascript
import {Component} from '@angular/core';

import {HelloService} from '../services/hello.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private countTomato = 0;
  private countApple = 0;

  constructor(private helloService: HelloService) {
  }

  incTomato() {
    this.countTomato++;
  }

  async incApple() {
    await this.helloService.countApple(this.countApple,
               (value: number) => this.countApple = value);
  }

}
```

If you would run the example in your browser you should be able to notice that our interaction and UI aren’t blocked anymore, tada 🎉.

![](https://cdn-images-1.medium.com/max/1600/1*IEjanj7fsFvpvcXGbFSzsg.gif)

---

### Cherry On Top

You know what’s really, but really, cool with this Angular Web Worker integration? You can use your dependencies in your worker too!

For example, if your application is using [idb-keyval](https://github.com/jakearchibald/idb-keyval), you can import it and use it in your worker out of the box, no configuration needed.

```javascript
/// <reference lib="webworker" />

import { set } from "idb-keyval";

addEventListener("message", async ({ data }) => {
	await set("hello", "world");

	postMessage(data);
});
```

---

### Summary

I like Web Workers 😸

Stay home, stay safe!

David
