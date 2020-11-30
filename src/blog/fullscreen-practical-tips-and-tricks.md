---
path: "/blog/fullscreen-practical-tips-and-tricks"
date: "2020-06-10"
title: "Fullscreen: Practical Tips And Tricks"
description: "Toggle the fullscreen mode with any browser, a Sass mixin for polyfill and hide the mouse on inactivity"
tags: "#javascript #webdev #css #typescript"
image: "https://cdn-images-1.medium.com/max/1600/1*qyf7I6z6WCwU_jGOBpacng.jpeg"
canonical: "https://medium.com/@david.dalbusco/fullscreen-practical-tips-and-tricks-cebcba69fb95"
---

![](https://cdn-images-1.medium.com/max/1600/1*qyf7I6z6WCwU_jGOBpacng.jpeg)

*Photo by [Jr Korpa](https://unsplash.com/@korpa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/full-screen-wallpapers?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

There are already a dozen of existing tutorial about the [Web Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API), but as I was restyling last Saturday the toolbar for the presenting mode of [DeckDeckGo](https://deckdeckgo.com), our editor for presentations, I noticed that I never shared the few useful tricks we have implemented.

These are:

* How to implement a toggle for the fullscreen mode compatible with any browser
* Create a Sass mixin to polyfill the fullscreen CSS pseudo-class
* Hide the mouse cursor on inactivity

*****

### Toggle Fullscreen Mode With Any Browser

The API exposes two functions to toggle the mode, `requestFullscreen()` to enter the fullscreen or `exitFullscreen()` for its contrary. 

```javascript
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
```

Even if the methods are well supported across browser, you might notice on [Caniuse](https://caniuse.com/#search=requestFullscreen) a small yellow note next to some version number.

![](https://cdn-images-1.medium.com/max/1600/1*EO0i13KYRL7b9d7LxDbT6w.png)

*Caniuse | Full screen API | Jun 9th 2020*

Indeed, currently Safari and older browser’s version, are not compatible with the API without prefixing the functions with their respective, well, prefix. That’s why, if you are looking to implement a cross-browser compatible function, it is worth to add these to your method.

```javascript
function toggleFullScreen() {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen = 
               docEl.requestFullscreen || 
               docEl.mozRequestFullScreen ||
               docEl.webkitRequestFullScreen || 
               docEl.msRequestFullscreen;
  const cancelFullScreen = 
              doc.exitFullscreen || 
              doc.mozCancelFullScreen || 
              doc.webkitExitFullscreen || 
              doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && 
      !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}
```

*Note that I found the above code in the *[Google Web Fundamentals](https://developers.google.com/web/fundamentals/native-hardware/fullscreen)*.*

*****

### Sass Mixin

The `:fullscreen` CSS pseudo-class (documented [here](https://developer.mozilla.org/en-US/docs/Web/CSS/:fullscreen)) is useful to style element according the fullscreen mode.

```css
#myId:fullscreen {
  background: red;
}

#myId:not(:fullscreen) {
  background: blue;
}
```

It is well supported across browser, as displayed by [Caniuse](https://caniuse.com/#search=%3Afullscreen), but you might also again notice some limitation, specially when it comes to Safari. That’s why it might be interesting to polyfill the pseudo-class.

![](https://cdn-images-1.medium.com/max/1600/1*s3cBdYOjRVpc_2PhYxmyzw.png)

*Caniuse | Full screen API | Jun 9th 2020*

Moreover, if many elements have to be tweaked regarding the mode, it might interesting to use [Sass](https://sass-lang.com/) and a mixin. That’s why, here is the one we are using.

```sass
@mixin fullscreen() {
  #{if(&, "&", "*")}:-moz-full-screen {
    @content;
  }
  #{if(&, "&", "*")}:-webkit-full-screen {
    @content;
  }
  #{if(&, "&", "*")}:-ms-fullscreen {
    @content;
  }
  #{if(&, "&", "*")}:fullscreen {
    @content;
  }
}
```

With its help, you can now declare it once and group all your fullscreen styles.

```sass
@include fullscreen() {
  #myId {
    background: blue;
  }

  #myMenu {
    display: none;
  }

  #myFooter {
    background: yellow;
  }
}
```

*I have the filling that I did not write this mixin by myself, entirely at least, but I could not figured out anymore where I did find it, as I am using it since a while now. If you are her/his author, let me know. I would be happy to give you the credits!*

*****

### Hide Mouse Pointer On Inactivity

Do you also notice, when a presenter has her/his presentation displayed in fullscreen, if the mouse cursor is still displayed somewhere on the screen?

I do notice it and I rather like to have it hidden 😆. And with rather like I mean that when I noticed this behavior in [DeckDeckGo](https://deckdeckgo.com), I had to develop a solution asap. even if I was spending surf holidays in India (you can check my GitHub commit history, I am not joking, true story 🤣).

![](https://cdn-images-1.medium.com/max/1600/1*krc3a3DHYjqUkw-CQjaLEw.gif)

In order to detect the inactivity, we listen to the event [mousemove](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event). Each time the event is fired, we reset a timer and delay the modification of the style [cursor](https://developer.mozilla.org/fr/docs/Web/CSS/cursor) to hide the mouse. Likewise, if we are toggling between fullscreen and normal mode, we proceed with the same function.

```html
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" 
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
    <title>Hide mouse on inactivity</title>
  </head>
  <body style="margin: 0; overflow: hidden;">
    <script type="text/javascript">
      let idleMouseTimer;

      document.addEventListener('mousemove', mouseTimer);

      function mouseTimer() {
        showHideMouseCursor(true);

        clearTimer();

        if (!isFullscreen()) {
          return;
        }

        idleMouseTimer = setTimeout(async () => {
          showHideMouseCursor(false);
        }, 2000);
      }

      function clearTimer() {
        if (idleMouseTimer > 0) {
          clearTimeout(idleMouseTimer);
        }
      }

      function isFullscreen() {
        return window.innerHeight == screen.height;
      }

      function showHideMouseCursor(show) {
        document.querySelector('div').style
                .setProperty('cursor', show ? 'initial' : 'none');
      }

      function toggleFullScreen() {
        const doc = window.document;
        const docEl = doc.documentElement;

        const requestFullScreen = 
                     docEl.requestFullscreen ||    
                     docEl.mozRequestFullScreen ||  
                     docEl.webkitRequestFullScreen || 
                     docEl.msRequestFullscreen;

        const cancelFullScreen = 
                    doc.exitFullscreen || 
                    doc.mozCancelFullScreen || 
                    doc.webkitExitFullscreen || 
                    doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && 
            !doc.webkitFullscreenElement && 
            !doc.msFullscreenElement) {
          requestFullScreen.call(docEl);
        } else {
          cancelFullScreen.call(doc);
        }

        mouseTimer();
      }
    </script>

    <div style="display: block; width: 100vw; height: 100vh;">
      <button onclick="toggleFullScreen()" 
              style="position: absolute; 
                     top: 50%; left: 50%; 
                     transform: translate(-50%, -50%);">
        Toggle fullscreen
      </button>
    </div>
  </body>
</html>
```

*****

### Conclusion

I hope that these above tips, we did apply in our editor and developer kit, are going to be useful to someone, somewhere, someday. If you have any questions, ping me with any comments.

Give a try to [DeckDeckGo](https://deckdeckgo.com) for your next presentation 😇.

To infinity and beyond

David
