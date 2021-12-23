---
path: "/blog/converting-svg-to-image-png-webp-etc-in-javascript"
date: "2021-12-23"
title: "Converting SVG To Image (PNG, Webp, etc.) in JavaScript"
description: "How to convert SVG to image in the browser without dependencies."
tags: "#javascript #webdev #typescript #tutorial"
image: "https://cdn-images-1.medium.com/max/1600/1*zXDaYiF8SRHlI_OIGZnf8w.jpeg"
canonical: "https://zhx6p-eqaaa-aaaai-abbrq-cai.raw.ic0.app/d/converting-svg-to-image-in-javascript"
---

![](https://cdn-images-1.medium.com/max/1600/1*zXDaYiF8SRHlI_OIGZnf8w.jpeg)

*Photo by [Justin Aikin](https://unsplash.com/@justnjames?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/dog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

*****

Last Monday I built and published [a new Web Component](https://docs.deckdeckgo.com/?path=/story/components-social-image--social-image), developed with [StencilJS](https://stenciljs.com/), to generate social images dynamically in the browser.

For a given text and logo, the component renders a shadowed SVG that can be converted to an image (PNG, Webp, etc.), and does so without any third party dependencies.

This is how it works.

> Note: Code snippets are written in TypeScript.

*****

### SVG

To create the dynamic SVG, I used a `foreignObject` to embed the text with an HTML paragraph (`<p/>`) and a graphical `image` element.

*****

#### ForeignObject

I could have used `<text/>` elements to draw graphics instead of HTML elements, however the feature needs to support dynamic inputs. These can be too long and might need to be truncated and displayed with three ending dots `...` .

This is something I found easier to implement with CSS rather than with JavaScript. `<text/>` are not paragraphs but lines.

```javascript
<svg>
  {this.text && (
    <foreignObject>
      <p>{this.text}</p>
    </foreignObject>
  )}
</svg>
```

The [-webkit-line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp) CSS property allows shrinking the content of block containers to the specified number of lines.

```javascript
p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

*****

#### Image

Unlike the text, to embed the image, I had to use a graphical `<image/>` element.

```javascript
<svg>
  {this.imgBase64 && this.imgMimeType && (
    <image x="500" y="1000" width="64" height="64"
       href={`data:${this.imgMimeType};base64,${this.imgBase64}`} />
  )}
</svg>
```

Using a `foreignObject` with an HTML element `<img/>` would have been possible for rendering purposes but, I did not find a way to ultimately export it to the resulting image.

For the same reason, I was also not able to render the image directly from a URL (`href="https://..."`) and had to first transform it to a `base64` string.

Only this way the image is rendered and can be included in the converted image output.

```javascript
export const fetchImage = async ({imgSrc}: {imgSrc: string}): Promise<string | undefined> => {
  const data: Response = await fetch(imgSrc);
  const blob: Blob = await data.blob();

  const base64: string = await toBase64({blob});

  return base64.split(',')?.[1];
};

const toBase64 = ({blob}: {blob: Blob}): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        const {result} = reader;
        resolve(result as string);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      reject(err);
    }
  });
};
```

In the above code snippet, the `imgSrc` is the URL to the image -- the logo -- that should be embedded. It is first fetched, then transformed to a `blob` and finally converted to a `base64` string.

*****

### Convert To Image

Basically, the conversion process happens in two steps:

* SVG to Canvas
* Canvas to Image (Blob)

Translated to code, these steps can be chained in a function.

```javascript
@Method()
async toBlob(type: string = 'image/webp'): Promise<Blob> {
  const canvas: HTMLCanvasElement = 
        await svgToCanvas({svg: this.svgRef});
  return canvasToBlob({canvas, type});
}
```

As you may notice, the above method defines a default mime type (`image/webp`) for the export. According to my tests, it also works for other format such as `image/png` and `image/jpg`.

*****

#### SVG To Canvas

In one of my previous works (a [Figma plugin](https://github.com/deckgo/figma-deckdeckgo-plugin)) I already developed a function that convert SVG to `HTMLCanvasElement`.

```javascript
export const transformCanvas = ({index}: Frame): Promise<SvgToCanvas | undefined> => {
  return new Promise<SvgToCanvas | undefined>((resolve) => {
    const svg: SVGGraphicsElement | null =
      document.querySelector(`div[frame="${index}"] svg`);

    if (!svg) {
      resolve(undefined);
      return;
    }

    const {width, height} = svgSize(svg);

    const blob: Blob =
      new Blob([svg.outerHTML], 
              {type: 'image/svg+xml;charset=utf-8'});
    const blobURL: string = URL.createObjectURL(blob);

    const image = new Image();

    image.onload = () => {
      const canvas: HTMLCanvasElement = 
                    document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      const context: CanvasRenderingContext2D | null =
        canvas.getContext('2d');
      context?.drawImage(image, 0, 0, width, height);

      URL.revokeObjectURL(blobURL);

      resolve({
        canvas,
        index
      });
    };

    image.src = blobURL;
  });
};
```

At first, I had the feeling it would be a piece of cake to re-implement the exact same above function. Unfortunately, “feeling” was the only valid keyword in that sentence 😂.

The first issue I faced was related to the conversion of the SVG to Blob. In the previous method, it converts it using the SVG value and an object URL.

```javascript
const blob: Blob = new Blob([svg.outerHTML], 
                       {type: 'image/svg+xml;charset=utf-8'});
