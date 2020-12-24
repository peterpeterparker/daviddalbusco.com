---
path: "/blog/copy-url-to-clipboard-on-npm-run-start"
date: "2020-12-11"
title: "Copy URL To Clipboard On Npm Run Start"
description: "How to copy the start URL and parameters of your application to your clipboard while starting it locally."
tags: "#javascript #webdev #nodejs #npm"
image: "https://cdn-images-1.medium.com/max/1600/1*vO-uFCV6MmXmDCbHS5iO-Q.jpeg"
canonical: "https://daviddalbusco.medium.com/copy-url-to-clipboard-on-npm-run-start-f07c57e8d2e"
---

![](https://cdn-images-1.medium.com/max/1600/1*vO-uFCV6MmXmDCbHS5iO-Q.jpeg)

*Photo by [Gia Oris](https://unsplash.com/@giabyte?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

*****

I am not sure anyone will ever need the following tricks but, at my client’s place, we have an application which can only be accessed through an URL which contains a dynamic base64 parameter. Needless to say, it makes its local development a bit inconvenient.

In addition, I have to admit, I am not a big fan of CLI’s options which can automatically open browser. Even though I mostly use the Chrome Incognito mode for development purpose, I like to switch often between browsers to try out what I developed.

Finally, I don’t use bookmarks (don’t judge me) and, I often switch between technologies. Therefore, without configuration, every time another port has to be used ( `:3333` or `:4200` or `:8000` or `:8100` etc.).

That’s why I had the idea to add a pre-start script to the application which should copy the start URL of the application to my clipboard. Doing so, I can then just select a browser, paste the URI and, I am good to go.

*****

### Dependencies

In order to copy or read value to the clipboard from a NodeJS script, I used the library [clipboardy](https://github.com/sindresorhus/clipboardy) which implement such a cross-platform feature.

In addition, I also added [chalk](https://github.com/chalk/chalk) ann [boxen](https://github.com/sindresorhus/boxen) to print out the URL to the console in a stylish way.

You may notice that all these dependencies are open source and developed by the same person, [Sindre Sorhus](https://twitter.com/sindresorhus), which definitely deserve a shout-out for this awesome contribution and work 👍.

```bash
npm i clipboardy chalk boxen --save-dev
```

*****

### Script

Once the dependencies fetched, I created the pre-start script itself. In this example, I create a file `start-url.js` at the root of the project.

The script primary generates the `url` which I am looking to copy in my clipboard. On purpose, I am using an `Hello World 👋` string to demonstrate that it is possible to encode complex parameters.

To print out a nice message, I use `chalk` with colors, in for- and background, and the bold option. I use `\n\n` to create newlines. It is worth to notice that the library offer many options such as combining or nesting styles.

Using `clipboardy` to copy the URL to the clipboard is actually really few work and can be solved by calling its function `copy` with the all URL as input parameter.

Finally, in a `console.log` , I print out the message inside a box generated with `boxen` .

```javascript
const { write: copy } = require('clipboardy');
const chalk = require('chalk');
const boxen = require('boxen');

const params = encodeURIComponent('Hello World 👋');

const url = `http://localhost:3333/profile/${params}`;

(async () => {
    let message = chalk.yellow.inverse('Your URL');

    message += `\n\n${chalk.bold(`${url}`)}`;

    try {
        await copy(url);
        message += `\n\n${chalk.grey('Copied local address to clipboard!')}`;
    } catch (err) {
        message = chalk.red.bold(`Cannot copy ${url} to clipboard 🥺\n\n${err.message}`);
    }

    console.log(
        boxen(message, {
            borderStyle: 'round',
            padding: 1,
            borderColor: 'yellow',
            margin: 1
        })
    );
})();
```

*****

### Life Cycle

Thanks to [npm](https://docs.npmjs.com/cli/v6/using-npm/scripts) it is possible to execute scripts at different life cycles. Because I was looking to copy the URL when I start locally the application, I added it as a `prestart` script to my `package.json`.

```json
"scripts": {
  "prestart": "node start-url.js"
}
```

You might ask “But David, why a prestart and not poststart?” to which I would answer that `prestart` is executed for sure. On the contrary, `poststart`, is indeed also executed but, only when the `start` life cycle would be released. If your local server, as often, would stay active to watch for changes, `poststart` would only resolve when you would cancel your local server.

*****

### Demo

Everything being in place, when I hit `npm run start` in my console, the URL is generated, copied to the clipboard and, I notice the following output.

![](https://cdn-images-1.medium.com/max/1600/1*ld-QYTtC5iBSisGVvNzPMA.png)

If I open one of my browser, I can paste the result in the navigation bar.

![](https://cdn-images-1.medium.com/max/1600/1*glgIo-xgThAKIlL-Y1uqtw.png)

Finally, hit `enter` and access my URL with the generated parameters.

![](https://cdn-images-1.medium.com/max/1600/1*Zgx91lAb1eO8wN66IqYuYA.png)

*****

### Summary

As underlined in the introduction of this post, I am really not sure if anyone will ever need this solution ever 😅. Anyway, I hope it was a fun read and let me know if you would improve anything.

To infinity and beyond!

David
