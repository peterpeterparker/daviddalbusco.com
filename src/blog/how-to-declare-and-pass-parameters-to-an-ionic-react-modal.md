---
path: "/blog/how-to-declare-and-pass-parameters-to-an-ionic-react-modal"
date: "2019-12-10"
title: "How to declare and pass parameters to an Ionic + React Modal"
description: "How to declare and pass parameters to an Ionic + React Modal"
tags: "#programming #react #javascript #tutorial"
image: "https://cdn-images-1.medium.com/max/1600/1*lTN15RS0mfGtXUAQF5RVJQ.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*lTN15RS0mfGtXUAQF5RVJQ.jpeg)

*Photo by [timJ](https://unsplash.com/@the_roaming_platypus?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/dialog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I’m having fun with [Ionic React](https://ionicframework.com/docs/react) these days and therefore experimenting different components. One of these, which I use almost without exceptions in any applications, is the modal. Although its dedicated [documentation](https://ionicframework.com/docs/api/modal) is pretty neat, I went a bit further, as I like to declare them in their own separate components. That’s why I’m writing this new blog post.

### Getting Started

To add a modal to an application, we proceed as displayed in the documentation (told you, it is well documented). We use the component `IonModal` and, in order to trigger its opening and closing, we also use a state (with the help of a `useState` hook) to modify its property `isOpen` .

```javascript
import React, {useState} from 'react';
import {IonModal, IonButton, IonContent} from '@ionic/react';

export const Tab1: React.FC = () => {

  const [showModal, setShowModal] = useState(false);

  return (
    <IonContent>
      <IonModal isOpen={showModal}>
        <p>This is the modal content.</p>
        <IonButton onClick={() => setShowModal(false)}>
            Close Modal
        </IonButton>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>
            Show Modal
      </IonButton>
    </IonContent>
  );

};

export default Tab1;
```

*Note that I have used the *`tab`* starter kit to develop this article, that’s why the above page’s name is *`Tab1`* .*

### Create A Component

Modals could quickly become as complicated as pages, that’s why, I am used to declare them in their own components. Let’s then try to create a new one in a separate new file, called for example `MyModal.tsx` .

```javascript
import React from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle} from '@ionic/react';

class MyModal extends React.Component {

  render() {
    return <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Modal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>This is the modal content.</p>
      </IonContent>
    </>
  };

}

export default MyModal;
```

Once we have created it, we could use it in our page to replace the previous content of the modal.

```javascript
import React, { useState } from 'react';
import { IonModal, IonButton, IonContent
} from '@ionic/react';

import MyModal from './MyModal';

export const Tab1: React.FC = () => {

  const [showModal, setShowModal] = useState(false);

  return (
    <IonContent>
      <IonModal isOpen={showModal}>
        <MyModal></MyModal>
        <IonButton onClick={() => setShowModal(false)}>
            Close Modal
        </IonButton>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>
            Show Modal
      </IonButton>
    </IonContent>
  );

};

export default Tab1;
```

### To Close The Modal

Super, we achieved the first step, we have now a modal declared in a separate component. But, in our above example, the action to close the modal, respectively the `IonButton` button which sets the display state to `false`, is still rendered outside of our component which is a bit unfortunate in term of design, as, I think, it’s quite common to render such an action in the header of the modal itself.

In order to move this button into the modal, I actually found two possible solutions. One with the use of a `callback` , probably the cleanest one, and another one using `references`. 

There might be more and I would be really happy to hear about them. Therefore please, ping me with your comments and thank you in advance for your shares 👋

#### Callback

In this solution, we want to pass a callback to the component to close the modal. We enhance it with a new property, which we also use in our header to add the related button.

```javascript
import React from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon} from '@ionic/react';

type MyModalProps = {
  closeAction: Function;
}

class MyModal extends React.Component<MyModalProps> {

  render() {
    return <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Modal</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => this.props.closeAction()}>
              <IonIcon name="close" slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>This is the modal content.</p>
      </IonContent>
    </>
  };

}

export default ({closeAction}: { closeAction: Function }) => (
  <MyModal closeAction={closeAction}>
  </MyModal>
)
```

Once the component modified, we  could create a new function (in our page) to set the display state to `false` and pass it as callback to our component. 

```javascript
import React, {useState} from 'react';
import {IonModal, IonButton, IonContent} from '@ionic/react';

import MyModal from './MyModal';

export const Tab1: React.FC = () => {

  const [showModal, setShowModal] = useState(false);

  async function closeModal() {
    await setShowModal(false);
  }

  return (
    <IonContent>
      <IonModal isOpen={showModal}>
        <MyModal closeAction={closeModal}></MyModal>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>
        Show Modal
      </IonButton>
    </IonContent>
  );

};

export default Tab1;
```

### References

Another possible solution could be the usage of a DOM reference to dismiss the modal.

```javascript
import React, {RefObject} from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon} from '@ionic/react';

class MyModal extends React.Component {
  headerRef: RefObject<HTMLIonHeaderElement> = React.createRef();

  async closeModal() {
    if (!this.headerRef || !this.headerRef.current) {
      return;
    }
    await (this.headerRef.current.closest('ion-modal') as 
                HTMLIonModalElement).dismiss();
  }

  render() {
    return <>
      <IonHeader ref={this.headerRef}>
        <IonToolbar color="primary">
          <IonTitle>My Modal</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => this.closeModal()}>
              <IonIcon name="close" slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>This is the modal content 3.</p>
      </IonContent>
    </>
  };

}

export default MyModal;
```

The above method has for effect that our  `state` , used in our page for the display purpose, might end up not being synced anymore with the effective state of the modal, as we closed it using the DOM. To overcome this situation, we could sync the information after the dialog has been dismissed.

```javascript
import React, {useState} from 'react';
import {IonModal, IonButton, IonContent} from '@ionic/react';

import MyModal from './MyModal';

export const Tab1: React.FC = () => {

  const [showModal, setShowModal] = useState(false);

  return (
    <IonContent>
      <IonModal isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}>
        <MyModal></MyModal>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>
        Show Modal
      </IonButton>
    </IonContent>
  );

};

export default Tab1;
```

But unfortunately this method has a drawback. As we are modifying the state to synchronize it, our component is going to be “rerendered”. Therefore it is a bit less performant than the solution with `callback` and that’s why I found this first solution cleaner.

*Side note: I spent several hours yesterday evening trying without success to wrap `shouldComponentUpdate` respectively `React.Memo` around the modal component in order to not render the page again when the state is modified after the modal is dismissed. It is probably possible and again I’ll be happy to hear any tips about this too 😉*

### To Pass Parameters

In the previous examples, we already used a property to pass a callback to close the modal. Likewise, we could use the same approach to define any other properties.

```javascript
import React from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon} from '@ionic/react';

type MyModalProps = {
  closeAction: Function;
  text: string;
}

class MyModal extends React.Component<MyModalProps> {
  render() {
    return <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Modal</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => this.props.closeAction()}>
              <IonIcon name="close" slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>{this.props.text}</p>
      </IonContent>
    </>
  };
}

export default ({closeAction, text}: { closeAction: Function, text: string }) => (
  <MyModal closeAction={closeAction} text={text}>
  </MyModal>
)
```

And therefore pass any other parameters from the page to our modal component.

```javascript
import React, {useState} from 'react';
import {IonModal, IonButton, IonContent} from '@ionic/react';

import MyModal from './MyModal';

export const Tab1: React.FC = () => {

  const [showModal, setShowModal] = useState(false);

  async function closeModal() {
    await setShowModal(false);
  }

  return (
    <IonContent>
      <IonModal isOpen={showModal}>
        <MyModal closeAction={closeModal}
                 text="This is the updated modal content.">
        </MyModal>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>
        Show Modal
      </IonButton>
    </IonContent>
  );
};

export default Tab1;
```

To infinity and beyond 🚀

David
