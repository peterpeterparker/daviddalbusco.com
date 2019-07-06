---
path: "/blog/how-to-implement-the-web-share-api-with-a-fallback"
date: "2019-06-10"
title: "How to implement the Web Share API with a fallback"
description: "How to implement the Web Share API with a fallback"
tags: "#javascript #webdev #beginners #tutorial"
image: "https://cdn-images-1.medium.com/max/2400/1*rjWBYTwXqa5YsogRl5kPdg.jpeg"
---

![](https://cdn-images-1.medium.com/max/2400/1*rjWBYTwXqa5YsogRl5kPdg.jpeg)
*Photo by [Noiseporn](https://unsplash.com/@noiseporn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/social-share?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

In the past weeks I often had to implement the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) in several applications. As it is not yet [supported](https://caniuse.com/#search=web%20share%20api) by all browsers and devices, I always had to implement the same fallback, respectively I always used the open source Web Component I developed called “[Web Social Share](https://websocialshare.com/)” as a fallback. That’s why I’m sharing my solution with this new blog post, hoping that maybe someday it will help someone or even better, that maybe someone will ping me back with a better solution 😁

### Getting started

The following implementation is pretty straight forward. We are going to implement a share method which detects if the Web Share API is supported by the browser or not. If supported it will, I guess you get it, use and open the Web Share API otherwise it will open the share fallback.

![](https://cdn-images-1.medium.com/max/1600/1*6rNMJkG_C-N6B-5ibAL_8Q.gif)
*Safari (left) supports Web Share API, Chrome (desktop, right) doesn’t support it and fallback to the Web Component “Web Social Share”*

### Main function and detection

First, we are going to implement a main share function which checks which share method should be use.

```
<script language="JavaScript">
  openShare = async () => {
    if (navigator && navigator.share) {
      await shareNative();
    } else {
      await shareFallback();
    }
  };
</script>
```

### Web Share API

We are now going to implement the above method called `shareNative()` which will use the Web Share API.

This API accepts three parameters currently: `url` , `text` and `title` . Only one of these parameters should at least be provided but I suggest you to use `text` and `url` . Using these two will for example allow you to add a nice message when a user would share an URL on Twitter.

![](https://cdn-images-1.medium.com/max/1600/1*q6V5upxh3zwklbrMajj9fQ.jpeg)

The Web Share API is promised based and we are going to implement it like the following:

```
function shareNative() {
  return new Promise(async (resolve) => {
    const shareUrl =
          `${window.location.protocol}//${window.location.host}`;

    await navigator.share({
      text: 'How to implement the Web Share API and a fallback',
      url: shareUrl,
    });

    resolve();
  });
}
```

*We are using `window.location` to build dynamically the url we are going to share. You could replace this piece of code with any valid URL as a string if you rather like.*

### Web Social Share as Fallback

The Web Component I developed need firstly to be consumed. You could install it through [npm](https://www.npmjs.com/package/web-social-share) but in this tutorial we are just going to use it with the help of [Unpkg](https://unpkg.com). For that purpose, we are going to add the following scripts to our HTML page:

```
<script type="module"
    src="https://unpkg.com/web-social-share@latest/dist/websocialshare/websocialshare.esm.js"></script>
<script nomodule 
    src="https://unpkg.com/web-social-share@latest/dist/websocialshare/websocialshare.js"></script>
```

The component doesn’t ship any icons respectively we will have to provide our own. I designed the component that way because I thought that it makes more sense to not “force” the developer to use an icon which might not fits its design. Therefore, in this tutorial, we are going to use the [Ionicons](https://ionicons.com) which we are going to consume using Unpkg too. Of course, if your application already contains its own set of icons, just skip this step.

```
<script src="https://unpkg.com/ionicons@latest/dist/ionicons.js"></script>
```

#### Declaration

In opposition to the Web Share API, this component can’t guess which methods are available on the device where it runs. That’s why it only exposes a couple of share methods. In this tutorial we are going too implement the options `Email`, `Twitter` and `WhatsApp`.

To declare the component we are going to add it to the page, specifying that per default it should not be displayed ( `show="false"` ). We are also going to specify the icons we want to use. Note that these are passed to the component using `slot` and could be inline styled.

```
<web-social-share show="false">
  <ion-icon name="logo-twitter" ariaLabel="Twitter" slot="twitter"
            style="color: #00aced;">
  </ion-icon>
  <ion-icon name="mail" slot="email" ariaLabel="Email" 
            style="color: #ff8ea3;">
  </ion-icon>
  <ion-icon name="logo-whatsapp" ariaLabel="WhatsApp"
            slot="whatsapp"
            style="color: #25D366;">
   </ion-icon>
</web-social-share>
```

*If you never use `slot` before and want to know a bit more about them, I wrote another article “[A practical introduction to styling a Shadow DOM and Slots](https://medium.com/stencil-tricks/a-practical-introduction-to-styling-a-shadow-dom-and-slots-879565a2f423)” which tries to explain practically how these could be used and styled.*

#### Implementation

Now that we have consumed and declared the Web Component, we just have to implement the final piece with the implementation of the above mentioned method called `shareFallback()`.

This function will query the DOM for a reference on the component (using `document.querySelector` ), define the share options and finally will trigger the display of the share options by modifying its `show` attribute (the component listen for changes on this attribute to display or not its toolbar).

```
function shareFallback() {
  return new Promise(async (resolve) => {
    const webSocialShare =
          document.querySelector('web-social-share');

    if (!webSocialShare || !window) {
      return;
    }

    const shareUrl =
          `${window.location.protocol}//${window.location.host}`;

    const share = {
      displayNames: true,
      config: [{
        twitter: {
          socialShareUrl: shareUrl,
          socialSharePopupWidth: 300,
          socialSharePopupHeight: 400
        }
      },{
        email: {
          socialShareBody: shareUrl
        }
      }, {
        whatsapp: {
          socialShareUrl: shareUrl
        }
      }]
    };
    // The configuration, set the share options
    webSocialShare.share = share;
    // Show/open the share actions
    webSocialShare.show = true;

    resolve();
  });
}
```

That’s it, we have implemented the Web Share API and a fallback 🎉

### Trying it out

To try out the implementation, we could just add for example a `button` which calls `openShare()` when its clicked.

```
<button onClick="openShare()">Share</button>
```

If everything went according plan, the result should looks like the following:

![](https://cdn-images-1.medium.com/max/1600/1*MtKK5WfJQJq0piMe1Gfj9Q.gif)
*Again, Safari (left) supports Web Share API and Chrome (desktop) doesn’t and use the fallback*

### Cherry on the cake 🍒🎂

Like I said in my introduction, I implemented the above solution in several applications the past weeks, I notably implemented it in the [website](https://deckdeckgo.com/) and [starter kit](https://github.com/deckgo/deckdeckgo-starter) of DeckDeckGo, our upcoming open source web editor for presentations. Therefore don’t hesitate to have a look at the code and to ping me if you have a better solution to share or maybe even have a PR to submit to improves it 😉

To infinity and beyond 🚀

David
