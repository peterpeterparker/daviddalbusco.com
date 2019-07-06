---
path: "/blog/create-a-web-component-to-keep-track-of-your-inputs-draft-with-stenciljs"
date: "2019-01-24"
title: "Create a Web Component to keep track of your input's draft with StencilJS"
description: "Create a Web Component to keep track of your input's draft with StencilJS"
tags: "#webcomponents #stencil #javascript #html"
image: "https://cdn-images-1.medium.com/max/2000/1*Kw2TcCGoU1-7Ex8RbyjB0A.jpeg"
---

![](https://cdn-images-1.medium.com/max/2000/1*Kw2TcCGoU1-7Ex8RbyjB0A.jpeg)
<span class="figcaption_hack">Grab a coffee or tea, open a terminal and let’s code a clever <textarea/> with StencilJS</span>

Earlier this week, I saw a tweet of [Ali Spittel](https://medium.com/@ali07cat07) who was trying to figure out how [GitHub](https://github.com/), [Twitter](https://twitter.com/) and others, were able to keep track of the draft of your inputs respectively how such platforms were saving and restoring the content of your `input` or `textarea` before you would actually submit them and if the browser would refresh.

Long story short, [James Turner](https://twitter.com/MrTurnerj) is clever and had a look to the minified source code and discovered that your inputs are saved in the session storage of your browser quickly before its refresh and are loaded once the page is displayed again.

I thought that this discovery was really interesting, specially because I always assumed that this was a browser feature and not something which needed implementation, but also because I thought that this could be an interesting use case for a new [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) compatible with any modern frameworks, or even without, and that’s why I’m writing this article.

*For the purpose of this tutorial, I selected *[StencilJS](https://stenciljs.com/)* as a compiler, mostly because I’m a bit more experienced with it, as I developed my pet project *[DeckDeckGo](https://deckdeckgo.com/)* with, but also, to be truly honest, just because I’m in *❤️* with Stencil *😉

### Let’s get started

To get started we are going to initialize a new project, a new Web Component. Using a command line, run `npm init stencil` , pick `component` for the starter type and enter a name for the project (I used `clever-textarea` for the purpose of this tutorial).

![](https://cdn-images-1.medium.com/max/1600/1*foHSCS1AgJ46b-O6WaAG3Q.png)
<span class="figcaption_hack">npm init stencil</span>

![](https://cdn-images-1.medium.com/max/1600/1*h0jM5WWL7H028tgPwhBfSg.png)
<span class="figcaption_hack">select the starter “component”</span>

![](https://cdn-images-1.medium.com/max/1600/1*HLy-80fohxuB3s3tY06zSA.png)
<span class="figcaption_hack">enter a project name</span>

That’s it, our new project is initialized. We could now jump into the newly created folder, `cd clever-textarea` , and start the component runing the command line`npm run start` in order to test if everything is alright by opening a browser and accessing the url `http://localhost:3333` 😎

![](https://cdn-images-1.medium.com/max/1600/1*Jxu5c2jSNxJwAxkIopNGCw.png)
<span class="figcaption_hack">start the local server for the component</span>

![](https://cdn-images-1.medium.com/max/1600/1*3shvGjyXaBw_9kXByxv5sg.png)
<span class="figcaption_hack">access the component</span>

*To continue this tutorial, I suggest you to keep the component running, Stencil will automatically pick the changes we are going to make to the code and will trigger a refresh of the browser on new build.*

### Let’s code

We are now all set, we could begin to code our component 🚀 As we want to develop a clever `textarea`, I suggest that we begin first by removing the default demo code from the component with the goal to just render a dummy blank `textarea`. For that purpose, we are going to edit the file `src/components/my-component/my-component.tsx` as Stencil components are built using [JSX](https://reactjs.org/docs/introducing-jsx.html) and Typescript.

*Per default, the component’s name and namespace are set to *`my-component`* respectively *`mycomponent`* . For simplicity reason, I’ll stick to these names for this article. If you would create a component you would use in a real project, I advise you to rename these informations *😉

```
import {Component} from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  render() {
    return <textarea></textarea>;
  }
}
```

The above code `render()` a `textarea` which should update our browser as the following:

![](https://cdn-images-1.medium.com/max/1600/1*ie9v5mt8r9dZCAmo7FLP2w.png)

#### Saving your inputs before refresh

As James Turner discovered, the trick consists of saving your inputs before the browser would refresh. To do so we could hook the `window` event `beforeunload` which we are going to declare once our component is loaded, respectively in one of the [lifecycles](https://stenciljs.com/docs/component-lifecycle) provided by Stencil.

Furthermore to this, in order to retrieve the current value of our `textarea`, we could use the Stencil’s reference `Element` to perform a query on the DOM elements of the host and save its value in the `sessionStorage`.

*Per default, see your component definition *`@Component`* , the component is going to be shadowed, that’s why we are going to use the selector *`shadowRoot`* in our query.*

```
import {Component, Element} from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  @Element() el: HTMLElement;

  componentDidLoad() {
    const textarea = this.el.shadowRoot.querySelector('textarea');
    // Save input value before refresh
    window.addEventListener('beforeunload',  (_event) => {
      if (textarea) {
        sessionStorage.setItem(
           'clever-textarea-value', textarea.value
        );
      }
    });
  }

  render() {
    return <textarea></textarea>;
  }
}
```

Once implemented, you could go back to your browser and have a try. Don’t forget to enter a value in your `textarea`, perform a browser refresh and observe your session storage, you should now find the value your previously entered.

![](https://cdn-images-1.medium.com/max/1600/1*ss05v5GOv0e5B8D5UdrqxA.png)
<span class="figcaption_hack">enter a value in the textarea and refresh the browser</span>

![](https://cdn-images-1.medium.com/max/1600/1*Mn2nx4e8_gLpyoP67PVOcg.png)
<span class="figcaption_hack">open the debugger and find your value in the session storage</span>

#### Loading your inputs after refresh

If you are still here, I hope so, and have tested the above steps by yourself, I guess you already know what’s coming next and how to code it 😅

Now that we have save our inputs when the browser refresh, we could hook the loading of the page, retrieve our value from the `sessionStorage` and display it. As previously, we are going to use the same Stencil lifecycle to perform this operation and to use again the element reference to manipulate the DOM.

```
import {Component, Element} from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  @Element() el: HTMLElement;

  componentDidLoad() {
    const textarea = this.el.shadowRoot.querySelector('textarea');

    // Save input value before refresh
    window.addEventListener('beforeunload',  (_event) => {
      if (textarea) {
        sessionStorage.setItem(
          'clever-textarea-value', textarea.value
        );
      }
    });

    // Retrieve value after refresh
    const previousValue = sessionStorage.getItem(
          'clever-textarea-value'
    );

    if (textarea) {
      textarea.value = previousValue;
    }
  }

  render() {
    return <textarea></textarea>;
  }
}
```

If you refresh your browser you should now find a pre-filled `textarea` which should contains the last value you would have entered before refresh.

![](https://cdn-images-1.medium.com/max/1600/1*6mED0Asr6LRfVGqEsNPIjg.png)
<span class="figcaption_hack">textarea should be pre-filled with your previous value after refresh</span>

#### Add the support for multiple inputs in the same page

Well, that’s neat, we were able to save and load the draft of your input, but what would happen if we would use multiple times the same component in a page as we use a unique name to save the entry in the storage? Yes, right, it would be weird and contains a unique value…

To overcome this problem we are going to improve our code to add and use a variable value for our session storage key. For that purpose we are going to add a Stencil [properties](https://stenciljs.com/docs/properties) which expose a public attribute to the component.

```
import {Component, Element, Prop} from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  @Element() el: HTMLElement;
  @Prop() key: string;

  componentDidLoad() {
    const textarea = this.el.shadowRoot.querySelector('textarea');

    // Save input value before refresh
    window.addEventListener('beforeunload',  (_event) => {
      if (textarea && this.key) {
        sessionStorage.setItem(
          this.key, textarea.value
        );
      }
    });

    // Retrieve value after refresh
    const previousValue = sessionStorage.getItem(this.key);

    if (textarea) {
      textarea.value = previousValue;
    }
  }

  render() {
    return <textarea></textarea>;
  }
}
```

Once the code modified, we could now modify the HTML page we are using for test purpose in order to specify this attribute and even add another component to the page. For that purpose, you could modify `src/index.html` like the following:

```
<body>

  <my-component key="clever-textarea-value-1"></my-component>

  <my-component key="clever-textarea-value-2"></my-component>

</body>
```

*As for the JSX code, you could safely remove the previous demo attributes “last” and “first” which comes with the Stencil starter component as we don’t use them in this tutorial.*

If we go back to your browser you should now find two `textarea` respectively two components. You could now try to fill them and again try to refresh your browser.

![](https://cdn-images-1.medium.com/max/1600/1*XQB1PxxL6tTWOh7xy7tJ8g.png)
<span class="figcaption_hack">fill the two components before refresh</span>

![](https://cdn-images-1.medium.com/max/1600/1*iAebxf4nzQI37wCyin02fw.png)
<span class="figcaption_hack">after refresh of the browser</span>

Hooray we were able to use two clever `textarea` Web Components in our page 🎉

### In conclusion

Of course the above code would still need a bit of improvements, I would notably separate the code in methods, add some promises, because there are never enough promises 😋, and maybe even clear the storage after having read the value but I hope that this article would have give you some ideas about how to implement such a “clever” `input` or `textarea` and furthermore to that, if you never tried [Stencil](https://stenciljs.com/) before, made you a bit curious about it because again, this compiler is **amazing** 🤘

### Cherry on the cake 🍒🎂

Web Components could be integrated in **any** modern frameworks (the Stencil documentation provide examples of framework integration for [Angular](https://stenciljs.com/docs/angular), [React](https://stenciljs.com/docs/react), [Vue](https://stenciljs.com/docs/vue) and [Ember](https://stenciljs.com/docs/ember)) **or even without** any framework (like I do in the DeckDeckGo, give it a try for your next presentation 👉 `npm init deckdeckgo`).

To infinity and beyond 🚀

David
