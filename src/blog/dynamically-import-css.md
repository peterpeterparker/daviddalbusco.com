---
path: "/blog/dynamically-import-css"
date: "2020-06-01"
title: "Dynamically Import CSS"
description: "Lazy load CSS with the help of dynamic import() demonstrated in a Stencil Web Components"
tags: "#javascript #webdev #css #typescript"
image: "https://cdn-images-1.medium.com/max/1600/1*01MP69dykx8YMQqMeRB2OQ.jpeg"
canonical: "https://medium.com/@david.dalbusco/dynamically-import-css-d8222423f109"
---

![](https://cdn-images-1.medium.com/max/1600/1*01MP69dykx8YMQqMeRB2OQ.jpeg)

*Photo by [Joshua Eckstein](https://unsplash.com/@dcemr_e?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/dynamic?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

We recently [introduced](https://twitter.com/deckdeckgo/status/1266049044721340417) several theming options to showcase your code in your presentations made with our editor, [DeckDeckGo](https://deckdeckgo.com).

If you sometimes read my posts, you might already be aware I do care about performances and that I tend to use the lazy loading concept as much as I can. That’s why, when [Akash Board](https://twitter.com/BoradAkash) provided a PR to add this nice set of themes, even if it already worked out like a charm, I was eager to try out the possibility to lazy load these new CSS values. Even if I would spare only a couple of bytes, I thought it was a good experiment and goal, which was of course achieved, otherwise I would not share this new blog post 😉.

*****

### Introduction

The goal of the solution is loading CSS on demand. To achieve such objective, we can take advantage of the JavaScript dynamic `import()` . Instead of handling static build styles, we defer the loading by integrating the styles as JavaScript code.

In brief, we inject CSS through JavaScript on the fly.

*****

### Dynamic Import

Dynamic `import()` , which allow asynchronous load and execution of script modules, is part of the [official TC39](https://github.com/tc39/proposal-dynamic-importhttps://github.com/tc39/proposal-dynamic-import) proposal and has been standardized with [ECMAScript 2020](https://tc39.es/ecma262/2020/). Moreover, it is also already supported by transpiler like [Webpack](https://webpack.js.org/guides/lazy-loading/) or [Typescript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html).

*****

### Setup

Before jumping straight to the solution, let’s start a project with [Stencil](https://stenciljs.com/) with the command line `npm init stencil`.

This component, we are about to develop for demonstration purpose, has for goal to render a text with either a “green” or “red” background. That’s why we can add such a property to `./src/components/my-component/my-component.tsx` .

```javascript
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  @Prop() theme: 'green' | 'red' = 'green'

  render() {
    return <div class={this.theme}>Hello, World!</div>;
  }
}
```

As we are applying the property as class name, we should define the related CSS in `./src/components/my-component/my-component.css`. Note that we are currently only setting up a demo project, we are not yet implementing the solution, that’s why we add style to CSS file.

```css
:host {
  display: block;
}

.red {
  background: red;
}

.green {
  background: green;
}
```

Finally, in addition to the component, we also add a `<select/>` field, which should allow us to switch between these colors, to the `./src/index.html` for test purpose.

```html
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0">
  <title>Stencil Component Starter</title>

  <script type="module" src="/build/lazy-css.esm.js"></script>
  <script nomodule src="/build/lazy-css.js"></script>

</head>
<body>

  <my-component></my-component>

  <select id="themeToggler" onchange="updateTheme()">
    <option value="green" selected="selected">green</option>
    <option value="red">red</option>
  </select>

  <script type="text/javascript">
    function updateTheme() {
      const toggler = document.getElementById('themeToggler');
      const elem = document.querySelector('my-component');

      elem.theme  = toggler.value;
    }
  </script>
</body>
</html>
```

If we now run the local server, `npm run start`, to test our component with our favorite browser, we should be able to switch between backgrounds.

![](https://cdn-images-1.medium.com/max/1600/1*8V3kFZUmrYcph6dePl4eig.gif)

More important, if we open our debugger, we should also that both our styles `.green` and `.red` are loaded. It means that the client side as fetch these two styles, even if would have not used for example one of these two colors.

![](https://cdn-images-1.medium.com/max/1600/1*eeqg_F7tPnDQyIu4-sw2pw.png)

*****

### Solution

Let’s have fun 😜.

*****

#### Style

First thing first, we remove the style from `./src/components/my-component/my-component.css`, from the component’s related CSS.

```css
:host {
  display: block;
}
```

*****

#### Functional Component

Because we have removed the static style, we now need a way to apply them on the fly. That’s why we create a functional component which has for goal to inject `<style/>` node into our shadowed Web Component.

According the `theme` property, this new component should either apply the “green” or the “red” background.

For simplicity reason, we declare it into our component main script `./src/components/my-component/my-component.tsx` .

```javascript
import {Component, Prop, h, FunctionalComponent, Host, State} from '@stencil/core';

const ThemeStyle: FunctionalComponent<{style: string}> =
  ({style}) => {
    return (
      <style>{`
        :host ${style};
      `}</style>
    );
};

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  @Prop() theme: 'green' | 'red' = 'green'
  
  @State()
  private style: string;
  
  // TODO: Dynamically import style

  render() {
    return <Host>
      <ThemeStyle style={this.style}></ThemeStyle>
      <div class={this.theme}>Hello, World!</div>
    </Host>;
  }
}
```

*****

#### Dynamic Import

The component is set to render dynamically our themes, but we do not yet lazy load these. Moreover, our CSS content has been removed. That’s why we create one JavaScript constant for each and every style we want to fetch at runtime. Concretely, in our project, we create a file `./src/components/my-component/red.ts` for the “red” theme.

```javascript
const theme: string = `{
  background: red;
}`;

export {theme};
```

And another one `./src/components/my-component/green.ts` for the “green” style.

```javascript
const theme: string = `{
  background: green;
}`;

export {theme};
```

These are the definitions which are going to be executed with the help of dynamic `import()` which we are finally adding to our component `./src/components/my-component/my-component.tsx` .

```javascript
private async importTheme(): Promise<{theme}> {
  if (this.theme === 'red') {
    return import('./red');
  } else  {
    return import('./green');
  }
}
```

Note that unfortunately it isn’t possible currently to use dynamic `import()` with a variable. The reason behind, as far as I understand, is that bundler like Webpack or [Rollup](https://rollupjs.org), even if scripts are going to be injected at runtime, have to know which code is use or not in order to optimize our bundles. That’s why for example `return import(`${this.theme}`);` would not be compliant.

*****

#### Loading

We have declared our themes and have implemented the `import()` but we still need to apply the results to the rendering which we do by loading the values when the component is going to be mounted and when the theme property would be modified by declaring a `@Watch()` .

```javascript
import {Component, Prop, h, FunctionalComponent, Host, State, Watch} from '@stencil/core';

const ThemeStyle: FunctionalComponent<{style: string}> =
  ({style}) => {
    return (
      <style>{`
        :host ${style};
      `}</style>
    );
};

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  @Prop() theme: 'green' | 'red' = 'green'

  @State()
  private style: string;

  async componentWillLoad() {
    await this.loadTheme();
  }

  @Watch('theme')
  private async loadTheme() {
    const {theme} = await this.importTheme();
    this.style = theme;
  }

  private async importTheme(): Promise<{theme}> {
    if (this.theme === 'red') {
      return import('./red');
    } else  {
      return import('./green');
    }
  }

  render() {
    return <Host>
      <ThemeStyle style={this.style}></ThemeStyle>
      <div class={this.theme}>Hello, World!</div>
    </Host>;
  }
}
```

Et voilà, we are able to lazy load CSS using dynamic `import()` 🎉.

If we test again our component in the browser using the development server (`npm run start` ), we should notice that it still renders different background according our selection.

![](https://cdn-images-1.medium.com/max/1600/1*i3lO5coMF-8IugLx1jLvfg.gif)

More important, if we observe the debugger, we should also notice that our theme loads on the fly.

![](https://cdn-images-1.medium.com/max/1600/1*XaPbuFwYoLKX9-VEAlX8Sg.gif)

Likewise, if we watch out the shadowed elements, we should notice that only the related `<style/>` node should be contained.

![](https://cdn-images-1.medium.com/max/1600/1*nq32o3Us1mosIoFXuiZSmw.gif)

*****

### Summary

It was the first time I used dynamic `import()` to lazy load CSS in a Web Component and I have to admit that I am really happy with the outcome. Moreover, adding these themes for the code displayed in slides made with [DeckDeckGo](https://deckdeckgo.com) is a really nice improvement I think. Give it a try for your next talk 😁.

![](https://cdn-images-1.medium.com/max/1600/1*kdOK8ra4vmoz8eltHbMRMA.gif)

To infinity and beyond!

David
