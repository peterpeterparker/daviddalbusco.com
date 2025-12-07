---
path: "/blog/dark-and-light-mode-os-color-scheme-and-theme-switcher"
date: "2019-12-30"
title: "Dark And Light Mode: OS Color Scheme And Theme Switcher"
description: "How to add a dark and light mode theme switcher to your application which inherits the OS color scheme as default state too."
tags: "#javascript #webdev #tutorial #webcomponents"
image: "https://daviddalbusco.com/assets/images/1*EqOsVaqdhDXCI2Vwi7YAwg.png"
---

![](https://daviddalbusco.com/assets/images/1*EqOsVaqdhDXCI2Vwi7YAwg.png)

_Photo by [Sincerely Media](https://unsplash.com/@sincerelymedia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

There are a lot of good tutorials out there about the subject “dark mode” but less rarely one which covers the two main goals, in my opinion, of such an implementation in a real application. Respectively, giving the users the ability to switch between themes but also inheriting per default the OS color scheme given by the platform, specially as both Google and Apple began to rollout such modes in their products.

That’s why I’m writing this new blog post to share the solution we have implemented, with the help of our contributors, in our web open source editor for presentations, [DeckDeckGo](https://deckdeckgo.com).

### Credits

As staten above, we have developed such a feature with the help of our contributors, more precisely with the help of Grant Herman ([GitHub](https://github.com/grantlouisherman) / [Twitter](https://twitter.com/gherman1990)). He even helped us implement it in three different applications 🤯

Definitely, not all heroes wear capes, thank you Grant 🙏

### Getting Started

To implement our solution, we are relying on two amazing pieces of software:

- [idb-keyval](https://github.com/jakearchibald/idb-keyval): a super simple small promise-based keyval store implemented with IndexedDB, which we are using to save the user selection.
- [RxJS](https://rxjs-dev.firebaseapp.com): a reactive extensions library for JavaScript, which we are using to store and propagate the state representing the theme in memory.

We are going to use a runtime value to switch between themes, therefore, it would be also possible to implement such a solution using a [React Redux](https://react-redux.js.org) stored state. Don’t hesitate to ping me if you would like to get such an example, I also have got one ready in another new application I am currently developing 😉

### Singleton Service

To handle our theme state, we create a Vanilla singleton service. If you are using a framework like [Angular](https://angular.io), create a root scoped service as you would always do, or if you rather like to use functions and static values, do so. The important thing is to load and keep in memory only one single state representing the applied theme for your all application.

In our service, we declare a boolean `darkTheme`, which sets to `true` means “dark theme active” respectively `false` for “light theme”. We could have used an `enum`, if more than two themes would have been available. This possibility of expansion is kind of a cool asset of this implementation 😃.

Note that we are using a `ReplaySubject<1>` as we want to keep in memory exactly one only state without value until we first figure out, what theme to apply.

```javascript
import {Observable, ReplaySubject} from 'rxjs';

import {get, set} from 'idb-keyval';

export class ThemeService {

    private static instance: ThemeService;

    private darkTheme: ReplaySubject<boolean> =
                             new ReplaySubject<boolean>(1);

    private constructor() {
        // Private constructor, singleton
    }

    static getInstance() {
        if (!ThemeService.instance) {
            ThemeService.instance = new ThemeService();
        }
        return ThemeService.instance;
    }
}
```

### Watch And Switch State

Our service being ready, we have to expose the state for the application and have to provide a method to let our users be able to toggle the theme. We alsot have to save the selection in order to load it next time the app will restart.

```javascript
watch(): Observable<boolean> {
    return this.darkTheme.asObservable();
}

async switch(dark: boolean) {
    this.darkTheme.next(dark);

    try {
        await set('dark_mode', dark);
    } catch (err) {
        console.error(err);
    }
}
```

### Initial Preference

At boot time, we have to load the theme according the following steps:

- Does the user already have set a preferred theme?
- Or were we unable to read this information (does an error occurred)?
- Or should we fallback using the OS default color scheme provided by the platform?

For these reasons, we create a function which implements this logic and use our previous `switch` method to propagate the theme.

```javascript
async init(): Promise<void> {
    try {
        const saved: boolean = await get('dark_mode');

        // If user already specified once a preference
        if (saved !== undefined) {
            this.switch(saved);
            return;
        }
    } catch (err) {
        this.switch(false);
        return;
    }

    // Otherwise we check the prefers-color-scheme of the OS
    const darkFromMedia: MediaQueryList =
              window.matchMedia('(prefers-color-scheme: dark)');

    this.switch(darkFromMedia.matches);
}
```

### Apply The Theme To The DOM

On purpose, we did not effectively applied the theme “graphically”, in our service. Therefore, we now have to consume it where we want to apply the modification to the DOM.

In our projects, as we have developed our applications with [Stencil](https://stenciljs.com) Web Components, we have started the initialization in the root component (`app-root.tsx)`.

Moreover, we are watching for changes in the same component, as it won’t be destroyed until the application is closed. Doing so, on each new state emitted, we modify our DOM, more precisely the `body` element, to apply or remove a CSS class name (in our case `dark` ).

```javascript
import {Component, h} from '@stencil/core';

import {Subscription} from 'rxjs';

import {ThemeService} from './theme.service';

@Component({
    tag: 'app-root',
    styleUrl: 'app-root.scss'
})
export class AppRoot {
    private sub: Subscription;
    private domBodyClassList: DOMTokenList =
                              document.body.classList;

    async componentWillLoad() {
        this.sub =
             ThemeService.getInstance()
                         .watch()
                         .subscribe((dark: boolean) => {
             this.updatePreferences(dark);
        });

        await this.themeService.init();
    }

    componentDidUnload() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    private updatePreferences(dark: boolean) {
        dark ?
            this.domBodyClassList.add('dark') :
            this.domBodyClassList.remove('dark');
    }
}
```

### Theme Switcher

Until this point was reached, our application was “only” able to handle the OS preferred color scheme and did not gave the users the ability to toggle the themes. That’s why we create a new component which exposes for example an [Ionic toggler](https://ionicframework.com/docs/api/toggle) to switch between light and dark mode.

```javascript
import {Component, h, State} from '@stencil/core';

import {Subscription} from 'rxjs';

import {ThemeService} from './theme.service';

@Component({
    tag: 'app-theme-switcher'
})
export class AppThemeSwitcher {

    private sub: Subscription;

    @State()
    private darkTheme: boolean;

    componentWillLoad() {
        this.sub = ThemeService.getInstance()
                         .watch()
                         .subscribe((dark: boolean) => {
            this.darkTheme = dark;
        });
    }

    componentDidUnload() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    async toggleTheme() {
        await ThemeService.getInstance().switch(!this.darkTheme);
    }

    render() {
        return <ion-toggle checked={this.darkTheme}
                           onClick={() => this.toggleTheme()}>
        </ion-toggle>
    }
}
```

### Styling

You could either style the themes using CSS variables or even just properties. In both case, what does matter, is applying the theme according the class names we have just set on the `body` element, respectively `dark` .

In case you would use Ionic, you would for example be able to style a specific background and text color in your `variables.scss` ( `:root` without selector being the light theme):

```css
:root {
	--ion-text-color: black;
}

body.dark {
	--ion-background-color: black;
	--ion-text-color: white;
}
```

Or another example in plain HTML/CSS:

```html
<style>
	body {
		background: red;
		color: yellow;
	}
	body.dark {
		background: purple;
		color: green;
	}
</style>
```

### All Together

Our project, DeckDeckGo, is open source 😺. Therefore, let me share with you the above implementation with some GitHub references of our remote control:

- Singleton service: [Theme.service](https://github.com/deckgo/deckdeckgo/blob/master/remote/src/app/services/theme/theme.service.tsx).ts
- Init and watch: [app-root.tsx](https://github.com/deckgo/deckdeckgo/blob/master/remote/src/app/app-root.tsx)
- An example of switcher: [app-general-settings.tsx](https://github.com/deckgo/deckdeckgo/blob/master/remote/src/app/components/settings/app-general-settings/app-general-settings.tsx)
- Styling: [variables.scss](https://github.com/deckgo/deckdeckgo/blob/master/remote/src/global/theme/variables.scss)

![](https://daviddalbusco.com/assets/images/1*KgzkIUhche5Netqi1kfSTQ.gif)

### Cherry on the Cake 🍒🎂

Maybe you are actually not interested to split your code in different layers and just want to have one single Web Component which does take care of everything?

Guess what , we have got such a component too, the one we implemented in our [documentation](https://docs.deckdeckgo.com) for developers 😊

```javascript
import {Component, h, State} from '@stencil/core';

import {set, get} from 'idb-keyval';

@Component({
  tag: 'app-theme-switcher'
})
export class AppThemeSwitcher {

  @State()
  private darkMode: boolean = false;

  private domBodyClassList: DOMTokenList = document.body.classList;

  private async init(): Promise<boolean> {
    try {
      const saved: boolean = await get('dark_mode');

      if (saved !== undefined) {
        return saved;
      }
    } catch (err) {
      return false;
    }

    const darkFromMedia: MediaQueryList =
              window.matchMedia('(prefers-color-scheme: dark)');

    return darkFromMedia.matches;
  }

  private update() {
    !this.darkMode ?
      this.domBodyClassList.add('dark') :
      this.domBodyClassList.remove('dark');
    this.darkMode = !this.darkMode;
  }

  async componentWillLoad() {
    this.darkMode = await this.init();

    if (this.darkMode) {
      this.domBodyClassList.add('dark');
    }
  }

  private async toggleTheme() {
    this.update();

    try {
      await set('dark_mode', this.darkMode);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return <ion-toggle checked={this.darkMode}
                       onIonChange={() => this.toggleTheme()}>
    </ion-toggle>
  }
}
```

To infinity and beyond 🚀

David
