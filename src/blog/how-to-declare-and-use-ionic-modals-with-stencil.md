---
path: "/blog/how-to-declare-and-use-ionic-modals-with-stencil"
date: "2020-03-21"
title: "How To Declare And Use Ionic Modals With Stencil"
description: "How to declare and use Ionic modals with Stencil incl. passing parameters, close actions and hardware back button support"
tags: "#javascript #webdev #showdev #ionic"
image: "https://cdn-images-1.medium.com/max/1600/1*MUxo-oCL6aB0QEjOH8AU3A.png"
canonical: "https://medium.com/@david.dalbusco/how-to-declare-and-use-ionic-modals-with-stencil-d5d97e69c930"
---

![](https://cdn-images-1.medium.com/max/1600/1*MUxo-oCL6aB0QEjOH8AU3A.png)

*Photo by [Tirza van Dijk](https://unsplash.com/@tirzavandijk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I am sharing [one trick a day](https://medium.com/@david.dalbusco/one-trick-a-day-d-34-469a0336a07e) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-nine** days left until hopefully better days.

*****

This week on Slack, we discussed the usage of [Ionic](https://ionicframework.com) modals in [Stencil](https://stenciljs.com) apps. I shared the solution we have implemented in all applications of [DeckDeckGo](https://deckdeckgo.com), our open source editor for presentations, and it seemed to do the trick.

Even though the related Ionic Modal documentation is self explanatory and really well documented, when it comes to vanilla JavaScript or modern frontend frameworks, there isn’t any information regarding the Stencil usage.

That’s why, all in all, I thought I can share an article about this particular subject.

*****

### Controllers

Probably the major difference in terms of usage, if you compare to Ionic for React or vanilla Javascript, using Ionic modals in Stencil requires **controllers**.

For having tested all flavors (except Vue) of Ionic, this is still my favorite solution because I feel more comfortable with, but I’m not sure it will remains like this in the future as, if I understand correctly, many developers including some of the team itself rather like the other solution, without controllers. Therefore, if you read this article in a late future, check first if these still exists or not 😉.

*****

### Create A Modal

The modal itself is nothing else than a component. That’s why, if we want to add one to our application, we first create a new component which I rather like to not set as shadowed. Doing so, it will be possible to inherit the CSS properties and style of the application easily.

```javascript
import {Component, Element, h} from '@stencil/core';

@Component({
  tag: 'app-modal'
})
export class AppRemoteConnect {
  @Element() el: HTMLElement;

  render() {
    return [
      <ion-content class="ion-padding">Hello</ion-content>
    ]
  }

}
```

*****

### Open A Modal

As staten in the introduction, to use modals with Stencil, we are going to use controllers. The trick is to pass the modal tag name as value of the `component` variable.

```javascript
import {Component, h} from '@stencil/core';

import {modalController} from '@ionic/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  private async openModal() {
    const modal: HTMLIonModalElement =
                 await modalController.create({
      component: 'app-modal'
    });

    await modal.present();
  }

  render() {
    return (
      <ion-content>
        <ion-button onClick={() => this.openModal()}
                    color="primary">
          <ion-label>Open Modal</ion-label>
        </ion-button>
      </ion-content>
    );
  }
}
```

If everything went according plan, once started and opened, it should looks like the following:

![](https://cdn-images-1.medium.com/max/1600/1*oi7_UdlrP21Wuwm5UyB4mw.png)

*****

### Close A Modal

In this chapter we are going to explore the different ways to close the modal.

#### Button In Modal Header

To close the modal from itself, we use the document reference to find the closest `ion-modal` element in order to call the method `dismiss` which is exposed to achieve such a goal.

```javascript
import {Component, Element, h} from '@stencil/core';

@Component({
  tag: 'app-modal'
})
export class AppRemoteConnect {
  @Element() el: HTMLElement;

  async closeModal() {
    await (this.el.closest('ion-modal') as 
           HTMLIonModalElement).dismiss();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-buttons slot="start">
            <ion-button onClick={() => this.closeModal()}>
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">Hello</ion-content>
    ]
  }

}
```

Again, if everything went fine, a close button in the header should now be displayed.

![](https://cdn-images-1.medium.com/max/1600/1*ZV2OKs1bzf6eqI0SJnR9jg.png)

*****

#### Hardware Back Button Support

It’s been a while since I didn’t tested the hardware back button support to close the modal on Android but what I generally do is adding a navigation listener, in the modal, which call the same close function as the one we defined before. This hack is based on the history, that’s why a state has to be pushed when the modal is loaded.

```javascript
import {Listen} from '@stencil/core';

async componentDidLoad() {
  history.pushState({modal: true}, null);
}

@Listen('popstate', {target: 'window'})
async handleHardwareBackButton(_e: PopStateEvent) {
  await this.closeModal();
}
```

*****

#### Backdrop Dismiss

Per default, modals can be dismissed through a click on their backdrops. If you wish to disable this option, you have to specify it when at the controller level.

```javascript
const modal: HTMLIonModalElement = await modalController.create({
  component: 'app-modal',
  backdropDismiss: false
});
```

*****

### Passing Parameters

In this chapter we are passing parameters from the page to the modal and in the other direction.

#### Page To Modal

This is probably my favorite thing across all flavors of Ionic modals I tried. Passing parameters with Stencil is super duper easy.

To read parameters in the modals, we only have to define properties (`@Prop()`).

```javascript
import {Component, Element, h, Listen, Prop} from '@stencil/core';

@Component({
  tag: 'app-modal'
})
export class AppRemoteConnect {
  @Element() el: HTMLElement;
  
  @Prop()
  greetings: string;

  @Listen('popstate', {target: 'window'})
  async handleHardwareBackButton(_e: PopStateEvent) {
    await this.closeModal();
  }

  async closeModal() {
    await (this.el.closest('ion-modal')
           as HTMLIonModalElement).dismiss();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-buttons slot="start">
            <ion-button onClick={() => this.closeModal()}>
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
           {this.greetings}
      </ion-content>
    ]
  }

}
```

Which we then just pass through the controllers.

```javascript
private async openModal() {
  const modal: HTMLIonModalElement = await modalController.create({
    component: 'app-modal',
    backdropDismiss: false,
    componentProps: {
      greetings: 'Yolo'
    }
  });

  await modal.present();
}
```

Nothing more, nothing left, really easy. I like such solution.

![](https://cdn-images-1.medium.com/max/1600/1*t5Ri1zehrQLJSVRHnt529w.png)

*****

#### Modal To Page

You might need to pass results from the modal to the page or calling components. To do so, we use the function `dismiss` , as when did to close the modal, but we pass an object as parameter.

```javascript
async closeModalWithParams(greetings: string) {
  await (this.el.closest('ion-modal')
        as HTMLIonModalElement).dismiss(greetings);
}

<ion-button onClick={() => this.closeModalWithParams('Hello')}>
     Say Hello!
</ion-button>
```

In our example, I linked this new action with a new button.

![](https://cdn-images-1.medium.com/max/1600/1*qMxPYUnuhe4jtFicx5_yjQ.png)

Finally, to handle the result, we listen to the `onDidDismiss` event of the modal and proceed with the details passed as callback.

```javascript
import {Component, h, State} from '@stencil/core';

import {modalController, OverlayEventDetail} from '@ionic/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  @State()
  private greetingsResult: string;

  private async openModal() {
    const modal: HTMLIonModalElement =
                 await modalController.create({
      component: 'app-modal',
      backdropDismiss: false,
      componentProps: {
        greetings: 'Yolo'
      }
    });

    modal.onDidDismiss().then(
          async (detail: OverlayEventDetail) => {
      this.greetingsResult = detail.data;
    });

    await modal.present();
  }

  render() {
    return (
      <ion-content>
        <ion-button onClick={() => this.openModal()} 
                    color="primary">
          <ion-label>Open Modal</ion-label>
        </ion-button>

        <ion-label>{this.greetingsResult}</ion-label>
      </ion-content>
    );
  }
}
```

I used a state as demonstration purpose in order to render the results.

![](https://cdn-images-1.medium.com/max/1600/1*fCDBeVvWKiRktdlAb7eTwQ.png)

Note that you can use both primitives types, complex objects, callbacks or events as parameters.

*****

### Cherry On The Cake

It works exactly the same with `popovers.`

*****

### See It In Action

If you are interested to see Ionic modals used in Stencil apps in action, give a try to [DeckDeckGo](https://deckdeckgo.com) for your next slides 😁.

Stay home, stay safe!

David
