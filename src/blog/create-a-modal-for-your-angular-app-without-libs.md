---
path: "/blog/create-a-modal-for-your-angular-app-without-libs"
date: "2020-03-30"
title: "Create A Modal For Your Angular App Without Libs"
description: "How to create a modal for your application developed with Angular without the use of any libraries or dependencies"
tags: "#angular #webdev #javascript #css"
image: "https://cdn-images-1.medium.com/max/1600/1*xNE1YF5sWgrqysu1GqwUNA.png"
canonical: "https://medium.com/@david.dalbusco/create-a-modal-for-your-angular-app-without-libs-671bd7280867"
---

![](https://cdn-images-1.medium.com/max/1600/1*xNE1YF5sWgrqysu1GqwUNA.png)

*Photo by [Roger Burkhard](https://unsplash.com/@roger_burkhard?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty** days left until hopefully better days.

*****

The other day we were building a quick proof of [Angular](https://angular.io) concept with one of my client’s teammate for which we had to display something in a modal. Instead of installing and using some design libraries to solve this requirement, I estimated that it would need almost the same effort to create quickly one (I was not wrong on that one).

Yesterday I [shared another solution](https://daviddalbusco.com/blog/create-a-menu-for-your-gatsby-website-without-libs) to create a custom menu for a [Gatsby](https://www.gatsbyjs.org) website without any dependencies and that’s why I had the idea today to share the following tutorial.

![](https://cdn-images-1.medium.com/max/1600/1*s0eN_t22IJLbosGLHblfiw.gif)

*****

### Service

The modal has two states: `open` and `close` . That’s why, before anything else, we create a `service` using the Angular CLI (command: `ng g service modal)` which we are going to use across our application to trigger either its opening or closing.

```javascript
import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private display: BehaviorSubject<'open' | 'close'> = 
                   new BehaviorSubject('close');

  watch(): Observable<'open' | 'close'> {
    return this.display.asObservable();
  }

  open() {
    this.display.next('open');
  }

  close() {
    this.display.next('close');
  }
}
```

Note that at the end of the day, you can use a `boolean` or an `enum` if you rather like, or a `Subject` instead of `BehaviorSubject` . What does matter is to be able to maintain the two states of the modal.

*****

### Modal

We create a new component for our modal using the Angular CLI (`ng c component modal` ).

*****

#### Code

The component code contains a variable, an Observable which we instantiate to watch out the state of the modal, and exposes a function which we can use to close the modal.

```javascript
import {Component, OnInit} from '@angular/core';

import {Observable} from 'rxjs';

import {ModalService} from '../modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  display$: Observable<'open' | 'close'>;

  constructor(
      private modalService: ModalService
  ) {}

  ngOnInit() {
    this.display$ = this.modalService.watch();
  }

  close() {
    this.modalService.close();
  }
}
```

*****

#### Template

In the container we define a `section` to cover the all screen when the modal is opened and we define a child, a `div` , to constrain our modal to a certain size.

Note that I stop the event propagation on the container just in case you would like to add some actions inside the modal, for example a form with a submit button.

```html
<ng-container *ngIf="display$ | async as display">
  <section [class.open]="display === 'open'"
           (click)="close()">
    <div (click)="$event.stopPropagation()">
      <button class="close"
              type="button" 
              (click)="close()">X</button>

      <h1>Hello World</h1>
    </div>
  </section>
</ng-container>
```

*****

#### Style

To make the modal appears smoothly we use a brief `transition` on the property `opacity` . We also define some `box-shadow` and and `background` for the backdrop to make thing just a bit styled.

```sass
section {
  visibility: hidden;
  opacity: 0;

  &.open {
    visibility: inherit;
    opacity: 1;
  }

  display: block;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: rgba(0, 0, 0, 0.2);
  transition: opacity 250ms ease-in;

  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    height: 200px;
    width: 300px;

    background: white;
    padding: 64px;

    border-radius: 8px;

    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);
  }

  button.close {
    background: none;
    color: inherit;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: none;

    position: absolute;
    top: 0;
    left: 0;

    padding: 16px;
  }
}
```

*****

#### Declaration

For simplicity reason I didn’t created a module to load the modal but if you would follow this tutorial for a real life application, I would advise you to do so in order to lazy load it. Meanwhile, in this blog post, we add our component to the `declarations` of our main module `app.module.ts.` 

```javascript
@NgModule({
  declarations: [AppComponent, ModalComponent],
  ...
})
export class AppModule {}
```

Additionally, we also use our component in our template only once for our all application, as we only manage a single instance and state, for example in `app.component.html` .

```html
<router-outlet></router-outlet>

<app-modal></app-modal>
```


### Usage

We are set, everything is developed, we just need now to effectively test it. That’s why we add a `button` to our app which triggers the modal opening.

For example, we can declare a new function `open()` in one of our component in which we are looking to trigger the modal opening.

```javascript
import {Component} from '@angular/core';

import {ModalService} from '../modal.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
      private modalService: ModalService
  ) {}

  open() {
    this.modalService.open();
  }

}
```

And link the method in the related template.

```html
<button (click)="open()">
  <h2>Open</h2>
</button>
```

That’s it, nothing more, nothing less, we have developed a custom modal for our application without any JavaScript dependencies 😁.

*****

### Summary

Of course out of the box, a quickly custom made modal isn’t the most beautiful one you ever used or saw, but to me, what’s important to communicate is probably the fact that we don’t have always to rely on dependencies. The path is probably Peter Quill’s one, a bit of both 😉.

Stay home, stay safe!

David
