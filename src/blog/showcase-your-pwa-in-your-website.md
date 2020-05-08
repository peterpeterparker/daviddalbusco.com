---
path: "/blog/showcase-your-pwa-in-your-website"
date: "2020-05-08"
title: "Showcase Your PWA In Your Website"
description: "Introducing a new Web Component to embed applications in websites with stylish mobile devices iframes"
tags: "#showdev #webdev #javascript #webcomponents"
image: "https://cdn-images-1.medium.com/max/1600/1*dH35UnXlx3cw1RX4l8KIdw.png"
canonical: "https://medium.com/@david.dalbusco/develop-a-konami-code-for-any-apps-with-stencil-bd8b11a50071"
---

![](https://cdn-images-1.medium.com/max/1600/1*dH35UnXlx3cw1RX4l8KIdw.png)

Two weeks ago, [Matt Netkow](https://twitter.com/dotNetkow) introduced [Ionic React](https://ionicframework.com/docs/react) in an online presentation of the Ionic Zürich Meetup.

After a couple of minutes he [displayed](https://youtu.be/g1FRjVALfak?t=524) a features I never ever had thought about before: he showcased in his presentation an interactive embedded apps 🤯.

This literally let me speachless. What if anybody would be able to embed any interactive applications and websites easily in any slides?

I was convinced as soon as his idea hit my brain and that’s why I am happy to share with you this new feature of [DeckDeckGo](https://deckdeckgo.com), our web editor for presentations, and per extension, the new Web Component we are open sourcing!

![](https://cdn-images-1.medium.com/max/1600/1*FV6kFmGqYnXD2uIpQf27UA.gif)

*****

### Credits

It is not the first time [Matt](https://twitter.com/dotNetkow) inspired me a feature. If the landing page of our project is also a presentation itself, it is also because once he said that he found the idea interesting. Definitely Matt, thank you for the inspiration!

If you are familiar with the [Ionic](https://ionicframework.com/) ecosystem, you may already have noticed that the device’s frame showcased and used in the above example really looks like the one used in their documentation. I can’t argue about that and you are totally right. Instead of reinventing the wheel, we used the [style code](https://github.com/ionic-team/ionic-docs/tree/c5a624ac35d5285b871e7d8513d3849bdea63271/src/components/demo) they published under MIT license. Thank you Ionic for everything you do for the web 🙏.

*****

### Installation

We are providing some guidance in our [documentation](https://docs.deckdeckgo.com/components/demo) and Stencil is also displaying how any components can be installed in with any [frameworks](https://stenciljs.com/docs/overview).

*****

### Install From A CDN

To fetch the component from a CDN, as for example [Unpkg](https://unpkg.com/), add the following to the header of your HTML.

```javascript
<script type="module" src="https://unpkg.com/@deckdeckgo/demo@latest/dist/deckdeckgo-demo/deckdeckgo-demo.esm.js"></script>

<script nomodule="" src="https://unpkg.com/@deckdeckgo/demo@latest/dist/deckdeckgo-demo/deckdeckgo-demo.js"></script>
```

*****

### Install From NPM

To install the project from [npm](https://www.npmjs.com/), run the following command in your terminal:

```bash
npm install @deckdeckgo/demo
```

According to your need, either import it:

```javascript
import '@deckdeckgo/demo';
```

Or use a custom loader:

```javascript
import { defineCustomElements as deckDeckGoElement } from '@deckdeckgo/demo/dist/loader';

deckDeckGoElement();
```

*****

### Showcase Your Applications

To use the component and showcase your applications, use it as following where the property `src` is the URI of your Progressive Web Apps or website.

Note that we are also setting the property `instant` to `true` to render instantly the content as the default behavior of the component is set to be lazy loaded. In case of [DeckDeckGo](https://deckdeckgo.com), to maximize the load performances, only the current and next slides’ assets, and therefore `iframe` too, are loaded iteratively.

```html
<deckgo-demo 
        src="https://deckdeckgo.app"
        instant="true">
</deckgo-demo>
```

That’s it, you are showcasing your application 🎉.

*****

### Sizing

The component will automatically calculate the size of its content according the host available size.

```javascript
private async initSize() {
      const style: CSSStyleDeclaration | undefined = window ? window.getComputedStyle(this.el) : undefined;

      const width: number = style && parseInt(style.width) > 0 ? 
                   parseInt(style.width) : this.el.offsetWidth;

      const height: number = style && parseInt(style.height) > 0 ? 
                    parseInt(style.height) : this.el.offsetHeight;
      const deviceHeight: number = (width * 704) / 304;

      this.width = deviceHeight > height ? (height * 304) / 704 : width;
      this.height = deviceHeight > height ? height : deviceHeight;
    }
```

That’s why, you can either encapsulate it in a container and make it responsive or assign it a size using styling.

```javascript
<deckgo-demo 
        src="https://deckdeckgo.app"
        instant="true"
        style="width: 40vw; height: 90vh;">
</deckgo-demo>
```

Note also that the component will listen to resizing of the browser. Therefore, each time its size will change, it will resize itself automatically.

```javascript
window.removeEventListener('resize', 
       debounce(this.onResizeContent, 500));

private onResizeContent = async () => {
  await this.initSize();
  await this.updateIFrameSizeReload();
};
```

Worth to notice too that in order to be sure that the content of your integrated app fits correctly, on each resize of the browser, it will be reloaded too. This is achieved with the following ugly beautiful hack to reload cross-domain `iframe` .

```javascript
iframe.src = iframe.src;
```

*****

### Summary

Moreover than in slides, in which I definitely see a use case for such components because I am already looking forward to use it for my personal talks, I think it might be useful too, if for example, you are displaying a showcase of your realization in your website.

I also hope it made you eager to give [DeckDeckGo](https://deckdeckgo.com) a try for your next presentations 😊.

To infinity and beyond!

David

