---
path: "/blog/react-and-web-workers"
date: "2020-04-07"
title: "React And Web Workers"
description: "How to interact with Web Workers in React applications"
tags: "#react #showdev #webdev #javascript"
image: "https://daviddalbusco.com/assets/images/1*zuX14URmAiO36mikljilOg.png"
canonical: "https://medium.com/@david.dalbusco/react-and-web-workers-c9b60b4b6ae8"
---

![](https://daviddalbusco.com/assets/images/1*zuX14URmAiO36mikljilOg.png)

_Photo by [Tobias Tullius](https://unsplash.com/@tobiastu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until (probably not) the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twelve** days left until hopefully better days.

---

I recently published [Tie Tracker](https://tietracker.app.link), a simple, open source and free time tracking app ⏱.

Among its features, the full offline mode was particularly interesting to develop. From an architectural point of view, I had to find a solution to compute, for statistical or exportation purposes, the many entries the users are potentially able to record without blocking the user interface.

That’s why I had the idea to solve my problem with the help of the [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

The app is developed with [Ionic](https://ionicframework.com) + [React](https://reactjs.org), therefore let me share with you my recipe 😉.

---

### Simulate A Blocked User Interface

Before trying Web Workers out, let’s first try to develop a small application which contains an action which actually block the user interface.

In the following component, we are handling two states, two counters. One of these is incremented on each button click while the other call a function `incApple()` which loops for a while and therefore block the user interaction.

```javascript
import {
    IonContent,
    IonPage,
    IonLabel,
    IonButton
} from '@ionic/react';
import React, {useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './Page.css';

const Page: React.FC<RouteComponentProps<{ name: string; }>> = ({match}) => {

    const [countTomato, setCountTomato] = useState<number>(0);
    const [countApple, setCountApple] = useState<number>(0);

    function incApple() {
        const start = Date.now();
        while (Date.now() < start + 5000) {
        }
        setCountApple(countApple + 1);
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonLabel>Tomato: {countTomato} | Apple: {countApple}</IonLabel>

                <div className="ion-padding-top">
                    <IonButton
                     onClick={() => setCountTomato(countTomato + 1)}
                     color="primary">Tomato</IonButton>

                    <IonButton
                     onClick={() => incApple()}
                     color="secondary">Apple</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Page;
```

As you can notice in the following animated Gif, as soon as I start the “Apple counter”, the user interaction on the “Tomato counter” have no effects anymore, do not trigger any new component rendering, as the function is currently blocking the JavaScript thread.

![](https://daviddalbusco.com/assets/images/1*UFSpBIR1gR1etkBkLdXRaA.gif)

---

### Defer Work With Web Workers

Having the above example in mind, let’s try out Web Workers in order to defer our “Apple counter” function.

---

#### Web Workers

To easiest way to add a Web Worker to your application is to ship it as an asset. In the case of my Ionic React application, these find place in the directory `public` , that’s we create a new file `./public/workers/apple.js` .

Before explaining the flow of the following code, two things are **important** to notice:

1. The application and the Web Workers are two separate things. They don’t share states, they don’t share libraries, they are separate and can communicate between them through messages only.

2. Web Workers do not have access to the GUI, to the `document`, to the `window`.

If you are familiar with Firebase, you can kind of understand, to some extent, the Web Worker as your own private, not Cloud, but local functions.

The entry point of our web worker is `onmessage` which is basically a listener to call triggered from our application. In the function we are registering, we are checking if a corresponding `msg` is provided, this let us use a web worker for many purposes, and are also amending the current counter value before running the same function `incApple()` as before. Finally, instead of updating the state directly, we are returning the value to the application through a `postMessage` .

```javascript
self.onmessage = async ($event) => {
	if ($event && $event.data && $event.data.msg === "incApple") {
		const newCounter = incApple($event.data.countApple);
		self.postMessage(newCounter);
	}
};

function incApple(countApple) {
	const start = Date.now();
	while (Date.now() < start + 5000) {}
	return countApple + 1;
}
```

---

#### Interacting With The Web Workers

To interact with the web worker, we first need to add a reference point to our component.

```javascript
const appleWorker: Worker = new Worker('./workers/apple.js');
```

Because we are communicating with the use of messages, we should then register a listener which would take care of updating the counter state when the web worker emits a result.

```javascript
useEffect(() => {
    appleWorker.onmessage = ($event: MessageEvent) => {
        if ($event && $event.data) {
            setCountApple($event.data);
        }
    };
}, [appleWorker]);
```

Finally we update our function `incApple()` to call the web worker.

```javascript
function incApple() {
	appleWorker.postMessage({ msg: "incApple", countApple: countApple });
}
```

Tada, that’s it 🎉. You should now be able to interact with the GUI even if the “blocker code is running”. As you can notice in the following animated Gif, I am still able to increment my tomato counter even if the blocking loops is performed by the web worker.

![](https://daviddalbusco.com/assets/images/1*ckzRpU3hVOmPyHw-of1u2w.gif)

The component altogether in case you would need it:

```javascript
import {
    IonContent,
    IonPage,
    IonLabel,
    IonButton
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './Page.css';

const Page: React.FC<RouteComponentProps<{ name: string; }>> = ({match}) => {

    const [countTomato, setCountTomato] = useState<number>(0);
    const [countApple, setCountApple] = useState<number>(0);

    const appleWorker: Worker = new Worker('./workers/apple.js');

    useEffect(() => {
        appleWorker.onmessage = ($event: MessageEvent) => {
            if ($event && $event.data) {
                setCountApple($event.data);
            }
        };
    }, [appleWorker]);

    function incApple() {
        appleWorker
            .postMessage({msg: 'incApple', countApple: countApple});
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonLabel>Tomato: {countTomato} | Apple: {countApple}</IonLabel>

                <div className="ion-padding-top">
                    <IonButton
                     onClick={() => setCountTomato(countTomato + 1)}
                     color="primary">Tomato</IonButton>

                    <IonButton
                     onClick={() => incApple()}
                     color="secondary">Apple</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Page;
```

---

### Summary

Web Workers is really an interesting concept. [Tie Tracker](https://tietracker.app.link) let me experiment them and I am definitely going to use them again in future projects. Its code is open source and available on [GitHub](https://github.com/peterpeterparker/tietracker). If you have any feedback and even better, are interested to contribute, send me your best Pull Requests, that would be awesome 😎.

Stay home, stay safe!

David
