---
path: "/blog/integrate-the-same-qr-code-web-component-in-react-angular-or-vue"
date: "2019-10-08"
title: "Integrate the same QR code Web Component in React, Angular or Vue"
description: "How to integrate the same QR code Web Component developed with StencilJS in React, Angular or Vue"
tags: "#tutorial #react #vue #angular"
image: "https://daviddalbusco.com/assets/images/1*fqN7UAsguHXdG2ojvxgvJA.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*fqN7UAsguHXdG2ojvxgvJA.jpeg)
_Photo by [Mitya Ivanov](https://unsplash.com/@aka_opex?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/qr-codes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

One of the cool asset of Web Components is the fact that they could be integrated in any modern web applications, regardless if these are using a framework or not. As I had to implement some improvements in the QR code Web Component we are using in [DeckDeckGo](https://deckdeckgo.com), as thought it would be interesting to display how it could be used across frameworks. Furthermore, as I’m not yet that experienced with React and Vue, it’s also a fun way for me to improve a bit my skills.

### Introduction

The Web Component we are going to use is a wrapper I’ve implemented with [StencilJS](https://stenciljs.com/) around the [generator](https://github.com/kazuhikoarase/qrcode-generator) developed by [Kazuhiko Arase](https://github.com/kazuhikoarase). Its package name is `@deckdeckgo/qrcore`.

In the following chapters we are going to integrate the component in three different starter applications developed with [React](https://reactjs.org), [Angular](https://angular.io) and [Vue](https://vuejs.org).

Regardless of the framework, the process will always be the same:

1. Create a new application using a starter kit
2. Install the component with [npm](https://www.npmjs.com)
3. Import the component in the application
4. Render the component
5. Start the application
6. Test it in the browser

So, let’s get started 🏁

### React

> A JavaScript library for building user interfaces (source: [https://reactjs.org](https://reactjs.org)).

#### 1. Create a new application using a starter kit

To create a new React application we are going to use the official CLI project [create-react-app](https://github.com/facebook/create-react-app) and are going to run the following command (“demo-qrcode-react” being the name of our project):

```bash
npx create-react-app demo-qrcode-react
```

The process might take a while (more than 1'500 dependencies have to be fetched) but once done, we can jump into our newly created project:

```bash
cd demo-qrcode-react
```

#### 2. Install the component with npm

We could now add the Web Component to the project running the following command:

```bash
npm install @deckdeckgo/qrcode --save
```

Note that the component is agnostic and therefore no other dependencies will have to be fetched and added to the project.

#### 3. Import the component in the application

In all examples of this blog post, we are going to import the component in the main application. It’s worth to notice that components build and shipped with StencilJS are lazy loaded and therefore optimized to match the best performances of your applications.

In the particular case of React, we are going to import the component in `src/index.js` and proceed as displayed in the [documentation](https://stenciljs.com/docs/react) respectively importing it with a loader and defining it as a custom element.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// A. We import our loader
import { applyPolyfills, defineCustomElements } from "@deckdeckgo/qrcode/dist/loader";

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();

// B. We load our component
applyPolyfills().then(() => {
	defineCustomElements(window);
});
```

#### 4. Render the component

Our configuration is all set, we could now have a bit of fun and strictly speaking implement the component in our application. For that purpose we are going to add it to the main `src/App.js` .

```javascript
import React from "react";
import "./App.css";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<deckgo-qrcode content="https://reactjs.org"></deckgo-qrcode>
			</header>
		</div>
	);
}

export default App;
```

#### 5. Start the application

Our component has been imported and integrated, we could now test our implementation and run our app:

```bash
npm run start
```

#### 6. Test it in the browser

If everything works according plan, our application and QR code should be deployed and accessible in our browser at the address `http://localhost:3000` .

![](https://daviddalbusco.com/assets/images/1*e_xIvjI2ZdELhj36u1LlfA.png)

_The result of our test with React_

### Angular

> One framework. Mobile & desktop. (source: [https://angular.io](https://angular.io)).

#### 1. Create a new application using a starter kit

To create a new application using Angular, we first have to install their CLI globally on our computer.

```bash
npm install -g @angular/cli
```

Once installed, we can proceed and create our starter application (“demo-qrcode-angular” being the name of this project).

```bash
ng new demo-qrcode-angular
```

Note that for our test, the routing isn’t mandatory and the styling method isn’t relevant. The operation will again take a bit of time as almost 1'500 dependencies have to be fetched. Once done, we jump into our newly created project.

```bash
cd demo-qrcode-angular
```

#### 2. Install the component with npm

Like before, we install the component from npm using the following command:

```bash
npm install @deckdeckgo/qrcode --save
```

#### 3. Import the component in the application

When it comes to Angular, I’m not sure if it is still mandatory, but before stricto sensu importing it, we first have to tell Angular to allow the use of custom elements schema. To achieve that goal, we modify `src/app/app.module.ts`.

```javascript
import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AppComponent } from "./app.component";

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

Note that `CUSTOM_ELEMENTS_SCHEEMA` needs to be included in any module that uses custom elements.

Finally we are going to import our component as displayed on the [documentation](https://stenciljs.com/docs/angular), by using the loader and by defining our element in the `src/main.ts` application.

```javascript
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

// A. We import our loader
import { applyPolyfills, defineCustomElements } from "@deckdeckgo/qrcode/dist/loader";

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => console.error(err));

// B. We load our component
applyPolyfills().then(() => {
	defineCustomElements(window);
});
```

#### 4. Render the component

We can now implement the component in our application. Angular being based on HTML templates, we are going to add it in the main one of the application `src/app/app.component.html` , at the top of the page’s content.

```html
<div class="content" role="main">
	<deckgo-qrcode content="https://angular.io"></deckgo-qrcode>
</div>
```

#### 5. Start the application

To run our application we can again run the default command.

```bash
npm run start
```

#### 6. Test it in the browser

Our application and QR code should now be deployed and accessible in our browser at the address `http://localhost:4200` .

![](https://daviddalbusco.com/assets/images/1*_Vbu1yVm5naiR7QQtAom-g.png)

_The result of our test with Angular_

### Vue

> The Progressive JavaScript Framework (source: [https://vuejs.org](https://vuejs.org)).

#### 1. Create a new application using a starter kit

In order to create a new application with Vue, we would be able to use a boiler plate but, to proceed as we did with Angular, we are going to install their CLI globally on our machine first.

```bash
npm install -g @vue/cli
```

We proceed then with the creation of our application (“demo-qrcode-vue” being the name of this project).

```bash
vue create demo-qrcode-vue
```

It might take a bit time (but a bit less time than before as only around 1'300 dependencies have to fetched). Once everything installed, we jump into our newly created project.

```bash
cd demo-qrcode-vue
```

#### 2. Install the component with npm

We can install the component from npm the exact same way as we did with the two other frameworks:

```bash
npm install @deckdeckgo/qrcode --save
```

#### 3. Import the component in the application

In addition to importing and defining our component using the loader as we did before, we also have to instruct the Vue compiler to ignore our custom element tag. For that purpose we should modify `src/main.js` as displayed in the [documentation](https://stenciljs.com/docs/vue).

```javascript
import Vue from "vue";
import App from "./App.vue";

// A. We import our loader
import { applyPolyfills, defineCustomElements } from "@deckdeckgo/qrcode/dist/loader";

Vue.config.productionTip = false;

// C. Tell  the compiler to ignore our custom element tag
Vue.config.ignoredElements = [/deckgo-\w*/];

new Vue({
	render: (h) => h(App)
}).$mount("#app");

// B. We load our component
applyPolyfills().then(() => {
	defineCustomElements(window);
});
```

#### 4. Render the component

We would now be able to add our component to the main `src/App.vue` template in order to render the QR code in our application but, as a component for the first page was already created with the starter kit creation, let’s rather add our component at the begin of root element in the template `src/components/HelloWorld.vue`.

```html
<template>
	<div class="hello">
		<deckgo-qrcode content="https://vuejs.org"></deckgo-qrcode>
	</div>
</template>
```

#### 5. Start the application

There is no default “start” target in the Vue starter kit, therefore let’s run the following command to launch our application:

```bash
npm run serve
```

#### 6. Test it in the browser

All right, final test 🎉 Our application and QR code should now be deployed and accessible in our browser at the address `http://localhost:8080.`

![](https://daviddalbusco.com/assets/images/1*mvCWPtw9p-Da-doxk6Cedw.png)

_The result of our test with Vue_

### Conclusion

When it comes to me, I think that the most interesting takeover from this small experience is noticing that importing and using Web Component is almost exactly the same approach and experience regardless of the frameworks. Moreover than the obvious business advantages of having the exact same component and code working seamlessly across technologies, it also gives me an interesting feeling that they, Web Components, might be the missing chain which would allow me to jump from a project to another one more easily. I don’t know if you share the same feeling, I would be happy to hear your thoughts.

### Cherry on the cake 🍒🎂

The QR code Web Component we just used offers many styling options (using CSS4 variables) and even the ability to display a logo over it. Moreover it is open source. Therefore, if you need such a component or have idea of improvements, go for it and get started with its [documentation](https://docs.deckdeckgo.com/components/qrcode/).

To infinity and beyond 🚀

David
