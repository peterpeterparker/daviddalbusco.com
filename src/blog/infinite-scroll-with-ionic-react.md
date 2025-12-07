---
path: "/blog/infinite-scroll-with-ionic-react"
date: "2019-12-02"
title: "Infinite Scroll with Ionic + React"
description: "How to implement an Infinite Scroll with Ionic + React and a filter with Hooks"
tags: "#programming #react #javascript #tutorial"
image: "https://daviddalbusco.com/assets/images/1*VST3XVmoX1R3hAXJ8OGw4A.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*VST3XVmoX1R3hAXJ8OGw4A.jpeg)

Ionic React has been made [available](https://ionicframework.com/blog/announcing-ionic-react/) earlier this year and I’ll introduce some of its features at our local [meetup](https://www.meetup.com/fr-FR/Ionic-Zurich/events/265767496/) this Thursday. One of these is the implementation of an infinite scroller, which I’m about to share with you in the following post 😃

### Before We Start

To implement the solution we will need an Ionic + React application. If you don’t have one yet or if you just want to create a sample one to follow this tutorial, have a look to the well documented and easy to follow official [documentation](https://ionicframework.com/docs/react) or just kick start one with the following command:

```bash
ionic start infiniteScroll tabs --type react
```

### Getting Started

The starter kit used by the Ionic to create a new application contains three tabs, three pages, which are themselves React functional components. For convenience reason, we are going to implement our solution in the first tab, respectively in the file `./src/pages/Tab1.tsx` .

As we are going to implement an Infinite Scroll and therefore going to display a list, the first thing we are going to do, is adding a stateful value which should contains our items. For that purpose we are using the `useState` React Hook. Moreover we are rendering them using cards and are adding another state which will help us stop the scroller when there will be nothing left to iterate.

```javascript
import {
  IonContent, IonHeader, IonPage,
  IonTitle, IonCard, IonToolbar} from '@ionic/react';
import React, {useState} from 'react';

const Tab1: React.FC = () => {

  const [items, setItems] = useState<string[]>([]);

  const [disableInfiniteScroll, setDisableInfiniteScroll] =
        useState<boolean>(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab One</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {items.map((item: string, i: number) => {
           return <IonCard key={`${i}`}><img src={item}/>
                  </IonCard>
        })}
      </IonContent>
    </IonPage>
  );

};
```

### Fetch API

A list of items also means list of data. In our particular example, we are going to use the [Dog API](https://dog.ceo/dog-api/), which had become my favorite API for tutorial purpose, to fetch such information. This API is free, open source, don’t need any token and support CORS requests.

```javascript
async function fetchData() {
  const url: string = 'https://dog.ceo/api/breeds/image/random/10';
  const res: Response = await fetch(url);
  res
      .json()
      .then(async (res) => {
        if (res && res.message && res.message.length > 0) {
          setItems([...items, ...res.message]);

          setDisableInfiniteScroll(res.message.length < 10);
        } else {
          setDisableInfiniteScroll(true);
        }
      })
      .catch(err => console.error(err));
}
```

_Note that this example doesn’t contain any pagination, as your real solution would. It just fetch 10 random dogs. Of course for that reason we might have duplicates in our list._

### Loading Initial Data

Ionic provide multiple lifecycle events that we can use in our app. Something I also really appreciated is the fact that they don’t just provide such events for standard components but for functional components too. To fetch data when our page will be displayed, we could hook on the `ionViewWillEnter` which is fired when the component routing to is about to animate into view.

```javascript
import {useIonViewWillEnter} from '@ionic/react';

const Tab1: React.FC = () => {

useIonViewWillEnter(async () => {
    await fetchData();
  });

};
```

### Infinite Scroll

Let’s cut to the chase, we are now going to add our infinite scroller. Firstly we are adding a new function which will help us fetch new data and stop tell the scroller that the operation has been completed.

```javascript
async function searchNext($event: CustomEvent<void>) {
    await fetchData();

    ($event.target as HTMLIonInfiniteScrollElement).complete();
}
```

Finally we are importing the Ionic Infinite Scroll components.

```javascript
import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";
```

And rendering these in our content as the following:

```html
<IonInfiniteScroll threshold="100px"
    disabled={disableInfiniteScroll}
    onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
    <IonInfiniteScrollContent
        loadingText="Loading more good doggos...">
    </IonInfiniteScrollContent>
</IonInfiniteScroll>
```

### Altogether

I split the code in the above steps to makes the implementation more accessible (I hope) but altogether you could find it [GitHub](https://github.com/peterpeterparker/infiniteScroll/blob/master/src/pages/Tab1.tsx) 🐩

### Test

If everything went according plan, once you run our application with the command line `ionic serve` , you should be able to browse an infinite list of doggos with your favorite browser 🎉

![](https://daviddalbusco.com/assets/images/1*zOAnHKLkcqo0M7NMtVioQQ.gif)

_So much doggos_

### Filtering

Displaying a filtered list of items is probably as common as an infinite scroller. Therefore, let’s add a filter, in form of a new state, to our implementation and modify the `fetch` function to reset the items and query only a specified breed in case a filter would be applied.

```javascript
const [filter, setFilter] = useState<string | undefined>(undefined);
async function fetchData(reset?: boolean) {
  const dogs: string[] = reset ? [] : items;
  const url: string = filter ?
        `https://dog.ceo/api/breed/${filter}/images/random/10` :
        'https://dog.ceo/api/breeds/image/random/10';

  const res: Response = await fetch(url);
  res
      .json()
      .then(async (res) => {
        if (res && res.message && res.message.length > 0) {
          setItems([...dogs, ...res.message]);

          setDisableInfiniteScroll(res.message.length < 10);
        } else {
          setDisableInfiniteScroll(true);
        }
      })
      .catch(err => console.error(err));
}
```

### Fetch And Refresh Data With A React Hook

To observe the changes which would be applied to the filter and to refresh the data, we are now going to replace the `useIonViewWillEnter` lifecycle we used before with a `useEffect` React Hook. Doing so, data are still going to be loaded when we enter our page but moreover, are also going to be fetched on state update.

```javascript
import React, {useState, useEffect} from 'react';

const Tab1: React.FC = () => {

  useEffect( () => {
      fetchData(true);
  }, [filter]);

};
```

We import the Ionic buttons and labels.

```javascript
import { IonButton, IonLabel } from "@ionic/react";
```

And are finally using these components to trigger the filtering of the list of
dogs with only dachshund.

```html
<IonButton onClick="{()" ="">
	setFilter('dachshund')}>
	<IonLabel>Filter</IonLabel>
</IonButton>
```

### Altogether

I have implemented this filter example in the second tab of the demo solution I’ve uploaded to [GitHub](https://github.com/peterpeterparker/infiniteScroll/blob/master/src/pages/Tab2.tsx) 🐕

### Test

If you run the application again, you should now be able to filter the list with only dachshund 🥳

![](https://daviddalbusco.com/assets/images/1*dCTUxVxI8yfkxGsqtV0baA.gif)

_So much dachshund_

### Cherry on the cake 🍒🎂

Infinite Scroll is only one of the wonderful features of Ionic + React and only one of those I have used in the prototype I have implemented for our Meetup. Furthermore, the small application I’ve built is free and open source, give it a try, give a try to [Wooof](https://wooof.ch) 🐶

To infinity and beyond 🚀

David
