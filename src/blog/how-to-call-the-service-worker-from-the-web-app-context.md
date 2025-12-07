---
path: "/blog/how-to-call-the-service-worker-from-the-web-app-context"
date: "2020-03-16"
title: "How To Call The Service Worker From The Web App Context"
description: "How To Call The Service Worker From The Web App Context #OneTrickADay-34"
tags: "#motivation #javascript #tutorial"
image: "https://daviddalbusco.com/assets/images/1*4H2Zo7JLHzdfoDc-ltuy3A.png"
canonical: "https://medium.com/@david.dalbusco/one-trick-a-day-d-34-469a0336a07e"
---

![Photo by [Arindam Saha](https://unsplash.com/@flux_culture?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/day-1?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)](https://daviddalbusco.com/assets/images/1*4H2Zo7JLHzdfoDc-ltuy3A.png)_Photo by [Arindam Saha](https://unsplash.com/@flux_culture?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/day-1?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I literally just had such a bad idea I already know I might not make it, but well, it is worth a try 😅.

Switzerland goes on lockdown until 19th April 2020 and the state is asking us to remain at home. That’s why, I will try to share one trick a day until the end of the quarantine!

It is probably a bit optimistic, never set my self so far goals in terms of writing and I also already have preordered Disneyplus which suppose to begin is streaming really soon, but hey, you miss 100% of the shots you don’t take — Michael Scott.

## How To Call The Service Worker From The App Context

I will not go too deep in details, but let’s just say that I recently merged a nice new [feature](https://github.com/deckgo/deckdeckgo/pull/654) in [DeckDeckGo](https://deckdeckgo.com), our open source editor for presentations 😉. For this purpose I used [Workbox](https://developers.google.com/web/tools/workbox) and I had to trigger on demand the caching from the web app context.

For example, let’s say you have defined a rule to cache your images.

```javascript
workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|webp|svg)$/,
	new workbox.strategies.CacheFirst({
		cacheName: "images",
		plugins: [
			new workbox.expiration.Plugin({
				maxAgeSeconds: 30 * 24 * 60 * 60,
				maxEntries: 60
			})
		]
	})
);
```

When you app starts, matching images being part of the current route are going to be cached automatically by Workbox, respectively by the service worker. But, maybe, you do use other images, which are not yet displayed, but which you might also want to cache for an offline use.

This can be solved by requesting the service worker to cache specific routes or urls from your web app content.

```javascript
async function addToCache() {
	const list = ["/assets/img1.svg", "/assets/img2.svg"];

	const myCache = await window.caches.open("images");
	await myCache.addAll(list);
}
```

And that’s it. With the help of the above function, taken from the [documentation](https://developers.google.com/web/tools/workbox/guides/common-recipes), you can trigger the service worker to cache resources, routes or other requests on demand. Worth to notice that it can be called with or without user interaction, as you rather like.

```javascript
document.addEventListener("DOMContentLoaded", ($event) => {
	addToCache();
});

<button onclick="addToCache()">Go images offline</button>;
```

That’s it, this was the first of the tricks I will try share during this quarantine but hopefully only one of really few articles.

Stay home, stay safe!

David
