---
path: "/blog/an-open-source-medium-like-wysiwyg-editor"
date: "2020-04-17"
title: "An Open Source Medium Like WYSIWYG Editor"
description: "Add our WYSIWYG floating or sticky editor to any web applications"
tags: "#showdev #webdev #javascript #webcomponents"
image: "https://cdn-images-1.medium.com/max/1600/1*mEgbLcMRBUaJIvwIdirEvg.png"
canonical: "https://medium.com/@david.dalbusco/an-open-source-medium-like-wysiwyg-editor-1258d3efdf92"
---

![](https://cdn-images-1.medium.com/max/1600/1*mEgbLcMRBUaJIvwIdirEvg.png)

*Photo by [Silviana Toader](https://unsplash.com/@silviana?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Two** days left until this first milestone. Hopefully better days are ahead.

*****

For [DeckDeckGo](https://deckdeckgo.com) our editor for presentations, we have developed many custom made open source Web Components developed with [Stencil](https://stenciljs.com/).

One of these is a Medium Like WYSIWYG editor.  It can be integrated in any modern web applications, regardless of its technologies, and works on any devices (desktop, tablet and mobile).

![](https://cdn-images-1.medium.com/max/1600/1*Dgkj18MA4FGYsd1FmYSegA.gif)

I am actually not sure if I ever shared this component or not but as I spent my day improving its layout, bringing it some attention (love) it well deserved, and release a new version, that’s why I’m sharing it with you with this new blog post 😉.

*****

### Installation

We are providing some guidance in our [documentation](https://docs.deckdeckgo.com/components/inline-editor) and Stencil is also displaying how any components can be installed in with any [frameworks](https://stenciljs.com/docs/overview).

*****

#### Install From A CDN

To fetch the component from a CDN, as for example [Unpkg](https://unpkg.com/), add the following to the header of your HTML.

```html
<script type="module" src="https://unpkg.com/@deckdeckgo/inline-editor@latest/dist/deckdeckgo-inline-editor/deckdeckgo-inline-editor.esm.js"></script>

<script nomodule="" src="https://unpkg.com/@deckdeckgo/inline-editor@latest/dist/deckdeckgo-inline-editor/deckdeckgo-inline-editor.js"></script>
```

*****

#### Install From NPM

To install the project from [npm](https://www.npmjs.com/), run the following command in your terminal:

```bash
npm install @deckdeckgo/inline-editor
```

According your need, either import it:

```javascript
import '@deckdeckgo/inline-editor';
```

Or use a custom loader:

```javascript
import { defineCustomElements as deckDeckGoElement } from '@deckdeckgo/inline-editor/dist/loader';

deckDeckGoElement();
```

*****

### Add The Component To Your Application

I like when component’s usage is dead simple.  To add it to your application, “just” add it to the DOM and you are good to go.

```html
<deckgo-inline-editor></deckgo-inline-editor>
```

That’s it, you have added a WYSIWYG editor to your application 🎉.

*****

### Editable Elements

Per default, the component will make any elements `h1` , `h2` , `h3` , `h4` , `h5` , `h6` and `div` for which the attribute `contenteditable` is defined editable.

If like us with our editor, you would have other need, for example we handle content in `section` , you can override this list with the help of the property `containers` .

```html
<deckgo-inline-editor containers="h1,h2,section">
</deckgo-inline-editor/>
```

As you can notice, as soon as I do so, the following paragraphs ( `p` ) are not editable anymore even though they are still set as `contenteditable` .

![](https://cdn-images-1.medium.com/max/1600/1*olJ2RT5ChCBiF6UP4ZBNSw.gif)

*****

### Container Element

You may like to allow the interaction only with a specific part of your application and not the all document. For such purpose, it does also expose a property `attachTo` . If you would provide it, then only mouse or touch events coming from that particular container are going to be considered.

*****

### Mobile Devices

On mobile devices, it might be not the best UX to use a floating editor. When users are selecting text on their devices, a default list of system OS options (copy, paste, etc.) are automatically displayed which might conflicts with the editor.

That’s why we had the idea to make optionally the editor sticky on mobile devices.

```html
<deckgo-inline-editor containers="h1,h2,section"
                      sticky-mobile="true">
</deckgo-inline-editor>
```

Note that the editor is displayed at the top on iOS and bottom on Android. I rather like this last version but I did not find a clever way to solve this on iOS as the Webview is not resized and the keyboard size is not accessible.

![](https://cdn-images-1.medium.com/max/1600/1*yOasEsPf8xmnmrB1TMsMXg.gif)

Also worth to notice, the component emit an event `stickyToolbarActivated` when the toolbar is displayed. Thanks to this event, you can for example hide the header or footer of your applications, avoiding a small design glitch of two layers.

*****

### List And Alignment

We recently added the ability to modify the alignment, thanks to a Pull Request provided by [Akash Borad](https://twitter.com/BoradAkash). Not all heroes wear capes!

Even though, in our editor, we don’t use these as we are offering these two options in our main toolbar. That’s why the component exposes two properties, `list` and `align` , in case you would also not use these.

Likewise, images are not taken in account by the component per default. This can be modified with the help of another property, `img-editable` .

```html
<deckgo-inline-editor containers="h1,h2,section"
                      sticky-mobile="true"
                      list="false"
                      align="false"
                      img-editable="true">
</deckgo-inline-editor>
```

![](https://cdn-images-1.medium.com/max/1600/1*2EankUNvUC5y5p1bqZAqSQ.gif)

*****

### Colors

The colors can be modified with the help of our custom made color picker. It has a default palette but it can be overwritten too with its corresponding property `palette` .

![](https://cdn-images-1.medium.com/max/1600/1*eZl2B801qCtpxE9rmL3Iuw.gif)

*****

### RTL

If your application’s direction is Right-To-Left the component ordering will remains the same, but, automatically, the alignment feature will notice it and will be displayed as such per default.

![](https://cdn-images-1.medium.com/max/1600/1*CXis2-sk0Na3xKIrMCtZpQ.gif)

*****

### CSS Customization

I did not count but many CSS variables are available to style the component, notably everything which has to do with colors, backgrounds and selection. 

These are displayed in our [documentation](https://docs.deckdeckgo.com/components/inline-editor).

As always, if something is missing or if you would need a feature, ping us on [GitHub](https://github.com/deckgo/deckdeckgo/). Furthermore, Pull Requests are most welcomed 😁.

*****

### And More…

There are more options, as being able to provide a custom action or make the component also sticky on desktop.

*****

### Summary

To speak frankly, this is probably the most complicated component I ever had to develop. I think the fact that it is shadowed and that the [Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) is not yet that friendly with it did not make things easier. Even though I am happy with the results, it works well in our [editor](https://deckdeckgo.com) and I hope it can someday be useful to someone somewhere too.

Stay home, stay safe!

David
