---
path: "/blog/nodejs_unzip_async_await"
date: "2021-03-14"
title: "Node.js: Unzip Async Await"
description: "Unzip a .zip file in an asynchronous Node.js context."
tags: "#javascript #nodejs #webdev #programming"
image: "https://cdn-images-1.medium.com/max/1600/1*aRAiHOPwSAGnffuFtAGghA.jpeg"
canonical: "https://daviddalbusco.medium.com/node-js-unzip-async-await-901040d30393"
---

![](https://cdn-images-1.medium.com/max/1600/1*aRAiHOPwSAGnffuFtAGghA.jpeg)

_Photo by [Florian Steciuk](https://unsplash.com/@flo_stk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://medium.com/s/photos/highway?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

I am developing a new feature of [DeckDeckGo](https://deckdeckgo.com) for which I have to unzip a data in [Firebase Functions](https://firebase.google.com/docs/functions).

It took more time than expected to code such a [Node.js](https://nodejs.org/) function, that’s why I am sharing this solution, hoping it might help you some day too 😇.

---

### Unzipper

Node.js provides a compression module [Zlib](https://nodejs.org/api/zlib.html) but, it does not support ZIP files. Luckily, we can use the library [unzipper](https://github.com/ZJONSSON/node-unzipper) to handle these.

```bash
npm i unzipper --save
```

---

### Unzip With Async Await

My new feature reads and writes data uploaded in [Firebase Storage](https://firebase.google.com/docs/storage) through streams. I also develop my code with a promises (async / await) approach. Therefore, both have to coexist.

To narrow down the following example, I replaced the cloud storage with local files handled with file system streams (`fs` ).

The function `unzip` instantiates a stream on the `zip` data which is piped with `unzipper` . Each entry are iterated and piped themselves to writable outputs. Summarized: the zip is opened and each files it contains are extracted.

`unzip` is called in a retro compatible top await function and, that’s basically it 🥳.

```javascript
const { Parse } = require("unzipper");
const { createWriteStream, createReadStream } = require("fs");

const unzip = () => {
	const stream = createReadStream("/Users/david/data.zip").pipe(Parse());

	return new Promise((resolve, reject) => {
		stream.on("entry", (entry) => {
			const writeStream = createWriteStream(`/Users/david/${entry.path}`);
			return entry.pipe(writeStream);
		});
		stream.on("finish", () => resolve());
		stream.on("error", (error) => reject(error));
	});
};

(async () => {
	try {
		await unzip();
	} catch (err) {
		console.error(err);
	}
})();
```

---

### Read To String With Async Await

I had to read files with streams too. Consequently and cherry on top, here is how I integrated these in my code.

```javascript
const { createReadStream } = require("fs");

const read = () => {
	const stream = createReadStream("/Users/david/meta.json");

	return new Promise((resolve, reject) => {
		let data = "";

		stream.on("data", (chunk) => (data += chunk));
		stream.on("end", () => resolve(data));
		stream.on("error", (error) => reject(error));
	});
};

(async () => {
	try {
		const meta = await read();

		console.log({ meta });
	} catch (err) {
		console.error(err);
	}
})();
```

It follows the same approach as previously and read the file content to an in memory `string`.

---

### Summary

![](https://cdn-images-1.medium.com/max/1600/1*6wJfY8vH1FbC1s4Uzxy0QQ.gif)

> Coding is like a box of chocolates. You never know what you’re gonna get. Sometimes it should be quick, it takes time. Sometimes it should take so much time but, it goes fast — For-dev-rest Gump

To infinity and beyond!

David
