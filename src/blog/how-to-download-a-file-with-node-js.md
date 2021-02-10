---
path: "/blog/how-to-download-a-file-with-node-js"
date: "2021-02-10"
title: "How To Download A File With Node.js"
description: "If you ever need to download a file with Node.js, here is a small script to achieve your goal."
tags: "#javascript #nodejs #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*D86BStQhZNADuM6GjmVVAQ.jpeg"
canonical: "https://daviddalbusco.medium.com/how-to-download-a-file-with-node-js-e2b88fe55409"
---

![](https://cdn-images-1.medium.com/max/1600/1*D86BStQhZNADuM6GjmVVAQ.jpeg)

*Photo by [Savannah Wakefield](https://unsplash.com/@sw_creates?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/download-file?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Over the weekend I made a dependency update of my time tracking app “Tie Tracker” ([PWA](https://tietracker.com) / [GitHub](https://github.com/peterpeterparker/tietracker)).

In this particular tool, I defer the heavy work to [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) so that the UI does not find itself in a blocking state.

Because the app is meant to work offline and, is available in the [App Store](https://apps.apple.com/us/app/tie-tracker/id1493399075) and [Google Play](https://play.google.com/store/apps/details?id=com.tietracker.app), I did not import the required workers’ dependencies through a CDN but, locally.


The app itself is developed with [React](https://reactjs.org/) but, I implemented the workers with vanilla JavaScript and no package manager to handle their dependencies.

Therefore, I had to come with a solution to update the libs with a[Node.js](https://nodejs.org/en/) script 😇.

*****

### Node Fetch

There is no `window.fetch` like API in Node.js but, there is a light-weight module that brings such capabilities. That’s why I used [node-fetch](https://github.com/node-fetch/node-fetch) to implement the download of the file.

```bash
npm i node-fetch --save-dev
```

*****

### Script

The script I developed to update my dependencies is the following:

```javascript
const {createWriteStream} = require('fs');
const {pipeline} = require('stream');
const {promisify} = require('util');
const fetch = require('node-fetch');

const download = async ({url, path}) => {
  const streamPipeline = promisify(pipeline);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`);
  }

  await streamPipeline(response.body, createWriteStream(path));
};

(async () => {
  try {
    await download({
      url: 'https://unpkg.com/...@latest/....min.js',
      path: './public/workers/libs/....min.js',
    });
  } catch (err) {
    console.error(err);
  }
})();
```

The above `download` function uses a stream pipeline to download a file, as displayed in the node-fetch README, and the built-in `fs` module to write the output to the file system.

Top Level Await is available as of Node.js v14.8.0 but, I used an immediate function  because I integrated it in a chain in which it was not available yet.

That’s it 🥳

*****

### Continue Reading

If you want to read more about React and Web Workers, I published back to back three blog posts about it last year 😉.

* [React and Web Workers](https://daviddalbusco.com/blog/react-and-web-workers)
* [React, Web Workers, and IndexedDB](https://daviddalbusco.com/blog/react-web-workers-and-indexeddb)
* [React, Web Workers, IndexedDB and ExcelJS](https://daviddalbusco.com/blog/react-web-workers-indexeddb-and-exceljs)

To infinity and beyond!

David