const blobURL: string = URL.createObjectURL(blob);
```

However, in my component, using that approach threw an exception at runtime.

> Security Error: Tainted canvases may not be exported.

I had no other choice than finding another way to instantiate the `Image` object which, fortunately, was possible by using another serialization method.

```javascript
const base64SVG: string =
  window.btoa(new XMLSerializer().serializeToString(svg));
const imgSrc: string = `data:image/svg+xml;base64,${base64SVG}`;
```

Unfortunately, even if the function threw no compilation nor runtime error, it was not yet ready. Indeed, no text was exported in the resulting canvas.

After some “die and retry” research, I figured out that the `foreignObject` content needs its CSS styles to be **inlined** when exporting.

To solve this in a relatively dynamical way, I implemented another function that replicates all CSS styles of the original text element to a clone.

```javascript
const inlineStyle = ({clone, style}: {clone: SVGGraphicsElement; style: CSSStyleDeclaration}) => {
  const text: HTMLParagraphElement | null =
    clone.querySelector('foreignObject > p');

  if (!text) {
    return;
  }

  for (const key of Object.keys(style)) {
    text.style.setProperty(key, style[key]);
  }
};
```

Finally, the transform from SVG to canvas worked out.

```javascript
export const svgToCanvas = ({svg, style}: {svg: SVGGraphicsElement; style: CSSStyleDeclaration}): Promise<HTMLCanvasElement> => {
  return new Promise<HTMLCanvasElement>(async (resolve) => {
    const {width, height} = svgSize(svg);

    const clone: SVGGraphicsElement =
      svg.cloneNode(true) as SVGGraphicsElement;

    inlineStyle({clone, style});

    const base64SVG: string =
      window.btoa(new XMLSerializer().serializeToString(clone));
    const imgSrc: string = `data:image/svg+xml;base64,${base64SVG}`;

    const image = new Image();

    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas: HTMLCanvasElement =
                    document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      const context: CanvasRenderingContext2D | null =
        canvas.getContext('2d');
      context?.drawImage(image, 0, 0, width, height);

      resolve(canvas);
    };

    image.src = imgSrc;
  });
};
```

As I modified its declaration, I also had to change the caller in order to find the style of the text element.

```javascript
@Method()
async toBlob(type: string = 'image/webp'): Promise<Blob> {
  const style: CSSStyleDeclaration | undefined =
  this.textRef ? getComputedStyle(this.textRef) : undefined;

  const canvas: HTMLCanvasElement =
    await svgToCanvas({svg: this.svgRef, style});
  return canvasToBlob({canvas, type});
}
```

*****

#### Canvas To Image (Blob)

Converting the canvas to an image results in a blob. In my original solution, I implemented that transformation with the help of the fetch API. It’s clean and concise.

```javascript
export const canvasToBlob =
  async ({canvas, type}: {canvas: HTMLCanvasElement; type: string}):
    Promise<Blob> => {
    const dataUrl: string = canvas.toDataURL(type);
    return (await fetch(dataUrl)).blob();
  };
```

However, once again you might say 😅, I discovered an issue at runtime when I deployed my application.

That approach requires enabling `data:` in the `connect-src` rule of the content security policy (CSP) which is strongly discouraged.

Fortunately, there is another way to convert canvas to blob, the built-in [toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) method that accept a `callback` as argument.

```javascript
export const canvasToBlob =
  async ({canvas, type}: {canvas: HTMLCanvasElement; type: string}):
    Promise<Blob> => {
    return new Promise<Blob>((resolve) => canvas.toBlob((blob: Blob) => resolve(blob), type));
  };
```

*****

### Conclusion

Sometimes development takes a bit more time than excepted, it took me a day to develop, solve all issues, test and publish the component but, I am glad I did it.

Not only it resolves a feature I needed to notably publish this blog post but, I learned quite some new tricks along the way.

Merry Christmas 🎄
David

*****

### Further Reading

Wanna read more our project ?We are porting [DeckDeckGo](https://deckdeckgo.com/) to [DFINITY’s](https://dfinity.org/) Internet Computer. Here is the list of blog posts I published since we started the project:

* [A Simple KeyVal Store Implemented in Motoko](https://daviddalbusco.com/blog/a-simple-keyval-store-implemented-in-motoko)
* [TypeScript Utilities For Candid](https://daviddalbusco.com/blog/typescript-utilities-for-candid)
* [Bye-Bye Amazon & Google, Hello Web 3.0](https://daviddalbusco.com/blog/bye-bye-amazon-and-google-hello-web-3-0)
* [Dynamically Import ESM Modules From A CDN](https://daviddalbusco.com/blog/dynamically-import-esm-modules-from-a-cdn)
* [Internet Computer: Web App Decentralized Database Architecture](https://daviddalbusco.com/blog/internet-computer-web-app-decentralized-database-architecture)
* [Singleton & Factory Patterns With TypeScript](https://daviddalbusco.com/blog/singleton-and-factory-patterns-with-typescript)
* [Hosting on the Internet Computer](https://daviddalbusco.com/blog/getting-started-with-the-internet-computer-web-hosting)
* [We Received A Grant To Port Our Web App To The Internet Computer](https://daviddalbusco.com/blog/we-received-a-grant-to-port-our-web-app-to-the-internet-computer)

*****

### Keep In Touch

To follow our adventure, you can star and watch our [GitHub repo](https://github.com/deckgo/deckdeckgo) ⭐️ and [sign up](http://eepurl.com/hKeMLD) to join the list of beta tester.
