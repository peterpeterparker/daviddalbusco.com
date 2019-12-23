---
path: "/blog/generate-contrasting-text-for-your-random-background-color"
date: "2019-12-23"
title: "Generate Contrasting Text For Your Random Background Color"
description: "How to generate automatically a contrasting text for your random background color in Javascript."
tags: "#javascript #webdev #a11y #tutorial"
image: "https://cdn-images-1.medium.com/max/1600/1*o8tTGo3vsocTKnCUyz0wHA.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*o8tTGo3vsocTKnCUyz0wHA.jpeg)

*Photo by [davisco](https://unsplash.com/@codytdavis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I’m currently developing a new application to improve, notably, my [React Redux](https://react-redux.js.org) know-how. In this new project, users will be able to assign the color of their choice to some entities background. That’s why I had to find a solution to display contrasted texts.

### Credits

I was looking to resolve this problem this weekend until I suddenly remembered that the [Ionic Color Generator](https://ionicframework.com/docs/theming/colors) actually already solved it. I had a look at their [code](https://github.com/ionic-team/ionic-docs/blob/master/src/components/color-gen/color.ts) (you gotta love open source ❤️) and based the solution on their implementation.

I also had to implement a function to convert hexadecimal to RGB colors. For that purpose, I found a clean regular expression on [Stackoverflow](https://stackoverflow.com/a/5624139/5404186) provided by [xameeramir](https://stackoverflow.com/users/2404470/xameeramir).

### Generate A Contrasting Text

To generate a contrasting text, we are using the following formula defined by the [world wide web consortium (W3C)](https://www.w3.org/WAI/ER/WD-AERT/#color-contrast) to ensure that foreground and background color combinations provide sufficient contrast when viewed by someone having color deficits or when viewed on a black and white screen:

```
((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
```

The above algorithm takes a YIQ color scheme, converted from a RGB formula, as input and outputs a perceived brightness for a color. 

Because I’m working with hexadecimal colors, the implementation needs two conversions before being able to calculate the brightness. It first need to convert the the input to RGB and then to YIQ colors.

Finally, with the help of a threshold value, it could determine if the contrast should be dark or light and provide as result a contrasting text “color”, either a black or white.

```typescript
interface RGB {
    b: number;
    g: number;
    r: number;
}

function rgbToYIQ({ r, g, b }: RGB): number {
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

function hexToRgb(hex: string): RGB | undefined {
    if (!hex || hex === undefined || hex === '') {
        return undefined;
    }

    const result: RegExpExecArray | null =
          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : undefined;
}

export function contrast(colorHex: string | undefined,
                         threshold: number = 128): string {
    if (colorHex === undefined) {
        return '#000';
    }

    const rgb: RGB | undefined = hexToRgb(colorHex);

    if (rgb === undefined) {
        return '#000';
    }

    return rgbToYIQ(rgb) >= threshold ? '#000' : '#fff';
}
```

### Demo With Vanilla Javascript

Let’s give a try to the above solution in Vanilla Javascript.

![](https://cdn-images-1.medium.com/max/1600/1*33JQbJ-KqGrry-VIXHZbMA.gif)

*Contrasting text automatically generated for the selected color*

In an `html` page, we add a color picker to select a dynamic value. For that purpose, we use the component we developed  for [DeckDeckGo](https://deckdeckgo.com), our web open source editor for presentations. We load the component from [Unpkg](https://unpkg.com) that’s why no dependencies have to be installed locally.

```html
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <title>Contrast color</title>
  <script type="module" src="https://unpkg.com/@deckdeckgo/color@latest/dist/deckdeckgo-color/deckdeckgo-color.esm.js"></script>
  <script nomodule=""
src="https://unpkg.com/@deckdeckgo/color@latest/dist/deckdeckgo-color/deckdeckgo-color.js"></script>
</head>

<body style="background: #F78DA7;">
  <h1 style="font-size: 40px;">Hello World</h1>

  <deckgo-color></deckgo-color>

  <!-- Here we will add the contrast function -->

  <!-- Here we will bind the event and modify the colors -->

</body>
```

Then we add our above function to generate a contrasting text. Note that we just remove the Typescript part and only parse the Javascript code.

```html
<script>
  function rgbToYIQ({r, g, b}) {
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
  }

  function hexToRgb(hex) {
    if (!hex || hex === undefined || hex === '') {
      return undefined;
    }

    const result =
          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : undefined;
  }

  function contrast(colorHex, threshold = 128) {
    if (colorHex === undefined) {
      return '#000';
    }

    const rgb = hexToRgb(colorHex);

    if (rgb === undefined) {
      return '#000';
    }

    return rgbToYIQ(rgb) >= threshold ? '#000' : '#fff';
  }
</script>
```

Finally, we bind an event to the color picker to listen to the selected color, which we apply to the page background and which we use to generate a contrasted value we ultimately set as color of the text of the page.

```html
<script>
  document.querySelector('deckgo-color')
          .addEventListener('colorChange', updateColor, true);

  function updateColor($event) {
    document.querySelector('body').style.background = 
                                   $event.detail.hex;
    document.querySelector('body').style.color = 
                                   contrast($event.detail.hex);
  }
</script>
```

### Cherry on the cake 🍒🎂

Our `@deckdeckgo/color` Web Component is open source. It’s a [StencilJS](https://stenciljs.com) Web Component and therefore it can be use in Vanilla Javascript or with any modern frameworks. It is also relatively lightweight, according [Bundlephobia](https://bundlephobia.com/result?p=@deckdeckgo/color@1.0.0-rc.3-2) it only adds 418 Bytes (once minified and gzipped) to any bundles. If you want to give it a try in your application, check its [documentation](https://docs.deckdeckgo.com/components/color) and go for it!

To infinity and beyond, merry Xmas 🎄🚀

David
