---
path: "/blog/how-to-close-ionic-modals-using-the-hardware-back-button"
date: "2019-05-06"
title: "How to close Ionic modals using the hardware back button"
description: "How to close Ionic modals using the hardware back button in applications developed with Angular or StencilJS"
tags: "#webdev #ionic #angular #stencil"
image: "https://daviddalbusco.com/assets/images/1*AE_pfiSxN5bMBApg_Nodow.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*AE_pfiSxN5bMBApg_Nodow.jpeg)

I noticed today that I’m always reusing the exact same piece of code in order to close [Ionic](https://ionicframework.com) modals using the Android hardware back button. Moreover, as I wrote a couple of months ago a blog post about “[How to declare and use modals in Ionic v4](https://dev.to/daviddalbusco/how-to-declare-and-use-modals-in-ionic-v4-3nj7)”, I thought that displaying quickly how I solve this would be a nice add-on.

Actually, I have implemented two different solutions for my applications. One for my [Angular](https://angular.io) applications and one for the [StencilJS] (https://stenciljs.com) one, therefore I’ll showcase both pieces of code 😋

### Disclaimer

I just tested again to be sure (today is the 6th May 2019), the solution I display using Angular works fine for Android applications but doesn’t for Progressive Web Apps.

Contrariwise the solution I display using StencilJS works like a charm for PWA. According your need, you might use one, the other or “a bit of both” as Star Lord would do 😉

Of course, if you would have a better solution which works for all cases, don’t hesitate to ping as the solutions I’m displaying are implemented in “real” productive applications, I love to learn things and I would be happy to improve them!

### Angular

Handling the hardware back button using Angular is easy, Ionic does all the job by [dispatching](https://github.com/ionic team/ionic/blob/44fb45e2bcd52580c55cd8a26b396d01c7b53e52/core/src/utils/hardware back-button.ts#L18) an event `ionBackButton` (which bubbles through the document) when the “physical” button is clicked. We just have to listen to that event and then close our modal if something is happening using the `ModalController` as we would do, if we would manually close the modal.

Angular also provide a handy [decorator](https://angular.io/api/core/HostListener) `HostListener` which allow us to listen to events without too much code and without thinking about subscribing and unsubscribing.

In short, here’s my Angular code to close Ionic modals using the hardware back button:

```
import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    templateUrl: 'my-modal.html',
    styleUrls: ['./my-modal.scss'],
    selector: 'app-my-modal'
})
export class MyModal {
    constructor(private modalController: ModalController) {}

    @HostListener('document:ionBackButton', ['$event'])
    private async overrideHardwareBackAction($event: any) {
        await this.modalController.dismiss();
    }
}
```

### StencilJS

I mostly, for not saying only, use the Ionic PWA toolkit (= StencilJS) to develop, well I guess you already understand, Progressive Web Apps. As I explained in my introduction, the solution using the event `ionBackButton` won’t work for such applications, therefore I came up with a workaround which consist of pushing a state in the navigation history when the modal is loaded and popping it when the hardware back button is clicked. Not sure if this solution is ugly or not (don’t judge me on this please if it’s the case) but it seems it works well 🤣

In short, here’s my StencilJS code to close Ionic modals using the hardware back button:

```
import {Component, Element, Listen} from '@stencil/core';

@Component({
    tag: 'app-my-modal',
    styleUrl: 'app-my-modal.scss'
})
export class AppMyModal {
    @Element() el: HTMLElement;

    async componentDidLoad() {
        history.pushState({modal: true}, null);
    }

    @Listen('window:popstate')
    async handleHardwareBackbutton(_e: PopStateEvent) {
        await this.closeModal();
    }

    async closeModal() {
        await (this.el.closest('ion-modal')
              as HTMLIonModalElement).dismiss();
    }

    render() {
        return [
            <ion-header>
              <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-button
                    onClick={() => this.closeModal()}>
                    <ion-icon name="close"></ion-icon>
                  </ion-button>
                </ion-buttons>
              </ion-toolbar>
            </ion-header>,

            <ion-content padding>
                <h1>Yolo</h1>
            </ion-content>
        ];
    }
}
```

#### Stencil One

I didn’t tried yet, but according the [BREAKING CHANGES](https://github.com/ionic team/stencil/blob/core-refactor/BREAKING_CHANGES.md) list of Stencil One, listeners will have to be declared a bit differently in the future. If I get it, we will have to convert the above listener decorator to the following declaration:

```
@Listen('popstate', { target: 'window' })
```

### Cherry on the cake 🍒🎂

Guess what, it works exactly the same with popovers 😉

To infinity and beyond 🚀

David
