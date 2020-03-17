---
path: "/blog/replace-environment-variables-in-your-index"
date: "2020-03-17"
title: "Replace Environment Variables In Your Index.html"
description: "How to update environment variables and even add a SHA-256 in your application index.html without any plugins #OTAD-33"
tags: "#showdev #javascript #webdev #motivation"
image: "https://cdn-images-1.medium.com/max/1600/1*ez9DfR9-odbABx1E3E6Zcg.png"
canonical: "https://medium.com/@david.dalbusco/replace-environment-variables-in-your-index-html-95ed2687575e"
---

![](https://cdn-images-1.medium.com/max/1600/1*ez9DfR9-odbABx1E3E6Zcg.png)

*Photo by [Joshua Earle](https://unsplash.com/@joshuaearle?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Yesterday evening I began that crazy [challenge](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) to share a blog post each and every day until the quarantine is over here in Switzerland the 19th April 2020, 33 days left until hopefully better days.

In this second series’ article I would like to share with you another trick we have developed in our project [DeckDeckGo](https://deckdeckgo.com).

Even if we are open source and even share the credentials of our test environment directly in our [GitHub](https://github.com/deckgo/deckdeckgo) repo, we are keeping some, really few, production tokens hidden. Mostly because these are linked with our private credit cards 😅. That’s why, we have to replace environment variables at build time.

We have developed our frontend eco-system with the amazing compiler and toolchain [StencilJS](https://stenciljs.com) and I’ve already shared our solution to use variables in our code in two distinct posts (see [here](https://daviddalbusco.com/blog/environment-variables-with-stenciljs) and [there](https://daviddalbusco.com/blog/hide-environment-variables-in-your-stenciljs-project)). But, what I did not share so far is, how we replace environment variables in our `index.html` without any plugins 😃.

### Lifecycle NPM Scripts

We want to replace variables after the build as completed. To hook on a corresponding lifecycle we are using [npm-scripts](https://docs.npmjs.com/misc/scripts) most precisely we are using `postbuild` . In our project, we create a vanilla Javascript file, for example `config.index.js` , and we reference it in the `package.json` file.

```json
"scripts": {
  "postbuild": "./config.index.js",
}
```

### Add Variable In Index.html

Before implementing the script to update the variable per se, let’s first add a variable in our `index.html` . For example, let’s add a variable `<@API_URL@>` for the url of the API in our CSP rule.

Of course, out of the box, this content security policy will not be compliant as `<@API_URL@>` isn’t a valid url. Fortunately, in such case, the browser simply ignore the rule, which can be seen as convenient, because we can therefore work locally without any problems and without having to replace the value 😄.

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
  connect-src 'self' <@API_URLS@>"
/>
```

### Update Script

Configuration is in place, variable has been added, we just have now to implement the script. Basically, what it does, it finds all `html` pages (we use pre-rendering, therefore our bundle contains more than a single `index.html` ) and for each of these, read the content, replace the variable we have defined with a regex (not the clever one, I’m agree) and write back the results.

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function updateCSP(filename) {
  fs.readFile(`${filename}`, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }

    const result =
          data.replace(/<@API_URLS@>/g, `https://myapi.com`);

    fs.writeFile(`${filename}`, result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });
}

function findHTMLFiles(dir, files) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      findHTMLFiles(fullPath, files);
    } else if (path.extname(fullPath) === '.html') {
      files.push(fullPath);
    }
  });
}

let htmlFiles = [];
findHTMLFiles('./www/', htmlFiles);

for (const file of htmlFiles) {
  updateCSP(`./${file}`);
}
```

Voilà, we are updating automatically at build time our environment variables in our application `index.html` 🎉

### Generate SHA-256 For Your CSP

The above solution is cool but we actually had to go deeper. Each time we build our app, a `script` is going to be injected in our `index.html` in order to load the service worker. As we want to apply strict CSP rules, this script is going to be invalidated until we provide a SHA-256 exception for its representation. Of course, we weren’t looking forward to calculate it on each build and we have automated that task too. To do so, let’s first add a new variable in your `index.html` .

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self';
  connect-src 'self' <@API_URLS@>"
  script-src 'self' <@SW_LOADER@>
/>
```

Once done, we now enhance the update script with a new function which takes care of finding the loading script (once again, not the cutest detection pattern, I’m agree), once found, generates its SHA-256 value and inject it as a new variable.

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const crypto = require('crypto');

function updateCSP(filename) {
  fs.readFile(`${filename}`, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }

    let result = data.replace(/<@API_URLS@>/g, `https://myapi.com`);

    const swHash = findSWHash(data);
    if (swHash) {
      result = result.replace(/<@SW_LOADER@>/g, swHash);
    }

    fs.writeFile(`${filename}`, result, 'utf8', function(err) {
      if (err) return console.log(err);
    });
  });
}

function findSWHash(data) {
  const sw = /(<.?script data-build.*?>)([\s\S]*?)(<\/script>)/gm;

  let m;
  while ((m = sw.exec(data))) {
    if (m && m.length >= 3 && m[2].indexOf('serviceWorker') > -1) {
      return `'sha256-${crypto
        .createHash('sha256')
        .update(m[2])
        .digest('base64')}'`;
    }
  }

  return undefined;
}

function findHTMLFiles(dir, files) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      findHTMLFiles(fullPath, files);
    } else if (path.extname(fullPath) === '.html') {
      files.push(fullPath);
    }
  });
}

let htmlFiles = [];
findHTMLFiles('./www/', htmlFiles);

for (const file of htmlFiles) {
  updateCSP(`./${file}`);
}
```

That’s it, isn’t this handy?

### Summary

As I said above, the regex and selector I used above aren’t the most beautiful one, but you know what, I’m not against improvements. If you are into it, don’t hesitate to send me a [Pull Request](https://github.com/deckgo/deckdeckgo) 😁.

Stay home, stay safe!

David
