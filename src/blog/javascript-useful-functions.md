---
path: "/blog/javascript-useful-functions"
date: "2020-04-12"
title: "JavaScript Useful Functions"
description: "A couple of useful JavaScript functions such as unifying events, debouncing or detecting mobile browsers"
tags: "#javascript #webdev #programming #tools"
image: "https://cdn-images-1.medium.com/max/1600/1*qvaNuuGMVDesVbjYY_fdoQ.png"
canonical: "https://medium.com/@david.dalbusco/javascript-useful-functions-2d9d3a9b603f"
---

![](https://cdn-images-1.medium.com/max/1600/1*qvaNuuGMVDesVbjYY_fdoQ.png)

*Photo by [Sam Moqadam](https://unsplash.com/@sammoqadam?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Seven** days left until this first milestone. Hopefully better days are ahead.

*****

We are using a couple of JavaScript functions across the multiple applications and Web Components of [DeckDeckGo](https://deckdeckgo.com).

Maybe these can be useful for your projects too?

*****

### Unifying Mouse And Touch Events

If you are implementing functions which have to do with user interactions through mouse or touch devices, there is a good change that their outcome are the same.

For example, presenters can draw over their presentations using our [remote control](https://deckdeckgo.app). For such purpose we use canvas and are attaching events such as:

```javascript
const canvas = document.querySelector('canvas');

canvas.addEventListener('mousedown', this.startEvent);
canvas.addEventListener('touchstart', this.startEvent);
```

As you can notice, both `mouse` and `touch` events are handled by the same functions, which is good, but unfortunately, can’t work out without a bit of logic if you would like to access to positions information as for example `clientX` or `clientY` .

Indeed, `touch` positioning are not available at the root of the object but rather in an array `changedTouches` .

```javascript
function startEvent($event) {
  // MouseEvent
  console.log($event.clientX);

  // TouchEvent
  console.log($event.changedTouches[0].clientX);
}
```

That’s why, we are using a function we have called `unifyEvents` to get the positioning regardless of the devices.

```javascript
export function unifyEvent($event) {
  return $event.changedTouches ? $event.changedTouches[0] : $event;
}
```

Which can be use as the following:

```javascript
function startEvent($event) {
  // TouchEvent and MouseEvent unified
  console.log(unifyEvent($event).clientX);
}
```

*****

### Debouncing

I covered the topic debouncing  with JavaScript in a [previous article](https://daviddalbusco.com/blog/debounce-with-vanilla-javascript-or-rxjs) but if you are looking to add such feature to your application without any dependencies, here’s a function to do so.

```javascript
export function debounce(func, timeout?) {
  let timer;

  return (...args) => {
    const next = () => func(...args);

    if (timer) {
      clearTimeout(timer);
    }

    timer = 
      setTimeout(next, timeout && timeout > 0 ? timeout : 300);
  };
}
```

*****

### User Agent

Earlier this year, Google has announced its decision to drop support for the User-Agent string in its Chrome browser ([article](https://www.infoq.com/news/2020/03/chrome-phasing-user-agent/) / [GitHub](https://github.com/WICG/ua-client-hints)).

Therefor the following methods should be used wisely, knowing they will have to be replaced in the future.

That being said, here are a couple of handy functions which help detects information about the type of browser or device.

*****

#### isMobile

[Detect Mobile Browsers](http://detectmobilebrowsers.com) is providing an open source list of mobile devices which can be use to test our navigator to detect if the user is browsing or using the application on a mobile device or not.

```javascript
export function isMobile() {
  if (!window || !navigator) {
    return false;
  }

  const a = 
        navigator.userAgent || navigator.vendor || 
        (window as any).opera;
  // Regex Source -> http://detectmobilebrowsers.com
  return (
/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    )
  );
}
```

*****

#### isIOS

To detect if our user is using an Apple mobile devices, we can test the navigator against the keywords `iPad|iPhone|iPod` .

```javascript
export function isIOS() {
  if (!window || !navigator) {
    return false;
  }

  const a = 
        navigator.userAgent || navigator.vendor || 
        (window as any).opera;

  return /iPad|iPhone|iPod/i.test(a);
}
```

*****

#### isIPad

Likewise, we can reduce the query to `iPad` only to guess if the user is on an iPad.

```javascript
export function isIPad() {
  if (!window || !navigator) {
    return false;
  }

  const a = 
        navigator.userAgent || navigator.vendor || 
        (window as any).opera;

  return /iPad/i.test(a);
}
```

*****

#### isFirefox

Likewise, you can detect if the client is using a specific browser as for final example Firefox.

```javascript
export function isFirefox() {
  if (!window || !navigator) {
    return false;
  }

  const a = 
        navigator.userAgent || navigator.vendor || 
        (window as any).opera;

  return /firefox/i.test(a);
}
```

*****

### Full screen

Our presentations can be edited and browse in standalone or in full screen mode, that’s why we have to detect such state. For such purpose, we compare the `window.innerHeight` to the `screen.height` , if these are equals, the browser is in full screen mode.

```javascript
export function isFullscreen() {
  if (!window || !screen) {
    return false;
  }

  return window.innerHeight == screen.height;
}
```

*****

### Remove Attribute From HTML String

Let say your DOM contains an element which you would like to parse to a `string` with the help of JavaScript. 

```javascript
<div contentEditable="true" style="color: #ff0000">Red</div>

const div = document.querySelector('div').outerHTML;
```

For some reason, you might not be able to touch or clone the DOM element but would be interested to remove an attribute from `string` value anyway.

Respectively, you would be interested in such result:

```html
<div style="color: #ff0000">Red</div>
```

To clean up or remove an attribute from a string you can use the following handy RegExp:

```javascript
const result = div
      .replace(/(<.*?)(contentEditable=""
                       |contentEditable="true"
                       |contentEditable="false"
                       |contentEditable)
                (.*?>)/gi, '$1$3');
```

Basically, it searches all attribute possibilities and create a new `string` containing what’s before and after the selection.

My favorite tricks of all of these 😉.

*****

### Summary
 
[DeckDeckGo](https://deckdeckgo.com) is open source, you can find the above functions in our [GitHub repo](https://github.com/deckgo/deckdeckgo/tree/master/utils) or their related [npm packages](https://www.npmjs.com/search?q=%40deckdeckgo).

Stay home, stay safe!

David
