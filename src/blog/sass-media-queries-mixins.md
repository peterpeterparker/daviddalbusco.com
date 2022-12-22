---
path: "/blog/sass-media-queries-mixins"
date: "2022-12-22"
title: "Sass media queries mixins"
description: "A Sass media queries mixins to avoid duplicating CSS breakpoints all over the place."
tags: "#css #sass #mixins"
image: "https://images.unsplash.com/photo-1486927181919-3ac1fc3a8082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyOHx8bGluZXxlbnwwfHx8fDE2NzE3MTI0MjM&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/sass-media-queries-mixins"
---

![ELNÒS Shopping mall pattern](https://images.unsplash.com/photo-1486927181919-3ac1fc3a8082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyOHx8bGluZXxlbnwwfHx8fDE2NzE3MTI0MjM&ixlib=rb-4.0.3&q=80&w=1080)

*Photo by [Luca Bravo](https://unsplash.com/@lucabravo?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

There are few gems we have implemented in [NNS-dapp](https://nns.ic0.app/) that makes our devs life easier on daily basis. One of these has been implemented my colleague [Maskims Strasinskis](https://github.com/mstrasinskis): a [Sass](https://sass-lang.com/) media queries [mixins](https://sass-lang.com/documentation/at-rules/mixin) that makes us avoid duplicating CSS breakpoints all over the place.

* * *

## Foreword

[CSS media queries](https://developer.mozilla.org/fr/docs/Web/CSS/Media_Queries/Using_media_queries) are handy but, as the app or design system grows, their usage grows as well exponentially which ultimately, makes the UI hard to maintain and difficult to refactor or re-work.

```scss
@media (min-width: 300px) {
    background: red;
}
```

Imagine having not one but, hundred of above breakpoints in your zillion of CSS files. If one day the design changes, you might have to run a gigantic search and replace to adapt your code.

That's where my colleague tricks becomes handy.

* * *

## Mixins

Sass mixins allow you to define styles that can be re-used throughout your stylesheet. They make it easy to avoid using non-semantic classes, and to distribute collections of styles in libraries ([source](https://sass-lang.com/documentation/at-rules/mixin)).

In other words, mixins are functions that can be used to replicate the same styles multiple times in your apps or libs without the need to duplicate the code.

In this way, the idea is to create a function that generates the breakpoints but obfuscate their values. That's why, the solution begins with the definition of Sass variables which define these sizes - e.g. the following within a `\_media.scss` file.

```scss
$breakpoint-xsmall: 320px;
$breakpoint-small: 576px;
$breakpoint-medium: 768px;
$breakpoint-large: 1024px;
$breakpoint-extra-large: 1300px;
```

Once the breakpoints defined, within the same file we can implement the effective mixins that maps a shorthand variable - e.g. `small` - with the size that we declared once (previous code).

```scss
@mixin min-width($breakpoint) {
  @if ($breakpoint == xsmall) {
    @media (min-width: $breakpoint-xsmall) {
      @content;
    }
  } @else if ($breakpoint == small) {
    @media (min-width: $breakpoint-small) {
      @content;
    }
  } @else if ($breakpoint == medium) {
    @media (min-width: $breakpoint-medium) {
      @content;
    }
  } @else if ($breakpoint == large) {
    @media (min-width: $breakpoint-large) {
      @content;
    }
  } @else if ($breakpoint == xlarge) {
    @media (min-width: $breakpoint-extra-large) {
      @content;
    }
  } @else {
    @error "UNKNOWN MEDIA BREAKPOINT #{$breakpoint}";
  }
}
```

In addition to taking arguments, a mixin can take an entire block of styles, known as a content block ([source](https://sass-lang.com/documentation/at-rules/mixin#content-blocks)). Content which we can render or not according the matching conditions.

* * *

## Usage

Once the mixins set, it can be loaded with a [use](https://sass-lang.com/documentation/at-rules/use) rule and included as following:

```html
<style lang="scss">
    @use './styles/mixins/media';

    div {
        @include media.min-width(small) {
            background: red;
        }

        @include media.min-width(large) {
            background: green;
        }
    }
</script>
```

And voilà, it's ready to serve 👨‍🍳.

* * *

## Conclusion

I should try to write a bit more about all these utilities and other handy features we have developed with my colleagues this year while re-building entirely [NNS-dapp](https://nns.ic0.app/) from the ground-up and also making it evolves, a lot. Even though the app is gigantic (e.g. we have 1'900+ jest tests running to validate each build), it's enjoyable to develop new features and easy to maintain.

Merry Xmas 🎄  
David