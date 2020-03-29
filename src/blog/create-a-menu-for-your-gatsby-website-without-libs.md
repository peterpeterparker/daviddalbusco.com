---
path: "/blog/create-a-menu-for-your-gatsby-website-without-libs"
date: "2020-03-29"
title: "Create A Menu For Your Gatsby Website Without Libs"
description: "How to create a menu for your Gatsby website without the use of any libraries or dependencies"
tags: "#gatsby #webdev #javascript #css"
image: "https://cdn-images-1.medium.com/max/1600/1*yi2pw2XA-49C9nGuXudI1A.png"
canonical: "https://medium.com/@david.dalbusco/create-a-menu-for-your-gatsby-website-without-libs-b7eb3a563fd2"
---

![](https://cdn-images-1.medium.com/max/1600/1*yi2pw2XA-49C9nGuXudI1A.png)

*Photo by [Catherine Heath](https://unsplash.com/@catherineheath?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/menu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-one** days left until hopefully better days.

*****

I have developed my [personal](https://daviddalbusco.com) website with [Gatsby](https://www.gatsbyjs.org) but without using any templates or any design libraries. No particular reason, I just like in my personal projects to restrict the use of dependencies when I can. Thereby, I had to build my own simple menu for the navigation which I’m sharing with you today.

![](https://cdn-images-1.medium.com/max/1600/1*dhsTKRMX2hNVqfmaDGwaOg.gif)

*[daviddalbusco.com](https://daviddalbusco.com)*

*****

### Menu Component

The menu is nothing else than a component which contains a `state` to reflect its status, being open or close. Its only particularity is the fact that we have to expose a function `open()` in order to be able to trigger its opening from the navigation, in my case, from the hamburger menu in the navigation bar. For such purpose we use Hooks API [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) to customize our instance.

```javascript
import React, { useImperativeHandle, useRef } from "react"

import { Link } from "gatsby"

import styles from "./menu.module.scss"

class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <div
        role="button"
        tabIndex="0"
        className={`${styles.menu} ${this.state.open ? `${styles.open}` : ""}`}
        onClick={() => this.close()}
        onKeyDown={() => this.close()}
      >
        <Link to="/"><h1>Home</h1></Link>
        <Link to="/#portfolio"><h1>Portfolio</h1></Link>
        <Link to="/#about"><h1>About</h1></Link>
        <Link to="/blog"><h1>Blog</h1></Link>
        <Link to="/#contact"><h1>Contact</h1></Link>
      </div>
    )
  }

  close() {
    this.setState({ open: false })
  }

  open() {
    this.setState({ open: true })
  }
}

export default React.forwardRef((props, ref) => {
  const menuRef = useRef()

  useImperativeHandle(ref, () => ({
    open() {
      menuRef.current.open()
    },
  }))

  return <Menu ref={menuRef} {...props} />
})
```

For the styling, I use CSS modules in the above example. The menu is as a fixed `div` which covers the all screen and is per default not visible. With the help of the state, I apply a style to modify its opacity with a small transition to make the menu appears a bit smoothly.

```css
.menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #ffffff;
  z-index: 1031;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  visibility: hidden;
  opacity: 0;

  transition: all 0.35s;

  cursor: pointer;

  &.open {
    visibility: visible;
    opacity: 1;
  }

  a {
    pointer-events: all;
  }
}
```

*****

### Integrating The Menu

To use the menu in the navigation, I have integrated in its related component. The only particularity I had to develop is assigning a reference in order to be able call the method `open()` from an `onClick` function.

Note that as the menu inherits a `fixed` style, it can be integrated at any level of the DOM.

```javascript
import React from "react"

import Menu from "./menu"

class Navigation extends React.Component {

  render() {
    return (
      <>
        <button onClick={() => this.toggleMenu()}>
          Open Menu
        </button>

        <Menu ref={el => (this.childMenu = el)} />
      </>
    )
  }

  toggleMenu() {
    this.childMenu.open()
  }
}

export default Navigation
```

That’s it, nothing more, nothing less, we have developed a custom menu for our website without any JavaScript dependencies 😁.

*****

### Summary

I like to use Gatsby for website. It has many advantages and I think it is also cool for me that it uses [React](https://reactjs.org) as I like on a weekly basis to not stick to the same technologies. A bit of [Angular](https://angular.io), a bit of React, a bit of Web Components with [StencilJS](https://stenciljs.com), a bit of vanilla JavaScript, everything is only fun 😉.

Stay home, stay safe!

David
