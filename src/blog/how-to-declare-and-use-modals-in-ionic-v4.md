---
path: "/blog/how-to-declare-and-use-modals-in-ionic-v4"
date: "2018-10-09"
title: "How to declare and use modals in Ionic v4"
description: "How to declare and use modals in Ionic v4"
tags: "#ionic #angular #javascript #programming"
image: "https://cdn-images-1.medium.com/max/2000/1*jJJ6qFutpkXsD-aRYGs1tA.jpeg"
---

![](https://cdn-images-1.medium.com/max/2000/1*jJJ6qFutpkXsD-aRYGs1tA.jpeg)

I noticed that questions about the declaration and use of modals in [Ionic](https://ionicframework.com/) v4 with [Angular](https://angular.io/) often pops up, therefore I thought I would briefly describe how I solved this subject in my mobile application [Fluster](https://fluster.io/).

### Creating a modal

A modal is a `component` and its annotation doesn’t really change in comparison to Ionic v3.

```
import {Component} from '@angular/core';
@Component({
    templateUrl: 'date-picker.html',
    styleUrls: ['./date-picker.scss'],
    selector: 'app-date-picker'
})
export class DatePickerModal {
}
```

#### Declaring the modal’s module

What do change is probably the declaration of the modal’s module. In Ionic v3, the modal was bootstraped with the help of the `@IonicPage()` annotation, which doesn’t exist anymore in Ionic v4. Therefore we have tells our module that our modal has to be loaded imperatively, this could be achieved by declaring it as an **entry component **in its module.

```
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
// The modal's component of the previous chapter
import {DatePickerModal} from './date-picker';
@NgModule({
     declarations: [
       DatePickerModal
     ],
     imports: [
       IonicModule,
       CommonModule
     ],
     entryComponents: [
       DatePickerModal
     ]
})
export class DatePickerModalModule {}
```

#### Lazy loading

You might ask yourself, are these modals lazy loaded? The answer to this is one of my favorite german word: **jein**, which is a contraction of _ja_ (= yes) and _nein_ (= no).

The modal is lazy loaded, BUT, it will not be loaded when you open it, as you probably would except, but rather when the module, where the modal’s module is use, will be loaded.

For more information about this particular subject you could visit and participate to the following Ionic forum topic (btw. there I’m _reedrichards_):
[https://forum.ionicframework.com/t/ionic-4-lazy-loading-and-modals](https://forum.ionicframework.com/t/ionic-4-lazy-loading-and-modals)

### Using the modal

First thing we have to do in order to use our modal is importing it in the module of the page or component where we will use it.

```
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
// The modal's module of the previous chapter
import {DatePickerModalModule} from '../../../../modals/core/date-picker/date-picker.module';
@NgModule({
    declarations: [
        NewAdStepAvailabilityComponent
    ],
    imports: [
      IonicModule,
      CommonModule,
      DatePickerModalModule
    ],
    exports: [
      NewAdStepAvailabilityComponent
    ]
})
export class NewAdStepAvailabilityModule {}
```

_Note: About lazy loading and this particular example, the modal is loaded in the same time as the module _`NewAdStepAvailabilityModule`_ respectively, in our browser, we would be able to observe that the javascript code of the modal is loaded in the same time as the javascript code of this particular module._

#### Calling the modal and passing parameters

Another question which often pops up is “how to pass parameters and get a result back when using modals in Ionic v4”.

As in Ionic v3, we use the `ModalController` to create, and interact with, a modal. This controller offers a `create` method which will allow us to pass parameters (specified in the following example with `componentProps)` and a `onDidDismiss` event which will allow us to listen to the modal‘s closing action in order to get the result.

```
async openModal() {
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: DatePickerModal,
          componentProps: {
             aParameter: true,
             otherParameter: new Date()
          }
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
       if (detail !== null) {
         console.log('The result:', detail.data);
       }
    });

    await modal.present();
}
```

#### Getting the parameters in the modal and closing the modal with a result

In our modal, the `NavParams` provider could be use to read the parameters we specified above when we created the modal.

Finally, closing the modal and passing a result back could be accomplished using the `ModalController` .

```
import {Component} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
@Component({
    templateUrl: 'date-picker.html',
    styleUrls: ['./date-picker.scss'],
    selector: 'app-date-picker'
})
export class DatePickerModal {

    myParameter: boolean;
    myOtherParameter: Date;
    constructor(private modalController: ModalController,
                private navParams: NavParams) {
    }
    ionViewWillEnter() {
      this.myParameter = this.navParams.get('aParameter');
      this.myOtherParameter = this.navParams.get('otherParameter');
    }
    async myDismiss() {
      const result: Date = new Date();

      await this.modalController.dismiss(result);
    }
}
```

_Note: In this example I used boolean and dates for the parameters and result, but these could also be any other types or even a custom object._

### Cherry on the cake 🍒🎂

It works exactly the same with popovers 😉

To infinity and beyond 🚀

David
