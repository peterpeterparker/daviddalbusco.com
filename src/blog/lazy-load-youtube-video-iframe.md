---
path: "/blog/lazy-load-youtube-video-iframe"
date: "2020-01-09"
title: "Lazy Load YouTube Video <iFrame/>"
description: "How to lazy load Youtube Video using the Intersection Observer API."
tags: "#javascript #react #tutorial #webdev"
image: "https://daviddalbusco.com/assets/images/1*IwlNLyd4Db7716sLSeGq_w.jpeg"
canonical: "https://medium.com/@david.dalbusco/lazy-load-youtube-video-iframe-8838e1913751"
---

![](https://daviddalbusco.com/assets/images/1*IwlNLyd4Db7716sLSeGq_w.jpeg)

_Photo by [Julia Joppien](https://unsplash.com/@vitreous_macula?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

The [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is often used to lazy load images but did you know that it can be used to defer any types of elements?

This week I developed a new landing page for [DeckDeckGo](https://deckdeckgo.com), our web open source editor for presentations, in which I’ll showcase some video. That’s why, for performance reason, I had to postpone their loading and why also, I’m sharing this new blog post.

### Soundtrack

In this article we are going to lazy load a music video clip from my hometown friends [Maxi Puch Rodeo Club](https://maxipuchrodeoclub.bandcamp.com). I could only highly advise you to play the following video in order to stream some great music while reading this blog post 😉

<iframe width="280" height="158" src="https://www.youtube.com/embed/ol0Wz6tqtZA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe
<br/>

### Getting Started

I implemented this experiment with [React](https://reactjs.org/) but the concept could be use with or without any frameworks. Before we actually defer the loading of the video, let’s add it to a component (I collected the `iframe` embedded code using the share action provided by Youtube).

```javascript
import React from "react";

const Video = () => {
	return (
		<div>
			<div style={{ display: "block", height: "2000px", background: "violet" }}>
				Maxi Puch Rodeo Club
			</div>

			<div>
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/ol0Wz6tqtZA"
					frameBorder="0"
					allow="accelerometer;
                           autoplay;
                           encrypted-media;
                           gyroscope;
                           picture-in-picture"
					allowFullScreen
					title="Maxi Puch Rodeo Club"
				></iframe>
			</div>
		</div>
	);
};

export default Video;
```

We can now open our browser and check that it is effectively loaded at the same time that our page. You will notice that the Youtube url is loaded even if the video is not displayed.

![](https://daviddalbusco.com/assets/images/1*MrPtsQS5FB6aF0L-eXncfQ.gif)

### Obfuscate The Video

We create a new state to display or not our video. Per default, as we don’t want to load it when our page load, we set it to `false`.

```javascript
const [showVideo, setShowVideo] = useState(false);
```

To defer the loading of the video, we are going to use the Intersection Observer API. It will detect if the element is (or going to be) visible in the viewport (if we don’t specify another root to observe). As soon as such a visibility is detected, it will triggers an event to let us perform a task, respectively to let us effectively load the video.

That’s why we are also wrapping our element in a container, because we do need an element to observe during the page lifecycle, regardless of the state of our video. Furthermore, we also create a reference to it in order to instantiate our observer later on.

```javascript
import React, { createRef, useState } from "react";

const Video = () => {
	const [showVideo, setShowVideo] = useState(false);

	const container = createRef();

	return (
		<div>
			<div style={{ display: "block", height: "2000px", background: "violet" }}>
				Maxi Puch Rodeo Club
			</div>

			<div ref={container}>
				{showVideo ? (
					<iframe
						width="560"
						height="315"
						src="https://www.youtube.com/embed/ol0Wz6tqtZA"
						frameBorder="0"
						allow="accelerometer;
                           autoplay;
                           encrypted-media;
                           gyroscope;
                           picture-in-picture"
						allowFullScreen
						title="Maxi Puch Rodeo Club"
					></iframe>
				) : undefined}
			</div>
		</div>
	);
};

export default Video;
```

We can test our app in the browser, as we did previously, and should notice that the video is now neither loaded nor displayed.

![](https://daviddalbusco.com/assets/images/1*1EPwmYUiUcKyGdsochnN2w.gif)

### Lazy Loading

Finally we can create our observer. The `rootMargin` is used to add a bounding box around the element to compute the intersections and `threshold` indicates at what percentage of the target’s visibility the observer’s callback should be executed.

```javascript
const videoObserver = new IntersectionObserver(onVideoIntersection, {
	rootMargin: "100px 0px",
	threshold: 0.25
});
```

To instruct it to observe our container, we add a `useEffect` hook which will be executed according the container. Moreover, we also test if the browser do supports the API (which is [supported](https://caniuse.com/#search=intersection%20observer) currently by all modern platforms) and fallback on an “instant” load, if it would not be the case (“Hello darkness IE my old friend” 😅).

```javascript
useEffect(() => {
	if (window && "IntersectionObserver" in window) {
		if (container && container.current) {
			videoObserver.observe(container.current);
		}
	} else {
		setShowVideo(true);
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [container]);
```

Finally, we declare a function which will be triggered when the container reaches the viewport. We use it to modify our state, in order to display the video, and to `disconnect` our observer, as we do not need it anymore.

```javascript
function onVideoIntersection(entries) {
	if (!entries || entries.length <= 0) {
		return;
	}

	if (entries[0].isIntersecting) {
		setShowVideo(true);
		videoObserver.disconnect();
	}
}
```

Voilà, that’s it 🎉 We could perform our test again an notice that the video is only loaded when needed respectively when the container appears 😃

![](https://daviddalbusco.com/assets/images/1*nXaa2aaSs1jTOPN7XEm0xA.gif)

### Going Further

Lazy loading is great but you might want also to add some custom control to `play` and `pause` your video. For that purpose, we can either code it by ourselves, with the [YouTube Player API Reference for iframe Embeds](https://developers.google.com/youtube/iframe_api_reference), or use one of the many existing libraries, but, DeckDeckGo is open source and we do split our platform in multiple standalone components, therefore guess what? We do share a [Web Component](https://docs.deckdeckgo.com/components/youtube) to embed easily Youtube video in your applications 😊

Let’s install it.

```bash
npm install @deckdeckgo/youtube --save
```

And load it in our application.

```javascript
import { applyPolyfills, defineCustomElements } from "@deckdeckgo/youtube/dist/loader";

applyPolyfills().then(() => {
	defineCustomElements(window);
});
```

Then, we remove our state to display or not the video, because the Web Component won't load anything until further notice. We replace it with a new function called `loadVideo` in which we execute the component's method `lazyLoadContent` which takes care of everything.

```javascript
async function loadVideo() {
	if (container && container.current) {
		container.current.lazyLoadContent();
	}
}
```

Finally, we add two buttons, used to call `play` and `pause` and we replace our `iframe` with the component `<deckgo-youtube/>`.

```javascript
import React, { createRef, useEffect } from "react";

import { applyPolyfills, defineCustomElements } from "@deckdeckgo/youtube/dist/loader";

applyPolyfills().then(() => {
	defineCustomElements(window);
});

const Video = () => {
	const container = createRef();

	const videoObserver = new IntersectionObserver(onVideoIntersection, {
		rootMargin: "100px 0px",
		threshold: 0.25
	});

	useEffect(() => {
		if (window && "IntersectionObserver" in window) {
			if (container && container.current) {
				videoObserver.observe(container.current);
			}
		} else {
			loadVideo();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [container]);

	function onVideoIntersection(entries) {
		if (!entries || entries.length <= 0) {
			return;
		}

		if (entries[0].isIntersecting) {
			loadVideo();
			videoObserver.disconnect();
		}
	}

	async function loadVideo() {
		if (container && container.current) {
			container.current.lazyLoadContent();
		}
	}

	return (
		<div>
			<div style={{ display: "block", height: "2000px", background: "violet" }}>
				Maxi Puch Rodeo Club
			</div>

			<button onClick={async () => await container.current.play()}>Start</button>
			<button onClick={async () => await container.current.pause()}>Pause</button>

			<deckgo-youtube
				ref={container}
				src="https://www.youtube.com/embed/ol0Wz6tqtZA"
			></deckgo-youtube>
		</div>
	);
};

export default Video;
```

We proceed with our final test, notice that the video is lazy loaded, we play with the buttons and we enjoy the awesome music of [Maxi Puch Rodeo Club](https://maxipuchrodeoclub.bandcamp.com/) 🪕🥁🎵👍

![](https://daviddalbusco.com/assets/images/1*skQICbYpu0Q-x2C6u3TgkA.gif)

### Contribute To Our Project

Even if it does the job, our component can be improved. I notably think that a smoother transition to display the video would be useful. That’s why I opened a good first issue in our repo on [GitHub](https://github.com/deckgo/deckdeckgo/issues/570). If you are up to give a hand, your help would be appreciated 🙏.

### Cherry on the Cake 🍒🎂

Our component `@deckdeckgo/youtube` is a Web Component developed with [Stencil](https://stenciljs.com) and therefore it could be use in any modern web applications, with or without any frameworks. Moreover, if like me you tend to be a bit “bundlephobic”, it will add to your application, once minified and gzipped, only [198 bytes](https://bundlephobia.com/result?p=@deckdeckgo/youtube@1.0.0-rc.1-2).

To infinity and beyond 🚀

David
