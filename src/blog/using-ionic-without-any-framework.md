---
path: "/blog/using-ionic-without-any-framework"
date: "2018-10-19"
title: "Using Ionic without any framework"
description: "Using Ionic without any framework"
tags: "#ionic #webcomponents"
image: "https://cdn-images-1.medium.com/max/2000/1*qMT7WHMPzBZai4ZikSlLTg.jpeg"
---

![](https://cdn-images-1.medium.com/max/2000/1*qMT7WHMPzBZai4ZikSlLTg.jpeg)

While I was preparing my last talk about Web Components and [Ionic](http://ionicframework.com/) v4, I noticed that I was using none of these to actually build my slides 🤔 That’s why I published this week [DeckDeckGo](https://deckdeckgo.com/), the new tool to create lightweight presentation using HTML and Ionic components 🚀

To follow-up what I learned while wrapping up together this new pet project, I thought it would be maybe interesting to wrote a brief article about how to use Ionic without any framework or with any framework, as you rather like😉

### Importing Ionic

The goal of this article is to describe how to use Ionic in a simple `index.html` therefore we won’t rely on [NPM](http://npmjs.com/) and we are going to import Ionic from a CDN, most particularly from [Unpkg](https://unpkg.com/#/). To do so we are just then going to add the following lines to the `<head/>` of your HTML page:

```
<!-- Import the Ionic CSS -->
<link href="https://unpkg.com/@ionic/core@latest/css/ionic.bundle.css" rel="stylesheet">
<!-- Import Ionic -->
<script src="https://unpkg.com/@ionic/core@latest/dist/ionic.js"></script>
<!-- Optional, import the Ionic icons -->
<script src="https://unpkg.com/ionicons@latest/dist/ionicons.js"></script>
```

And that’s it, that’s all you need to import Ionic in any web applications 🎉

### A basic usage

Well, I could stop the article here, it’s super easy and straight forward, but I thought it would be good to display some example of usages too. In this first example, I just gonna showcase a button which should trigger an alert.

```
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <title>Using Ionic without any framework</title>

<!-- Import the Ionic CSS -->
<link href="https://unpkg.com/@ionic/core@latest/css/ionic.bundle.css" rel="stylesheet">
<!-- Import Ionic -->
<script src="https://unpkg.com/@ionic/core@latest/dist/ionic.js"></script>
<!-- Optional, import the Ionic icons -->
<script src="https://unpkg.com/ionicons@latest/dist/ionicons.js"></script>
</head>
<body>

<!-- We create a vanilla Javascript function to call the alert -->
<script>
    hello = async function () {
        alert('Hello World!');
    };
</script>

<!-- We declare an Ionic app using the <ion-app/> element -->
<ion-app>
    <!-- Cool thing, the Ionic CSS utilities could be used too -->
    <ion-content text-center>
        <h1>Basic usage</h1>
        <!-- We add an ion-button with an onclick event -->
        <ion-button onclick="hello()">Click me</ion-button>
    </ion-content>
</ion-app>

</body>
</html>
```

#### Codepen example

Because we use Ionic in an `index.html` without any framework, it gives the ability to create really easily [Codepen](https://codepen.io/) examples. You could check this particular one at the following address: [https://codepen.io/peterpeterparker/pen/YJLvQq](https://codepen.io/peterpeterparker/pen/YJLvQq)

### A bit more tricky usage

The previous example is really straight forward, but what about more “complex” components, like creating and using modals or a popovers?

#### Modals

To be honest, describing how to implement a modal would just be a rip off of the documentation. Therefore, if you would like to implement an Ionic modal in a project without or with an frameworks, just visit the [modal documentation](https://beta.ionicframework.com/docs/api/modal), go to chapter “Usage” , toggle to “Javascript” the example, copy/paste the code in your project and voilà, it just gonna works out of the box 😜

#### Popovers

I found the implementation of a popover a bit more tricky (to some extension, it’s still super easy 😆). We will try now to move the button of the previous example, which trigger the alert, from the main page to a popover.

First thing first, to implement such a component, we have to add a new`<ion-popover-controller/>` element to our HTML page. I personally understand this as an anchor for the element we are about to add, which will, btw. only be added to the DOM once called and not before.

The second step is to to create a custom element which will be in charge to parse the content of our popover.

Finally, as we would do in a classic Ionic [Angular](https://angular.io/) application, we will use the `PopoverController` to create and present it.

Wrapped up together, the `index.html` page would now looks like the following:

```
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <title>Using Ionic without any framework</title>

    <link href="https://unpkg.com/@ionic/core@latest/css/ionic.bundle.css" rel="stylesheet" media="screen">
    <script src="https://unpkg.com/@ionic/core@latest/dist/ionic.js"></script>
    <script src="https://unpkg.com/ionicons@latest/dist/ionicons.js"></script>
</head>
<body>
<script>
    hello = async function () {
        alert('Hello World!');
    };

    // Our custom element
    class MyPopover extends HTMLElement {
        constructor() {
            super();
        }

        async connectedCallback() {

            // Here we parse the content of the popover
            this.innerHTML = '<ion-content><ion-button onclick="hello()">Click me</ion-button></ion-content>';
        }
    }

    // We define our custom element
    customElements.define('my-popover', MyPopover);

    // The function to bring the pieces together
    presentMyPopover = async function() {
        // We get the anchor
        const popoverController = document.querySelector('ion-popover-controller');

        await popoverController.componentOnReady();

        // We create the popover for our custom element
        const popover = await popoverController.create({
            component: 'my-popover',
            translucent: true
        });

        // We present the popover
        return await popover.present();
    };

</script>

<ion-app>
    <ion-content text-center>
        <h1>Popover usage</h1>
        <!-- On click we call the function to open the popover -->
        <ion-button onclick="presentMyPopover()">Open</ion-button>
    </ion-content>

    <!-- Our popover anchor -->
    <ion-popover-controller></ion-popover-controller>
</ion-app>

</body>
</html>
```

#### Codepen

You could check this second example at the following address: [https://codepen.io/peterpeterparker/pen/JmvZLo](https://codepen.io/peterpeterparker/pen/JmvZLo)

### Custom elements and browser compatibility

Custom elements are now natively supported by Chrome and Safari but are not yet supported per default in Firefox < v63. To overcome this problem we could add a the [custom elements Polyfill](https://github.com/webcomponents/custom-elements) in the header of our HTML page:

```
<script src="https://unpkg.com/@webcomponents/custom-elements"></script>
```

### Cherry on the cake 🍒🎂

As I said in my introduction, I have published my new pet project [DeckDeckGo](https://deckdeckgo.com/) , where I used these components, this week. But, what I didn’t mentioned so far is, that this project is free and open source 🚀 Therefore you could find a practical implementation of everything I tried to display above in my DeckDeckGo repo: [https://github.com/fluster/deckdeckgo](https://github.com/fluster/deckdeckgo)

To infinity and beyond 🚀

David
