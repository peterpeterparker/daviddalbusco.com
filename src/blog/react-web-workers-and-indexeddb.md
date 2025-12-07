---
path: "/blog/react-web-workers-and-indexeddb"
date: "2020-04-09"
title: "React, Web Workers and IndexedDB"
description: "How to use IndexedDB in React applications with Web Workers"
tags: "#react #showdev #webdev #javascript"
image: "https://daviddalbusco.com/assets/images/1*Ih6g24vTLWb_Zl-yiNOuNA.png"
canonical: "https://medium.com/@david.dalbusco/react-web-workers-and-indexeddb-a973797e771b"
---

![](https://daviddalbusco.com/assets/images/1*Ih6g24vTLWb_Zl-yiNOuNA.png)

_Photo by [Pawan Kawan](https://unsplash.com/@pawankawan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Ten** days left until this first milestone. Hopefully better days are ahead.

---

In a [previous blog post](https://daviddalbusco.com/blog/react-and-web-workers) of this series I shared my solution to make [React](https://reactjs.org) and [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) interacts. A tricks I experimented while developing [Tie Tracker](https://tietracker.app.link/), a simple, open source and free time tracking app ⏱.

Another, I hope, interesting features of such construct and this app was the idea of handling data in the threads using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

The idea was simple: letting the user enter and modify data in the database on the application side (JavaScript mono thread), because such operation takes few time, but to defer every calculations or statistics to the Web Workers in order to not block the user interface and interaction.

That is why I am sharing with you this recipe in this follow-up article 😁.

---

### idb-keyval

I am a bit picky when it comes to third party libraries because I am a bit “bundlephobic” but when it comes to interacting with the IndexedDB there are no hesitations, [idb-keyval](https://github.com/jakearchibald/idb-keyval) from [Jake Archibald](https://twitter.com/jaffathecake) is my go-to-library.

Less than 600 bytes, tree-shaking friendly, promises based ... stop right there, I am all in!

Therefore of course in this solution we are going to use it 😉.

```bash
npm i idb-keyval --save
```

---

### User Interface

In the previous post we had a “Tomato and Apple counters”. I propose that we now concentrate our self on the “Tomato” one and that we try to defer the calculation of the sum of the counter to the Web Worker.

Before any interaction with IndexedDB, our modified component’s code looks like the following.

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
    const [sumTomato, setSumApple] = useState<number>(0);

    const tomatoWorker: Worker = new Worker('./workers/tomato.js');

    useEffect(() => {
        tomatoWorker.onmessage = ($event: MessageEvent) => {
            if ($event && $event.data) {
                setSumApple($event.data);
            }
        };
    }, [tomatoWorker]);

    function doSumTomato() {
        tomatoWorker
         .postMessage({msg: 'sumTomato'});
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonLabel>
                   Tomato: {countTomato} | Sum: {sumTomato}
                </IonLabel>

                <div className="ion-padding-top">
                    <IonButton
                        onClick={() =>
                          setCountTomato(countTomato + 1)}
                        color="primary">Tomato</IonButton>

                    <IonButton
                        onClick={() => doSumTomato()}
                        color="secondary">Sum now!</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Page;
```

Of course as we do not have yet implemented the sum part, the Web Worker, it does not do much.

![](https://daviddalbusco.com/assets/images/1*0Qz6Y3scEzimJ--S7TTNgA.gif)

---

### User Interaction

Our goal is to write a data in the IndexDB on user interaction, that’s why for demo purpose and for fun, I suggest that we generate a new entry in the database each time the tomato counter is incremented. For this purpose, we register a new `useEffect` to `set` entries.

```javascript
import { set } from "idb-keyval";

useEffect(() => {
	incTomato();
}, [countTomato]);

async function incTomato() {
	if (countTomato > 0) {
		await set(`tomato${countTomato}`, countTomato);
	}
}
```

And that’s already it. Every time the counter is incremented, the effect is triggered and in extension we are using idb-keyval to add a value in the database.

![](https://daviddalbusco.com/assets/images/1*Upl2MW8HhjDarFAcOoOdUQ.gif)

---

### Web Workers

For this tutorial I created a new worker file `./public/workers/tomato.js` which before any IndexDB interaction looks like the following.

```javascript
self.onmessage = async ($event) => {
	if ($event && $event.data && $event.data.msg === "sumTomato") {
		const sum = await sumTomato();
		self.postMessage(sum);
	}
};

async function sumTomato() {
	// TODO sum tomato
	return 0;
}
```

We have now to access our data in IndexedDB. To solve this problem we have two options, either code everything or use a library. As a big fan of idb-keyval, I would like to use it here too.

Unfortunately, our Web Workers are shipped as assets and therefore don’t have access to our bundle and its dependencies. That’s why we have to perform a setup and import a script in our workers with the help of `importScripts` .

I’m guessing that one nice way would be to handle this dependency with Rollup or Webpack, probably through plugins, but I have to say I did not followed that path.

That’s why we have two options remaining. Either link an external script or download it, place it in the same folder and reference it locally.

If you would like to follow the “local way”, your import would look like the following:

```javascript
importScripts("./idb-keyval-iife.min.js");
```

Or, as we are going to do, here’s how we can import it using [Unpkg](https://unpkg.com/).

```javascript
importScripts("https://unpkg.com/idb-keyval@latest/dist/idb-keyval-iife.min.js");
```

All set, we can now enjoy idb-keyval and access our data in the IndexedDB from our Web Worker too. As for example, we can list the `keys()` present on the database, iterate on these to `get(key)` their values and calculate a pseudo sum.

```javascript
importScripts("https://unpkg.com/idb-keyval@latest/dist/idb-keyval-iife.min.js");

self.onmessage = async ($event) => {
	if ($event && $event.data && $event.data.msg === "sumTomato") {
		const sum = await sumTomato();
		self.postMessage(sum);
	}
};

async function sumTomato() {
	const keys = await idbKeyval.keys();

	let sum = 0;
	for (const key of keys) {
		const value = await idbKeyval.get(key);
		sum += value;
	}

	return sum;
}
```

And voilà 🎉. We are using IndexedDB in all our threads 😃.

![](https://daviddalbusco.com/assets/images/1*o4uSCTJUb9X253cdPmJJMA.gif)

---

### Summary

The web is so much fun.

Stay home, stay safe.

David
