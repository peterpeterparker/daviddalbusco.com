---
path: "/blog/a-new-dead-simple-open-source-web-component-to-lazy-load-images"
date: "2019-05-17"
title: "A new dead simple open source Web Component to lazy load images"
description: "A new dead simple open source Web Component to lazy load images developed with StencilJS"
tags: "#webdev #javascript #programming #opensource"
image: "https://cdn-images-1.medium.com/max/2400/1*fGVtZ0a_ki-Vg14YzJqKYQ.jpeg"
---

![](https://cdn-images-1.medium.com/max/2400/1*fGVtZ0a_ki-Vg14YzJqKYQ.jpeg)
*A lazy good girl or boy. Photo by [Brianna Santellan](https://unsplash.com/photos/Zwvxj3ytTHcutm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Last month I published a blog post in which I tried to demonstrate how to [create a Web Component to lazy load images using Intersection Observer](https://dev.to/daviddalbusco/create-a-web-component-to-lazy-load-images-using-intersection-observer-45gf) and it turned out afterwards, that I actually had  to use my own medicine several times while developing [DeckDeckGo](https://deckdeckgo.com), our upcoming open source editor for presentations.

That’s why we are happy to publish on [npm](https://www.npmjs.com/package/deckdeckgo-lazy-img) today a new dead simple
open source Web Component, developed with [StencilJS](https://stenciljs.com), to lazy load images in any modern web projects regardless of which framework (or none) you are using 😃

### But why?

![](https://cdn-images-1.medium.com/max/1600/1*evsRlXzetp7FdEOK2ynL1Q.gif)
*But why another Web Component to lazy load images?*

You may ask yourself why we had to develop and publish a new Web Component to lazy load images when it’s so easy to just write a couple of lines of Javascript, using the [Intersection Observer API](https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API), to already have images supporting lazy loading 🤔

In fact, as I said before, we are developing an open source web editor for presentations build with Web Components. To save your edited data, the slides of your presentations, we have to save the (HTML) content into the database. As we are developing our tool for speed, all components and notably images have to be lazy loaded. For that purpose, we are “playing” with the `src` attributes of the images, tweaking them “on and off” to tell the browser when exactly images should be fetched or not and that is the root cause of our problem.

As we were saving the content and manipulating the `img` elements of the DOM, we were not able to ensure that we were always saving images in a “not loaded state” in our database, without having to add a couple of extra functions and recursions, which, we were not agree to implement, as it would have added complexity and computation time to the process. That’s why we came up to the idea of using a custom Web Component to isolate the lazy loading process and therefore to always be able to sav and load images in and from our database in the correct state without any extra checks.

![](https://cdn-images-1.medium.com/max/1600/1*6w47kZMDJi-TfOMt1LJd8Q.gif)
*Funny gifs but it took us actually three days to figure out what was the
solution* 😂

### Integration with a framework

You could install our component in your project using the following npm command:

```
npm i @deckdeckgo/lazy-img --save
```

Once installed, you could integrate it according the needs of the framework you are using like described in the Stencil’s [documentation](https://stenciljs.com/docs/overview).

Finally you could use the component easily  in your project, for example by replacing your `img` tags with its tag, respectively `deckgo-lazy-img` (note that instead of `src` and `alt` you would have to use `img-src` and `img-alt`). 

Summarized, you could use the component like the following:

```
<deckgo-lazy-img
    img-src="/assets/img/your_image.png"
    img-alt="My lazy loaded image">
</deckgo-lazy-img>
```

That’s it, your image is lazy loaded 😄

### Integration without a framework

Our component could also be use in any projects where no framework would be use. For that purpose you would just use the component from a CDN, like for example from [Unpkg](https://unpkg.com), and then consume it like displayed above. 

Again, summarized, you could do the following:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://unpkg.com/@deckdeckgo/lazy-img@latest/dist/deckdeckgo-lazy-img.js"></script>
</head>
<body>
  <deckgo-lazy-img
    img-src="/assets/img/your_image.png"
    img-alt="My lazy loaded image">
  </deckgo-lazy-img>
</body>
</html>
```

### Responsiveness

Once this small blog post was published, I received a couple of feedbacks and notably one from [Alex Russell](https://twitter.com/slightlylate/status/1129465541167501313) who had the idea to introduce the support for [responsive images](https://developer.mozilla.org/enzUS/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) with the use of attributes `srcset` and `sizes`. Of course I thought it was an awesome idea and therefore I already implemented it and published it to npm 🤪

### Cherries on the cake 🍒🎂

For once in my small blog posts, there are more than just one cherry on the cake 😉

First of all, the component is open source and its code is available on our [Github repo](https://github.com/deckgo/deckdeckgo/tree/master/webcomponents/lazy-img), therefore you could access it and improve it according your needs.

Secondly, I took a bit of time to document all its attributes and features which are available in our [documentation website](https://docs.deckdeckgo.com/components/lazy-img).

Finally, there might be some use cases where you would like to trigger “manually” the loading of the images respectively earlier than the Intersection Oberserver would do. For that purpose, the component is exposing an asynchronous method `lazyLoad()` which would let you do so 😇

```
const element = document.querySelector('deckgo-lazy-img');
await element.lazyLoad();
```

I hope this new dead simple Web Component might help you and don’t hesitate to ping me with any feedbacks or any ideas of improvements, specially as we are using it “for real” in a new super duper cool feature we might be able to showcase really soon 😜

To infinity and beyond 🚀

David
