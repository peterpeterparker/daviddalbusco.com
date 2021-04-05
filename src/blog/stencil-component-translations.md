---
path: "/blog/stencil-component-translations"
date: "2021-04-05"
title: "Stencil Component Translations"
description: "A quick way to set up i18n for Stencil components without dependencies."
tags: "#javascript #typescript #stencil #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*NXe3RbssR10n4RGMVGoZVg.jpeg"
canonical: "https://daviddalbusco.medium.com/stencil-component-translations-4efc44018b1d"
---

![](https://cdn-images-1.medium.com/max/1600/1*NXe3RbssR10n4RGMVGoZVg.jpeg)

*Photo by [Lucas George Wendt](https://unsplash.com/@lucasgwendt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/internationalization?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I have been using the same strategy to internationalize quickly [Stencil](https://stenciljs.com/) components without dependencies in various projects. Among others for the project [Owlly](https://owlly.ch/) or the [Bonjour foundation](https://bonjour.help/).

As all these projects are open source, I will share with you my recipe 🧑‍🍳.

*****

### Goal

This blog post has not for goal to set up i18n for an application, design system or any other sort of projects from a certain scale. I might blog about this some day too, as I recently internationalized with the help of the community our project [DeckDeckGo](https://deckdeckgo.com), but, this article has for goal to add translations to a relatively small component or set of components without dependency.

I use this solution when I create components which contain some `slot `with default values and which have has primary market our lovely “four languages + english per default” Switzerland 🇨🇭.

*****

### Setup

In your project create a new utility `translations.util.ts` and add the declarations.

```javascript
interface Translation {
  [key: string]: string;
}

interface Translations {
  de: Translation;
  en: Translation;
}
```

For this example, I will “only” use German and English. For a real life use case, extend it with your requirements.

I declared an `interface Translation` but, it can be replaced with a TypeScript `Record<string, string>` . Result is the same, as you rather like.

Following the declarations, add a constant for the default (fallback) language and a list of supported languages.

```javascript
const DEFAULT_LANGUAGE: 'en' = 'en';

const SUPPORTED_LANGUAGES: string[] = ['de', 'en'];
```

Finally, add the effective translations.

```javascript
const TRANSLATIONS: Translations = {
  de: {
    question: 'Wie fühlen Sie sich heute?',
    super: 'Sehr gut',
    bad: 'Nicht gut'
  },
  en: {
    question: 'How do you feel today?',
    super: 'Super',
    bad: 'Bad'
  }
};
```

In this solution, as my goal is to keep it quick and easy, I code the translations.

It is possible to handle these in separate `json` files and `import` these dynamically at runtime. That’s two features I have developed for my more complex use case. After all I maybe really need to blog about this? Ping me if you think that would be an interesting subject!

*****

### Detect Languages

I did not reinvent the wheel. I had a look to the widely use open source library [ngx-translate](https://github.com/ngx-translate/core) and implemented its detection of the browser languages.

In the same file, add the following function and initialization of the default language.

```javascript
const initBrowserLang = (): string | undefined => {
  if (typeof window === 'undefined' 
      || typeof window.navigator === 'undefined') {
    return undefined;
  }

  let browserLang: string | null =
    window.navigator.languages 
    && window.navigator.languages.length > 0 ? 
              window.navigator.languages[0] : null;
  
  // @ts-ignore
  browserLang = browserLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;

  if (typeof browserLang === 'undefined') {
    return undefined;
  }

  if (browserLang.indexOf('-') !== -1) {
    browserLang = browserLang.split('-')[0];
  }

  if (browserLang.indexOf('_') !== -1) {
    browserLang = browserLang.split('_')[0];
  }

  return browserLang;
}

const browserLang: string | undefined = initBrowserLang();
```

*****

### Function

The setup and detection are ready, we need a function to render the translations.

```javascript
export const translate = 
             (key: string, customLang?: 'de' | 'en'): string => {
  const lang: string | undefined = customLang || browserLang;
  return TRANSLATIONS[lang !== undefined 
                      && SUPPORTED_LANGUAGES.includes(lang) ? 
                         lang : DEFAULT_LANGUAGE][key];
};
```

It either uses the browser or a parameter language, check it against the list of supported languages or fallback to the default language, and returns the related translations.

*****

### Usage

In our component, the above function can be used to render a translation.

```javascript
import {Component, h, Host} from '@stencil/core';

import {translate} from './translations.utils';

@Component({
  tag: 'question',
  shadow: true
})
export class Question {
  render() {
    return <Host>
      <p>{translate('question')}</p>
      <slot name="answer">{translate('supper', 'de')}</slot>
    </Host>;
  }
}
```

It renders text, with or without specifying a language, and can be used with `slot` too.

*****

### Summary

![](https://cdn-images-1.medium.com/max/1600/1*Ud0o0tsLPyP76VNbKw-mvg.gif)

That was my small quick recipe to set up i18n to a relatively small set of components. I hope it is useful and if you think I should share the more complex solution in another post, let me know.

To infinity and beyond!

David
