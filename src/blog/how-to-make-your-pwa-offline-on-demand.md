---
path: "/blog/how-to-make-your-pwa-offline-on-demand"
date: "2020-05-21"
title: "How To Make Your PWA Offline On Demand"
description: "Download your Progressive Web Apps content à la Netflix or Spotify"
tags: "#showdev #webdev #javascript #pwa"
image: "https://cdn-images-1.medium.com/max/1600/1*LBBws2VRETowxwxMNKN--w.jpeg"
canonical: "https://medium.com/@david.dalbusco/how-to-make-your-pwa-offline-on-demand-7566d2f59280"
---

![](https://cdn-images-1.medium.com/max/1600/1*LBBws2VRETowxwxMNKN--w.jpeg)

*Photo by [Kym Ellis](https://unsplash.com/@kymellis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/wifi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Finally!

After the introduction of our web open source editor for presentations [DeckDeckGo](https://deckdeckgo.com) last year, one of the most requested feature was being able to work offline.

We have now implemented and launched this new capability and that’s why I would like to share with you our learning: how did we develop such a “download content à la Netflix or Spotify” feature for our Progressive Web Apps.

<iframe width="280" height="158" src="https://www.youtube.com/embed/J_VyyIlLuWg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe
<br/>

*****

### User Experience (UX)

There are many ways to approach the “offline” subject. One approach I can think of is making the all application, including its content, available offline, all the time.

Another one is what I call a “on demand offline content solution à la [Spotify](https://www.spotify.com/) or [Netflix](https://www.netflix.com/)” solution. An approach you are probably familiar with, as it is the one offered by these platforms which give their users the ability to download locally content, music or movies, only upon requests.

This approach is the one we implemented, and the one I am sharing with you.

![](https://cdn-images-1.medium.com/max/1600/1*fUjlTckDh0X3VthqvH0ANg.jpeg)

*****

### Introduction

To make the content of our PWA available offline we proceeded with following steps:

```javascript
async goOffline() {
  await this.lazyLoad();
  await this.saveContent();
  await this.cacheAssets();
  await this.toggleOffline();
}
```

*****

### Lazy Load

Our presentations are lazy loaded to improve performances. When you are browsing slides, only the current, previous and next one are loaded. Therefore, the first action required in order to go offline is downloading  locally all their assets (images, charts data, code languages etc.).

This can also be the case in your app. Imagine you have got a lazy loaded image down at the bottom of a page or in another location not accessed yet by your user. One solution would be to add it to your service worker precaching strategy but if it is dynamic and unknown at build time, you can’t do so.

Fortunately for us, lazy loading is the core of our solution, and it is supported per default by all our Web Components, that’s why in order to start such a process we only had to call one single function.

```javascript
private lazyLoad() {
  return new Promise(async (resolve, reject) => {
    try {
      const deck = document.querySelector('deckgo-deck');

      if (!deck) {
        reject('Deck not found');
        return;
      }

      await deck.lazyLoadAllContent();

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
```

Such process will take care of iterating through all slides and components to load their content. But these are not yet cached automatically unless you would use, as we do, a service worker.

We are relying on [Workbox](https://developers.google.com/web/tools/workbox/) to manage our strategies and are for example caching images as following. Note that we have two distinct strategies in place in order to to avoid CORS and opaque requests issues with third party providers.

```javascript
workbox.routing.registerRoute(
  /^(?!.*(?:unsplash|giphy|tenor|firebasestorage))(?=.*(?:png|jpg|jpeg|svg|webp|gif)).*/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        maxEntries: 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /^(?=.*(?:unsplash|giphy|tenor|firebasestorage))(?=.*(?:png|jpg|jpeg|svg|webp|gif)).*/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'cors-images',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        maxEntries: 60,
      }),
      new workbox.cacheableResponse.CacheableResponse({
        statuses: [0, 200],
      }),
    ],
  })
);
```

If you are curious about all strategies we developed, checkout out our [sw.js](https://github.com/deckgo/deckdeckgo/blob/master/studio/src/sw.js) script in our open source repo.

*****

### Save Content

As our users won’t have access to internet anymore, they will not be able to reach the database and fetch their content. That is why it has to be save locally.

Even though we are using [Cloud Firestore](https://firebase.google.com/docs/firestore) and libraries are already offering an “offline first” feature or support, we implemented our own custom solution.

That’s why, we have developed our own concept with the help of IndexedDB. For example, in the following piece of code we are fetching a deck from the online database and are saving it locally. Worth to notice that we are using the element unique identifier as storage key and the handy [idb-keyval](https://github.com/jakearchibald/idb-keyval) store.

```javascript
import {set} from 'idb-keyval';

private saveDeck(deckId: string): Promise<Deck> {
  return new Promise(async (resolve, reject) => {
    
    // 1. Retrieve data from online DB
    const deck = await this.deckOnlineService.get(deckId);

    if (!deck || !deck.data) {
      reject('Missing deck');
      return;
    }
    // 2. Save data in IndexedDB
    await set(`/decks/${deck.id}`, deck);

    resolve(deck);
  });
}
```

At this point you may ask yourself what’s the point? It is nice to have the content locally saved but it does not mean yet that the user will be able to use it once offline right? Moreover, you may fear that it would need a full rewrite of the application to consume these data isn’t it?

Fortunately, our application was already separated in different layers and with the help of a new global state, which tells if the application is `offline` or `online` , we were able to extend our singleton services to  make these behave differently with the databases according the mode.

Concretely, if online it interacts with Firestore, if offline, it interacts with IndexedDB.

```javascript
export class DeckService {
  private static instance: DeckService;

  private constructor() {
    // Private constructor, singleton
  }

  static getInstance() {
    if (!DeckService.instance) {
      DeckService.instance = new DeckService();
    }
    return DeckService.instance;
  }

  async get(deckId: string): Promise<Deck> {
    const offline = await OfflineService.getInstance().status();

    if (offline !== undefined) {
      return DeckOfflineService.getInstance().get(deckId);
    } else {
      return DeckOnlineService.getInstance().get(deckId);
    }
  }
}
```

The interaction with the online database remained the same, therefore we only had to move the function to a new service.

```javascript
get(deckId: string): Promise<Deck> {
  return new Promise(async (resolve, reject) => {
    const firestore = firebase.firestore();

    try {
      const snapshot = await firestore
        .collection('decks')
        .doc(deckId)
        .get();

      if (!snapshot.exists) {
        reject('Deck not found');
        return;
      }

      const deck: DeckData = snapshot.data() as DeckData;

      resolve({
        id: snapshot.id,
        data: deck
      });
    } catch (err) {
      reject(err);
    }
  });
}
```

Once refactored, we had to create its offline counterpart.

```javascript
get(deckId: string): Promise<Deck> {
  return new Promise(async (resolve, reject) => {
    try {
      const deck: Deck = await get(`/decks/${deckId}`);

      resolve(deck);
    } catch (err) {
      reject(err);
    }
  });
}
```

As you can notice, we are using the unique identifier as storage key which makes the all system really handy as we are able to fetch data locally almost as we would do if we would do with the online database. Doing so we did not had to modify the other layers of the application, everything was kind of working offline almost out of the box without any further changes.

*****

### Cache Assets

So far we were able to save locally the users’ data with IndexedDB, cache the content with the Service Worker, therefore all the presentation is available offline, but isn’t something else missing?

Yes indeed, something is still not cached: the assets of the applications itself.

Again this can be solved with a pre-cache strategy but if we are not able too, you would have to find an alternative.

Ours was the following. We created a new [JSON file](https://github.com/deckgo/deckdeckgo/blob/master/studio/src/assets/assets.json) in which we listed each and every assets we are using, including icons and fonts.

```json
{
  ...
  "navigation": [
     {"src": "/icons/ionicons/open.svg", "ariaLabel": "Open"},
     ...
}
```

Then, when user requests the offline mode, we iterate through each entry and are calling the Service Worker from the app context to trigger the caching.

```javascript
async function cacheUrls(cacheName: string, urls: string[]) {
  const myCache = await window.caches.open(cacheName);
  await myCache.addAll(urls);
}
```

If you are eager to know more about this specific feature, I published earlier this year another [blog post](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) about it.

*****

### Toggle Offline

Finally, as everything is cached and the internet access can now safely be turned off, we can save a global state to instruct our application to works in an offline mode.

*****

### Go Online

You know what’s really cool with the above solution? As we did not modify or limit any core features by “only” caching and adding some layers in our architecture, our users are not just able to read their content offline, it also remains **editable** 🔥.

This means that when users are back online, they should be able to transfer their local content to the remote database.

Such process follow the same logic as the one we developed.

```javascript
async goOnline() {
  await this.uploadContent();

  await this.toggleOnline();
}
```

All the local content has to be extracted from the IndexedDB and moreover, all local images or other content the user would have added locally has to be transferred to the remote storage.

```javascript
private async uploadDeck(deck: Deck) {
  await this.uploadDeckLocalUserAssetsToStorage(deck);
  await this.uploadDeckDataToDb(deck);
}
```

Happy to develop this process further if requested, ping me with your questions 👋.

*****

### Summary

I might only had tipped the top of the iceberg with this article, but I hope that I was at least able to share with you the general idea of our learning and solution.

Of course, I would be also super happy, if you would give our editor a try for your next talk 👉 [deckdeckgo.com](https://deckdeckgo.com).

To infinity and beyond!

David
