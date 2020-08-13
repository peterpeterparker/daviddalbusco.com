---
path: "/blog/reimplementing-document-execcommand"
date: "2020-08-13"
title: "Re-implementing document.execCommand()"
description: "The execCommand method has been marked has obsolete, here is how I re-implemented its styling command."
tags: "#javascript #webdev #showdev #html"
image: "https://cdn-images-1.medium.com/max/1600/1*BDpmr6_txiIdod6OCOyvZA.jpeg"
canonical: "https://medium.com/@david.dalbusco/reimplementing-document-execcommand-6ffc33a80f02"
---

![](https://cdn-images-1.medium.com/max/1600/1*BDpmr6_txiIdod6OCOyvZA.jpeg)

*Photo by [Nathan Rodriguez](https://unsplash.com/@nathanrodrigue_z?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)</span>

> This feature is obsolete. Although it may still work in some browsers, its use is discouraged since it could be removed at any time. Try to avoid using it. — MDN web docs

Without a clear explanation on why nor when, `document.execCommand()` has been marked as obsolete in the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand). Fun fact, it is not marked as deprecated in all languages, as for example French or Spanish which do not mention anything 😜.

For [DeckDeckGo](https://deckdeckgo.com), an open source web editor for slides, we have developed and published a custom [WYSIWYG editor](https://docs.deckdeckgo.com/components/inline-editor) which relied on such feature. 

Because it may be future proof to proactively replace its usage by a custom implementation, I spent quite some time reimplementing it 😄.

Even though my implementation does not look that bad (I hope), I kind of feel, I had to re-implement the wheel. That’s why I am sharing with you my solution, hoping that some of you might point out some improvements or even better, send us [pull requests](https://github.com/deckgo/deckdeckgo/) to make the component rock solid 🙏.

*****

### Introduction

One thing I like about our WYSIWYG editor is its cross devices compatibility. It works on desktop as on mobile devices where, instead of appearing as a floating popup, it will be attached either at the top (iOS) or bottom of the viewport (Android) according how the keyboard behaves.

It can change text style (bold, italic, underline and strikethrough), fore- and background color, alignment (left, center or right), lists (ordered and not ordered) and even exposes a `slot` for a custom action.

![](https://cdn-images-1.medium.com/max/1600/1*4wuYSS_u3KfKHSI1xLdR4g.gif)

*****

### Limitation

My following re-implementation of `document.execCommand` do seems to work well but, it does not support an undo functionality (yet), what’s still a bummer 😕.

As for the code itself, I am open to any suggestions, ping me with your best ideas!

*****

### Goal

The objective shared in the blog post is the re-implementation of following functions (source [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)):

```javascript
document.execCommand(aCommandName, aShowDefaultUI, aValueArgument)
```

* **bold**: Toggles bold on/off for the selection or at the insertion point. 
* **italic**: Toggles italics on/off for the selection or at the insertion point.
* **underline: **Toggles underline on/off for the selection or at the insertion point.
* **strikeThrough**: Toggles strikethrough on/off for the selection or at the insertion point.
* **foreColor**: Changes a font color for the selection or at the insertion point. This requires a hexadecimal color value string as a value argument.
* **backColor**: Changes the document background color.

*****

### Implementation

I feel more comfortable using [TypeScript](https://www.typescriptlang.org/) when I develop, well, anything JavaScript related, that’s why the following code is type and why I also began the implementation by declaring an interface for the actions.

```javascript
export interface ExecCommandStyle {
  style: 'color' | 
         'background-color' | 
         'font-size' | 
         'font-weight' | 
         'font-style' | 
         'text-decoration';
  value: string;
  initial: (element: HTMLElement | null) => Promise<boolean>;
}
```

Instead of trying to create new elements as the actual API does per default, I  decided that it should instead modifies CSS attributes. The `value` can take for example the value `bold` if the style is `font-weight` or `#ccc` if a color is applied. The interface also contains a function `initial` which I am going to use to determine is a style should be applied or removed.

*****

Once the interface declared, I began the implementation of the function will take cares of applying the style. It begin by capturing the user selected text, the `selection` , and identifying its `container` . Interesting to notice that the container can either be the text itself or the parent element of the selection.

It is also worth to notice that the function takes a second parameter `containers` which defines a list of elements in which the function can be applied. Per default `h1,h2,h3,h4,h5,h6,div` . I introduced this limitation to not iterate through the all DOM when searching for information.

```javascript
export async function execCommandStyle(
                 action: ExecCommandStyle, containers: string) {
  const selection: Selection | null = await getSelection();

  if (!selection) {
    return;
  }

  const anchorNode: Node = selection.anchorNode;

  if (!anchorNode) {
    return;
  }

  const container: HTMLElement =
    anchorNode.nodeType !== Node.TEXT_NODE 
    && anchorNode.nodeType !== Node.COMMENT_NODE ? 
      (anchorNode as HTMLElement) : anchorNode.parentElement;
  // TODO: next chapter
}

async function getSelection(): Promise<Selection | null> {
  if (window && window.getSelection) {
    return window.getSelection();
  } else if (document && document.getSelection) {
    return document.getSelection();
  } else if (document && (document as any).selection) {
    return (document as any).selection.createRange().text;
  }

  return null;
}
```

*****

The idea is to style the text with CSS attributes. That's why I am going to convert the user's selection into `span`.

Even though, I thought that it would be better to not always add new elements to the DOM. For example, if a user select a background color red and then green for the exact same selection, it is probably better to modify the  existing style rather than adding a `span` child to another `span` with both the same CSS attributes. That’s why I implemented a text based comparison to either `updateSelection` or `replaceSelection` .

```javascript
const sameSelection: boolean = 
      container && container.innerText === selection.toString();

if (sameSelection && 
  !isContainer(containers, container) 
  && container.style[action.style] !== undefined) {
    
    await updateSelection(container, action, containers);

    return;
}

await replaceSelection(container, action, selection, containers);
```

*****

#### Update Selection

By updating the selection, I mean applying the new style to an existing element. For example transforming `<span style="background-color: red;"/>` to `<span style="background-color: green;"/>` because the user selected a new background color.

Furthermore, when user applies a selection, I noticed, as for example with MS Word, that the children should inherit the new selection. That’s why after having applied the style, I created another function to clean the style of the children.

```javascript
async function updateSelection(container: HTMLElement, action: ExecCommandStyle, containers: string) {
  container.style[action.style] = 
            await getStyleValue(container, action, containers);

  await cleanChildren(action, container);
}
```

Applying the style needs a bit more work than setting a new value. Indeed, as for example with `bold` or `italic` , the user might want to apply it, then remove it, then apply it again, then remove it again etc.

```javascript
async function getStyleValue(container: HTMLElement, action: ExecCommandStyle, containers: string): Promise<string> {
  if (!container) {
    return action.value;
  }

  if (await action.initial(container)) {
    return 'initial';
  }

  const style: Node | null = 
        await findStyleNode(container, action.style, containers);

  if (await action.initial(style as HTMLElement)) {
    return 'initial';
  }

  return action.value;
}
```

In case of `bold` , the `initial` function is a simple check on the attribute.

```javascript
{
  style: 'font-weight',
  value: 'bold',
  initial: (element: HTMLElement | null) => 
           Promise.resolve(element && 
                           element.style['font-weight'] === 'bold')
}
```

When it comes to color, it becomes a bit more tricky as the value can either be an `hex` or a `rgb` value. That’s why I had to check both.

```javascript
{
  style: this.action,
  value: $event.detail.hex, // The result of our color picker
  initial: (element: HTMLElement | null) => {
    return new Promise<boolean>(async (resolve) => {
      const rgb: string = await hexToRgb($event.detail.hex);
      resolve(element && (element.style[this.action] === 
              $event.detail.hex || 
              element.style[this.action] === `rgb(${rgb})`));
  });
}
```

With the help of such definition, I can check if style should be added or removed respectively set to `initial` .

Unfortunately, it is not enough. The container might inherit its style from a parent as for example `<div style="font-weight: bold"><span/></div>` . That’s why I created the method `findStyleNode` which recursively iterates till it either find an element with the same style or the container.

```javascript
async function findStyleNode(node: Node, 
                        style: string, 
                        containers: string): Promise<Node | null> {
  // Just in case
  if (node.nodeName.toUpperCase() === 'HTML' || 
     node.nodeName.toUpperCase() === 'BODY') {
    return null;
  }

  if (!node.parentNode) {
    return null;
  }

  if (DeckdeckgoInlineEditorUtils.isContainer(containers, node)) {
    return null;
  }

  const hasStyle: boolean =
    (node as HTMLElement).style[style] !== null && 
    (node as HTMLElement).style[style] !== undefined && 
    (node as HTMLElement).style[style] !== '';

  if (hasStyle) {
    return node;
  }

  return await findStyleNode(node.parentNode, style, containers);
}
```

Finally, the style can be applied and `cleanChildren` can be executed. It is also a recursive method but instead of iterating to the top of the DOM tree, in iterates to the bottom of the container until it has processed all children.

```javascript
async function cleanChildren(action: ExecCommandStyle, 
                             span: HTMLSpanElement) {
  if (!span.hasChildNodes()) {
    return;
  }

  // Clean direct (> *) children with same style
  const children: HTMLElement[] = 
        Array.from(span.children)
             .filter((element: HTMLElement) => {
                return element.style[action.style] !== undefined && 
                       element.style[action.style] !== '';
              }) as HTMLElement[];

  if (children && children.length > 0) {
    children.forEach((element: HTMLElement) => {
      element.style[action.style] = '';

      if (element.getAttribute('style') === '' || 
          element.style === null) {
        element.removeAttribute('style');
      }
    });
  }

  // Direct children (> *) may have children (*) to be clean too
  const cleanChildrenChildren: Promise<void>[] = 
    Array.from(span.children).map((element: HTMLElement) => {
      return cleanChildren(action, element);
  });

  if (!cleanChildrenChildren || cleanChildrenChildren.length <= 0) {
    return;
  }

  await Promise.all(cleanChildrenChildren);
}
```

*****

#### Replace Selection

Replacing a selection to apply a style is a bit less verbose fortunately. With the help of a range, I extract a fragment which can be added as content of new `span` .

```javascript
async function replaceSelection(container: HTMLElement, 
                                action: ExecCommandStyle, 
                                selection: Selection, 
                                containers: string) {
  const range: Range = selection.getRangeAt(0);

  const fragment: DocumentFragment = range.extractContents();

  const span: HTMLSpanElement = 
              await createSpan(container, action, containers);
  span.appendChild(fragment);

  await cleanChildren(action, span);
  await flattenChildren(action, span);

  range.insertNode(span);
  selection.selectAllChildren(span);
}
```

To apply the style to the new `span` , fortunately, I can reuse the function `getStyleValue` as already introduced in the previous chapter.

```javascript
async function createSpan(container: HTMLElement, 
                     action: ExecCommandStyle, 
                     containers: string): Promise<HTMLSpanElement> {
  const span: HTMLSpanElement = document.createElement('span');
  span.style[action.style] = 
            await getStyleValue(container, action, containers);

  return span;
}
```

Likewise, once the new `span` is created, and the fragment applied, I have to `cleanChildren` to apply the new style to all descendants. Fortunately, again, that function is the same as the one introduced in the previous chapter.

Finally, because I am looking to avoid `span` elements without style, I created a function `flattenChildren` which aims to find children of the new style and which, after having been cleaned, do not contain any styles at all anymore. If I find such elements, I convert these back to text node.

```javascript
async function flattenChildren(action: ExecCommandStyle, 
                               span: HTMLSpanElement) {
  if (!span.hasChildNodes()) {
    return;
  }

  // Flatten direct (> *) children with no style
  const children: HTMLElement[] =    
      Array.from(span.children).filter((element: HTMLElement) => {
         const style: string | null = element.getAttribute('style');
         return !style || style === '';
      }) as HTMLElement[];

  if (children && children.length > 0) {
    children.forEach((element: HTMLElement) => {
      const styledChildren: NodeListOf<HTMLElement> =  
            element.querySelectorAll('[style]');
      if (!styledChildren || styledChildren.length === 0) {
        const text: Text = 
              document.createTextNode(element.textContent);
        element.parentElement.replaceChild(text, element);
      }
    });

    return;
  }

  // Direct children (> *) may have children (*) to flatten too
  const flattenChildrenChildren: Promise<void>[] =  
    Array.from(span.children).map((element: HTMLElement) => {
       return flattenChildren(action, element);
    });

  if (!flattenChildrenChildren || 
      flattenChildrenChildren.length <= 0) {
    return;
  }

  await Promise.all(flattenChildrenChildren);
}
```

*****

### Altogether

You can find the all code introduced in this blog post in our repo, more precisely:

* the WYSIWYG [Web Component](https://github.com/deckgo/deckdeckgo/tree/master/webcomponents/inline-editor)
* the ExecCommandStyle [interface](https://github.com/deckgo/deckdeckgo/blob/1978c754c0955dba9077a75d4d6d48eea50bdf99/webcomponents/inline-editor/src/interfaces/interfaces.ts#L17)
* the implementation of the [function](https://github.com/deckgo/deckdeckgo/blob/master/webcomponents/inline-editor/src/utils/execcommand-style.utils.tsx)

If you are looking to try it out locally, you will need to clone our [mono-repo](https://github.com/deckgo/deckdeckgo).

*****

### Conclusion

As I am reaching the conclusion of this blog post, looking back at it once again, I am honestly not sure anyone will ever understand my explanations 😅. I hope that at least it has aroused your curiosity for our WYSIWYG component and generally speaking, for our editor.

Give a try to [DeckDeckGo](https://deckdeckgo.com) to compose your next slides and ping us with your best ideas and feedbacks afterwards 😁.

To infinity and beyond!

David
