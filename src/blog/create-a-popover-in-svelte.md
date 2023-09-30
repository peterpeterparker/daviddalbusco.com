---
path: "/blog/create-a-popover-in-svelte"
date: "2022-06-23"
title: "Create A Popover In Svelte"
description: "How to create a popover in Svelte without any other libraries or dependencies."
tags: "#svelte #javascript #programming #tutorial"
image: "https://miro.medium.com/max/1400/0*7fX6Ojn4lPRXVlXu"
canonical: "https://daviddalbusco.medium.com/create-a-popover-in-svelte-fe7dd2eeebb1"
---

![Street art, using the word create.](https://images.unsplash.com/photo-1620545628446-6319bce6b95c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwzMHx8Y3JlYXRlfGVufDB8fHx8MTY1NTk2MjEzMw&ixlib=rb-1.2.1&q=80&w=1080)

_Photo by [Nick Fewings](https://unsplash.com/@jannerboy62?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

I have implemented the UI components of my last project [Papyrs](https://papy.rs/) without any third party design system libraries - i.e. I created all the components from scratch. I did so to get full control and flexibility over the miscellaneous bricks of my opinionated layout 😁.

In this blog post, I share how you can develop a popover component in [Svelte](https://svelte.dev/).

![popover.gif](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/popover.gif?token=zSiVJ0hkcizwlQaBH2mc3)

---

## Skeleton

A popover is a floating container that is rendered over the content next to an anchor - commonly a button - which initiates its display. To improve the visual focus of the overlay, a backdrop is generally used to partially obfuscate the view behind it.

![excalidraw-1655964556754.webp](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/excalidraw-1655964556754.webp?token=2HjwiL6BcBFxbz4T4OamD)

We can start the implementation by replicating above skeleton in a component named `Popover.svelte` which contains a `button` and `div`.

```html
<button>Open</button>

<div
	role="dialog"
	aria-labelledby="Title"
	aria-describedby="Description"
	aria-orientation="vertical"
>
	<div>Backdrop</div>
	<div>Content</div>
</div>
```

To improve the accessibility we can set the `dialog` role and provide some `aria` information (see [MDN docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role) for more details).

---

## Animation

We create a `boolean` state - `visible` - to display or close the popover. When the `button` is clicked, the state is set to `true` and the overlay gets rendered. On the contrary, when the backdrop is clicked, it turns to `false` and it closes.

In addition, we add a click listener on the popover that does nothing else than stopping the event propagation. This is useful to avoid closing the overlay when user is interacting with its content.

We can also make the overlay appearing and disappearing gracefully thanks to the [transition directive](https://svelte.dev/tutorial/transition) - also known as "Svelte's black magic" 😁.

```javascript
<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let visible = false;
</script>

<button on:click={() => (visible = true)}>Open</button>

{#if visible}
  <div
    role="dialog"
    aria-labelledby="Title"
    aria-describedby="Description"
    aria-orientation="vertical"
    transition:fade
    on:click|stopPropagation
  >
    <div
      on:click|stopPropagation={() => (visible = false)}
      transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
    >
      Backdrop
    </div>
    <div>Content</div>
  </div>
{/if}
```

---

## Position over the content

The popover should be rendered over the all content regardless if the page has been scrolled or not. Therefore we can use a `fixed` position as starting point. Its content and backdrop are both set to an `absolute` positioning. The backdrop should cover the screen as well but is a child of the overlay \- therefore the "absolute" - and the content should be positioned next to the anchor.

The rest of the CSS code we add to our solution are minimal styling settings for width, height or colors.

```javascript
<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let visible = false;
</script>

<button on:click={() => (visible = true)}>Open</button>

{#if visible}
  <div
    role="dialog"
    aria-labelledby="Title"
    aria-describedby="Description"
    aria-orientation="vertical"
    transition:fade
    class="popover"
    on:click|stopPropagation
  >
    <div
      on:click|stopPropagation={() => (visible = false)}
      transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
      class="backdrop"
    />
    <div class="wrapper">Content</div>
  </div>
{/if}

<style>
  .popover {
    position: fixed;
    inset: 0;

    z-index: 997;
  }

  .backdrop {
    position: absolute;
    inset: 0;

    background: rgba(0, 0, 0, 0.3);
  }

  .wrapper {
    position: absolute;

    min-width: 200px;
    max-width: 200px;

    min-height: 100px;

    width: fit-content;
    height: auto;

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    background: white;
    color: black;
  }
</style>

```

---

## Position next to the anchor

To set the overlay next to the button we have to get a reference on that element to find its position within the viewport. For such purpose we can `bind` the anchor.

When the reference is ready or when the window is resized (the position might change if user resize the browser), we use the [getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) method to query the information about the position.

We ultimately translate these JavaScript information to CSS variables to render the content of the popover at the exact position we would like to set.

```javascript
<script lang="ts">
  // ...

  let anchor: HTMLButtonElement | undefined = undefined;

  let bottom: number;
  let left: number;

  const initPosition = () =>
    ({ bottom, left } = anchor?.getBoundingClientRect() ?? { bottom: 0, left: 0 });

  $: anchor, initPosition();
</script>

<svelte:window on:resize={initPosition} />

<button on:click={() => (visible = true)} bind:this={anchor}>Open</button>

{#if visible}
  <div
    role="dialog"
    aria-labelledby="Title"
    aria-describedby="Description"
    aria-orientation="vertical"
    transition:fade
    class="popover"
    on:click|stopPropagation
    style="--popover-top: {`${bottom}px`}; --popover-left: {`${left}px`}"
  >
    <!-- ... -->
  </div>
{/if}

<style>
  /** ... */

  .wrapper {
    position: absolute;

    top: calc(var(--popover-top) + 10px);
    left: var(--popover-left);

    /** ... */
  }
</style>
```

Above code snippet was trimmed to showcase only what is related to this chapter. Altogether, the component's code is the following:

```javascript
<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let visible = false;
  let anchor: HTMLButtonElement | undefined = undefined;

  let bottom: number;
  let left: number;

  const initPosition = () =>
    ({ bottom, left } = anchor?.getBoundingClientRect() ?? { bottom: 0, left: 0 });

  $: anchor, initPosition();
</script>

<svelte:window on:resize={initPosition} />

<button on:click={() => (visible = true)} bind:this={anchor}>Open</button>

{#if visible}
  <div
    role="dialog"
    aria-labelledby="Title"
    aria-describedby="Description"
    aria-orientation="vertical"
    transition:fade
    class="popover"
    on:click|stopPropagation
    style="--popover-top: {`${bottom}px`}; --popover-left: {`${left}px`}"
  >
    <div
      on:click|stopPropagation={() => (visible = false)}
      transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
      class="backdrop"
    />
    <div class="wrapper">Content</div>
  </div>
{/if}

<style>
  .popover {
    position: fixed;
    inset: 0;

    z-index: 997;
  }

  .backdrop {
    position: absolute;
    inset: 0;

    background: rgba(0, 0, 0, 0.3);
  }

  .wrapper {
    position: absolute;

    top: calc(var(--popover-top) + 10px);
    left: var(--popover-left);

    min-width: 200px;
    max-width: 200px;

    min-height: 100px;

    width: fit-content;
    height: auto;

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    background: white;
    color: black;
  }
</style>

```

And...that's it! We have implemented a bare minimum custom popover that can be used in any Svelte applications without any dependency.

---

## Conclusion

We did not beautify the solution, therefore the outcome remains visually rough on the edges but, the popover works out as expected.

To iterate from there, implement more options or make it shiny, you could for example have a look to the open source code of [Papyrs](https://papy.rs) on [GitHub](https://github.com/papyrs/papyrs) 🤗.

To infinity and beyond  
David

![popover-tutorial.gif](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/popover-tutorial.gif?token=2-v9JeqR2Kp0TlXsAEQIS)
