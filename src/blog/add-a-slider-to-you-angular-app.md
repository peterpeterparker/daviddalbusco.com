---
path: "/blog/add-a-slider-to-you-angular-app"
date: "2020-03-31"
title: "Add A Slider To You Angular App"
description: "Use our core Web Component to add a slider to your application developed with Angular"
tags: "#angular #webdev #javascript #showdev"
image: "https://cdn-images-1.medium.com/max/1600/1*fscs8H-c-4EwHK_3wDN1ow.png"
canonical: "https://medium.com/@david.dalbusco/add-a-slider-to-you-angular-app-ef997363399c"
---

![](https://cdn-images-1.medium.com/max/1600/1*fscs8H-c-4EwHK_3wDN1ow.png)

*Photo by [Persnickety Prints](https://unsplash.com/@persnicketyprints?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://medium.com/@david.dalbusco/one-trick-a-day-d-34-469a0336a07e) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Nineteen** days left until hopefully better days.

*****

The other day I was upgrading the dependencies of one of my client’s application developed with [Ionic](https://ionicframework.com).

To my surprise, the “fade”  transition of the [slider](https://ionicframework.com/docs/api/slides) wasn’t working anymore. After a bit of digging, I discovered, for performance reason, that the animations had been made optional and had to be solved by copying a piece of code in my application.

Moreover I also had to develop some design changes in its introduction process, which I did but actually not so straight forward as I assumed, as the slides are actually stacked when not displayed.

In short, it worked like a charm but that made me think, did you know that you can actually use the **core** Web Component of [DeckDeckGo](https://deckdeckgo.com), our open source editor for presentations, to add a slider to any web applications developed with or without any modern frontend frameworks?

Probably not 😉. 

That’s why I’m going to display in this blog post, as for example,  how you can do so in an application developed with [Angular](https://angular.io).

![](https://cdn-images-1.medium.com/max/1600/1*GywaedPi6bBVACpbGrZ5tA.gif)

*Add a slider to your application*

*****

### Installation

For this realization, we are going to need our [core](https://www.npmjs.com/package/@deckdeckgo/core). Moreover, because our solution is based on template, we are going to need at least one of them. As we are looking to implement a slider in which we are going to display information, the easiest template to use is our [title](https://docs.deckdeckgo.com/slides/title) template which centers the content.

```bash
npm i @deckdeckgo/core @deckdeckgo/slide-title --save
```

Furthermore, it may complains at build time that some type definitions are missing no worries, just add these to your development dependencies.

```bash
npm i @deckdeckgo/types --save-dev
```

*****

### Configuration

Once installed we need to import the components. These are developed with [StencilJS](https://stenciljs.com) which provides a handy [documentation](https://stenciljs.com/docs/overview) on the subject. 

That being said, Angular won’t resolve the libraries if we only import these as the following.

```javascript
import '@deckdeckgo/core';
import '@deckdeckgo/slide-title';
```

That’s why we are using the provided loaders option.

```javascript
import { defineCustomElements as deckGoCore } from 
             '@deckdeckgo/core/dist/loader';
import { defineCustomElements as deckGoSlide } from 
         '@deckdeckgo/slide-title/dist/loader';

deckGoCore(window);
deckGoSlide(window);
```

Furthermore, because Angular is not going to recognize our templates, we have to instruct it to support custom schemas. This can be set in any modules or globally in `app.module.ts` .

```javascript
import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
```

*****

### Usage

Our components are installed and configured, we can add the slider which is nothing else that a container `<deckgo-deck/>` , and its children, the slides, `<deckgo-slide-title>` .

```html
<deckgo-deck>
  <deckgo-slide-title>
    <h1 slot="title">Add</h1>
  </deckgo-slide-title>

  <deckgo-slide-title>
    <h1 slot="title">a slider</h1>
  </deckgo-slide-title>

  <deckgo-slide-title>
    <h1 slot="title">to your app</h1>
  </deckgo-slide-title>
</deckgo-deck>
```

And that’s it, the slider is in place 🎉.

![](https://cdn-images-1.medium.com/max/1600/1*CpmsgBb-IK33HOxkJA-eNw.gif)

*Our slider is ready*

*****

### Customization

You might want to apply some styling to your slide, here are some options.

*****

#### Hide Pager

A pager is useful for a presentation but most probably not for a slider in an application. That’s why you might want to hide it using the CSS4 variables `--pager-display` .

```html
<deckgo-deck style="--pager-display: none;">
  
</deckgo-deck>
```

![](https://cdn-images-1.medium.com/max/1600/1*GywaedPi6bBVACpbGrZ5tA.gif)

*Hidden pager*

*****

#### Transition

You might want to use another transition effect. Our core doesn’t handle yet a lot of different animation, [Pull Requests](https://github.com/deckgo/deckdeckgo) are welcomed, but it does already offers a `fade` effect or `none` .

```html
<deckgo-deck style="--pager-display: none;" transition="fade">

</deckgo-deck>
```

![](https://cdn-images-1.medium.com/max/1600/1*ZHlq-pmWawTDVYDKUxG8og.gif)

*Fade transition*

*****

### Navigation

If we would implement the slide as an introduction to your application, there is a good chance that we would be interested to add a `next` and a `skip` buttons. Our core also emits multiple [events](https://docs.deckdeckgo.com/deck/events) and exposes [navigation](https://docs.deckdeckgo.com/deck/navigation) methods, let’s try to use these.

For such purpose, we add these two buttons, we are identifying our deck with `#deck` and are listening to two deck transitions events respectively `slideNextDidChange` and `slidePrevDidChange` .

```html
<deckgo-deck style="--pager-display: none;" transition="fade"
             #deck 
             (slideNextDidChange)="updateLastSlide()"  
             (slidePrevDidChange)="updateLastSlide()">
  <deckgo-slide-title>
    <div slot="title"><h1>Add</h1></div>
  </deckgo-slide-title>

  <deckgo-slide-title>
    <div slot="title"><h1>a slider</h1></div>
  </deckgo-slide-title>

  <deckgo-slide-title>
    <div slot="title"><h1>to your app</h1></div>
  </deckgo-slide-title>

</deckgo-deck>

<div style="position: absolute; bottom: 0; right: 0;">
  <button (click)="skip()" *ngIf="!lastSlide">Skip</button>
  <button (click)="next()">Next</button>
</div>
```

Finally we implement the related methods while using a `ViewChild` reference on the deck which exposes the methods we need.

```javascript
import {Component, ElementRef, ViewChild} from '@angular/core';

import {defineCustomElements as deckGoCore} from '@deckdeckgo/core/dist/loader';
import {defineCustomElements as deckGoSlide} from '@deckdeckgo/slide-title/dist/loader';

deckGoCore(window);
deckGoSlide(window);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('deck') deck: ElementRef;

  lastSlide = false;

  async skip() {
    console.log('Go to next page');
  }

  async next() {
    const end = await this.deck.nativeElement.isEnd();
    if (end) {
      await this.skip();
      return;
    }

    await this.deck.nativeElement.slideNext();
  }

  async updateLastSlide() {
    const index = await this.deck.nativeElement.getActiveIndex();
    const length = await this.deck.nativeElement.getLength();

    this.lastSlide = index === length - 1;
  }

}
```

And that’s it, it works out 😁.

![](https://cdn-images-1.medium.com/max/1600/1*r1I_EPMYsMgQxoGMA4Uk8Q.gif)

*Navigation with our core*

*****

### Summary

It isn’t our goal to provide the most complete core slider with a zillion options as it would not serve our main focus but, that being said, as you may have noticed, I think it offers a valid alternative to implement quickly a slider in any modern web applications.

If you want to know more about it, check out our [documentation](https://docs.deckdeckgo.com) or give a try to our [editor](https://deckdeckgo.com) for your next presentations!

Stay home, stay safe!

David
