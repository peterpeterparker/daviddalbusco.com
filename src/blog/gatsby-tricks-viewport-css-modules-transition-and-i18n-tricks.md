---
path: "/blog/gatsby-tricks-viewport-css-modules-transition-and-i18n-tricks"
date: "2020-03-26"
title: "Gatsby Tricks: Viewport, CSS Modules Transition And i18nTricks"
description: "Overriding Viewport settings, CSS modules transition and an i18n formatting tricks withGatsby"
tags: "#javascript #webdev #gatsby #css"
image: "https://cdn-images-1.medium.com/max/1600/1*ytcX2rE89fOxjHjKfEAJng.png"
canonical: "https://medium.com/@david.dalbusco/gatsby-tricks-viewport-css-modules-transition-and-i18n-tricks-a3d1089a4910"
---

![](https://cdn-images-1.medium.com/max/1600/1*ytcX2rE89fOxjHjKfEAJng.png)

*Photo by [Ronald Ladines](https://unsplash.com/@massrecall?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-four** days left until hopefully better days.

*****

Today  I developed further the new website I’m currently building with [Gatsby](https://www.gatsbyjs.org) for a new side project we have with two friends. I discovered some new tricks, that’s why there are the inspiration for my today’s diary entry.

*****

### Overriding Viewport

After a couple of hours of development, I had a basic website ready and even had developed the welcome page. I tested it across browsers and simulated different devices in Chrome, everything went fine until I tried out iPads.

I was a bit surprise because it did worked out everywhere else. As a skeptical person, of course my first reaction was “that’s probably a Chrome bug” (🤣), therefore I opened XCode and ran the same test on the simulator. To my surprise, the problem was still happening.

Concretely the following was happening.

![](https://cdn-images-1.medium.com/max/1600/1*t7rBjEcQRqcbuy183JaSSw.gif)

*Browser left ok vs iPad right not ok*

It took me a bit to finally figure out what was the problem but finally my spider-sense kicked in and I had the feeling that the problem was linked to the specification of the `viewport` in the `head` of the page.

At first, I tried to solve the issue while injecting the meta information in the `seo.js` page using [React Helmet](https://github.com/nfl/react-helmet). Unfortunately this didn’t worked out, as doing so, the page contained two meta information for the viewport and therefore mine was ignored. Finally, I found the solution in the Gatsby’s [documentation](https://www.gatsbyjs.org/docs/custom-html/). To solve my issue I had to copy the default cached file `.cache/default-html.js` to a new file `src/html.js` . Doing so, on each build, Gatsby will use my local configuration instead of the default one. Once copied I just had to modify the viewport and my problem was gone 🥳.

```html
<meta
  name="viewport"
  content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

*****

### CSS Modules Transition

My two colleagues, both designers, have always great design ideas. Often simple and effective but the more we collaborate together, the more we begin to add tiny animations to make everything cool 😎.

In this project I’m using [CSS modules](https://github.com/css-modules/css-modules) and to make some text appears, I had to use the property `transition` .

```css
h1 {
  opacity: 0;
  visibility: hidden;

  transition: opacity 0.25s 0.8s ease-in;

  &.animate {
    opacity: 1;
    visibility: inherit;
  }
}
```

To my surprise, again, what a day, `transition` didn’t worked out at all. I quickly noticed that the reason behind that was the `opacity` was converted to a scoped CSS. To be honest, I don’t know exactly why 🤷‍♂️. Anyway I figured out that by forcing its importation without transforming the property it solved my issue.

```css
:global {
  transition: opacity 0.25s 0.8s ease-in;
}
```

And speaking of this `transition` , did you now that second time parameter is the delay after which the transition should happens? The above can be read as: After 0.8 seconds, start a transition on the opacity property for 0.25s and do that slowly at the begin. Pretty cool 😁.

*****

### i18n formatting

I shared some learnings regarding Gatsby and i18n in a previous blog post about [internationalization](https://daviddalbusco.com/blog/internationalization-with-gatsby) but today I had to use [React-intl](https://github.com/formatjs/react-intl) a bit more.

I notably learned how to style a text. For example, let’s say we want to display a title “hello **world**”.

```javascript
module.exports = {
  "intro": "hello <strong>world</strong>",
}
```

We can either split it in two different translations or take advantages of the React-intl `FormattedMessage` component to style our text.

```javascript
<h1>
  <FormattedMessage
    id="intro"
    values={{
      strong: (...chunks) => <strong>{chunks}</strong>,
    }}
  />
</h1>
```

*****

### Summary

Nothing here which might send humanity to Mars but still, to me, small steps and small learning are rewarding too and these make my day. I hope this blog post was enjoyable to you and that it might help you in the future, who knows.

Stay home, stay safe!

David
