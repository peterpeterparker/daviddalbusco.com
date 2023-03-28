---
path: "/blog/build-a-web3-app-with-react-js"
date: "2023-03-28"
title: "Build A Web3 App With React JS"
description: "How to develop a decentralized application on blockchain with React and Juno."
tags: "#react #web3 #blockchain #programming"
image: "https://images.unsplash.com/photo-1506878206813-92402b8ded23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxfHxDb21wdXRlciUyMEdyb25pbmdlbiUyQyUyME5ldGhlcmxhbmRzfGVufDB8fHx8MTY3OTk0MzA1OQ&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://juno.build/blog/build-a-web3-app-with-react-js"
---

![Working on Sunday](https://images.unsplash.com/photo-1506878206813-92402b8ded23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxfHxDb21wdXRlciUyMEdyb25pbmdlbiUyQyUyME5ldGhlcmxhbmRzfGVufDB8fHx8MTY3OTk0MzA1OQ&ixlib=rb-4.0.3&q=80&w=1080)

*Photo by [Jantine Doornbos](https://unsplash.com/@jantined?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

* * *

## Introduction

There are numerous solutions available for building on Web3, each with their own unique advantages and limitations, but most are often related to connecting wallets and executing transactions. However, if you are a frontend JavaScript developer looking to build on the decentralized web, you may have found that the development experience can be quite different from the familiar world of Web2.

That’s why [Juno](https://juno.build) takes a different approach, aiming to harness the power of Web3 without sacrificing the ease and familiarity of Web2 development.

In this blog post, we’ll explore how to combine React and Juno to develop a dApp. So, let’s dive in and discover how Juno can help you build powerful and user-friendly decentralized applications!

* * *

## How Juno Works

Juno is an open-source Blockchain-as-a-Service platform. It works just like traditional serverless platforms such as Google Firebase or AWS Amplify, but with one key difference: everything on Juno runs on the blockchain. This means that you get a fully decentralized and secure infrastructure for your applications, which is pretty cool if you ask me.

Behind the scenes, Juno uses the [Internet Computer](https://internetcomputer.org/) blockchain network and infrastructure to launch what we call a “Satellite” for each app you build. A Satellite is essentially a smart contract on steroids that contains your entire app. From its assets provided on the web (such as JavaScript, HTML, and image files) to its state saved in a super simple database, file storage, and authentication, each Satellite controlled solely by you contains everything it needs to run smoothly.

* * *

## Build Your First DApp

Let’s build our first dapp! In this example, we will create a simple note-taking app that allows users to store data entries, upload files, and retrieve them as needed.

* * *

### Initialization

Before you can integrate Juno into your ReactJS app, you’ll need to create a satellite. This process is explained in detail in the [documentation](https://juno.build/docs/add-juno-to-an-app/create-a-satellite).

> Juno is currently in closed beta 👀. Contact me on [Twitter](https://twitter.com/daviddalbusco) or fill this [form](https://jx5yt-yyaaa-aaaal-abzbq-cai.ic0.app/) to enter the waiting list.

Moreover, you also need to install the SDK.

```bash
npm i @junobuild/core
```

After completing both of these steps, you can initialize Juno with your satellite ID at the top of your React app. This will configure the library to communicate with your smart contract.

```javascript
import { initJuno } from "@junobuild/core";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "aaaaaa-bbbbb-ccccc-ddddd-cai"
      }))();
  }, []);

  return (
    <>
      <h1>Hello World</a>
    </>
  );
}

export default App;
```

That’s it for the configuration! Your app is now ready for Web3! 😎

* * *

### Authentication

To securely identify users **anonymously**, they will need to sign in and sign out. You can bind the related functions to call-to-actions anywhere in your app.

```javascript
import { signIn, signOut } from "@junobuild/core";

<button
  type="button"
  onClick={signIn}
>Login</button>

<button
  type="button"
  onClick={signOut}
>Logout</button>
```

To integrate tightly with other services, the library and satellite automatically create a new entry in your smart contract when a user successfully signs in. This enables the library to check permissions on any exchange of data.

To observe this entry and, by extension, get to know the user’s state, Juno provides an observable function called `authSubscribe()`. You can use it as many times as required, but I find it convenient to subscribe to it at the top of an app. This way, we can create a `Context` to propagate the user.

```javascript
import { createContext, useEffect, useState } from "react";
import { authSubscribe } from "@junobuild/core";

export const AuthContext = createContext();

export const Auth = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const sub = authSubscribe((user) => setUser(user));

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {user !== undefined && user !== null ? (
        <div>
          {children}
        </div>
      ) : (
        <p>Not signed in.</p>
      )}
    </AuthContext.Provider>
  );
};
```

Juno’s library is framework-agnostic and currently does not include any framework-specific code. However, we welcome contributions from the community. If you are interested in providing React plugins, contexts, hooks or else, feel free to contribute to the project! 💪

* * *

### Storing Documents

Storing data on the blockchain with Juno is done through a feature called “Datastore”. A datastore consists of a list of collections that contain your documents, each identified by a textual key that you define.

In this tutorial, our goal is to store notes. To achieve this, you will need to follow the instructions in the [documentation](https://juno.build/docs/build/datastore#collections-and-rules) to create a collection, which can be named accordingly (“notes”).

Once your app is set up and your collection is created, we can persist data on the blockchain using the `setDoc` function provided by the library.

```typescript
import { setDoc } from "@junobuild/core";

// TypeScript example from the documentation
await setDoc<Example>({
    collection: "my_collection_key",
    doc: {
        key: "my_document_key",
        data: myExample,
    },
});
```

Since the documents in the collection are identified by a unique key, we create keys using [nanoid](https://github.com/ai/nanoid) — a tiny string ID generator for JavaScript.

```javascript
import { useState } from "react";
import { setDoc } from "@junobuild/core";
import { nanoid } from "nanoid";

export const Example = () => {
  const [inputText, setInputText] = useState("");

  const add = async () => {
    await setDoc({
      collection: "data",
      doc: {
        key: nanoid(),
        data: {
          text: inputText,
        },
      },
    });
  };

  return (
    <>
      <textarea
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
      ></textarea>

      <button type="button" onClick={add}>
        Add
      </button>
    </>
  );
};
```

* * *

### Listing Documents

To fetch the list of documents saved on the blockchain, we can use the `listDocs` function provided by the library. This function can accept various parameters to filter, order, or paginate the data.

In this tutorial, we’ll keep the example minimal. We simply list all data of the users while observing the `Context` we declared previously. If a user is set, we fetch the data; if none, we reset the entries. This is possible because every time the user signs in or out, the state will automatically be reflected.

```javascript
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";
import { listDocs } from "@junobuild/core";

export const ListExample = () => {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);

  const list = async () => {
    const { items } = await listDocs({
      collection: "notes",
      filter: {},
    });

    setItems(items);
  };

  useEffect(() => {
    if ([undefined, null].includes(user)) {
      setItems([]);
      return;
    }

    (async () => await list())();
  }, [user]);

  return (
    <>
      {items.map(({ key, data: { text } }) => (
        <p key={key}>{text}</p>
      ))}
    </>
  );
};
```

* * *

### Uploading File

Storing data on the decentralized web isn’t always that easy. Fortunately, Juno is not one of those and is designed for app developers who need to store and serve user-generated content, such as photos or videos, with ease.

As for the documents, to upload assets you will need first to follow the instructions in the [documentation](https://juno.build/docs/build/storage#collections-and-rules) to create a collection. In this tutorial we will implement image uploads, so the collection can be named accordingly (“images”).

The stored data are identified with unique file names and paths. This is because the data are provided on the web and therefore each piece of data should match a unique URL.

To achieve this, we can create a key using a combination of the unique user’s ID in its textual representation and a timestamp for each file uploaded. We can get access the property we passed down through the `Context` in the previous chapter to retrieve the corresponding user’s key.

```javascript
import { useContext, useState } from "react";
import { AuthContext } from "./Auth";
import { uploadFile } from "@junobuild/core";

export const UploadExample = () => {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  const { user } = useContext(AuthContext);

  const add = async () => {
    const filename = `${user.key}-${file.name}`;

    const { downloadUrl } = await uploadFile({
      collection: "images",
      data: file,
      filename,
    });

    setImage(downloadUrl);
  };

  return (
    <>
      <input
        type="file"
        accept="image/png, image/gif, image/jpeg"
        onChange={(event) => setFile(event.target.files?.[0])}
      />

      <button type="button" onClick={add}>
        Add
      </button>

      {image !== undefined && <img src={image} loading="lazy" /> }
    </>
  );
};
```

Once an asset is uploaded, a `downloadUrl` is returned which provides a direct HTTPS link to access the uploaded asset on the web.

* * *

### Listing Assets

To fetch the list of assets saved on the blockchain, we can use the `listAssets` function provided by the library. This function can accept various parameters to filter, order, or paginate the files.

As for the documents previously, we’ll keep the example minimal. We simply list all assets of the users observing the `Context`.

```javascript
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";
import { listAssets } from "@junobuild/core";

export const ListAssetsExample = () => {
  const { user } = useContext(AuthContext);

  const [assets, setAssets] = useState([]);

  const list = async () => {
    const { assets } = await listAssets({
      collection: "images",
      filter: {},
    });

    setAssets(assets);
  };

  useEffect(() => {
    if ([undefined, null].includes(user)) {
      setAssets([]);
      return;
    }

    (async () => await list())();
  }, [user]);

  return (
    <>
      {assets.map(({ fullPath, downloadUrl }) => (
        <img key={fullPath} loading="lazy" src={downloadUrl} />
      ))}
    </>
  );
};
```

* * *

### Deployment 🚀

After you have developed and built your application, you can launch it on the blockchain. To do this, you will need to install the Juno [command line interface](https://juno.build/docs/miscellaneous/cli) by running the following command in your terminal:

```bash
npm i -g @junobuild/cli
```

Once the installation is complete, you can log in to your satellite from the terminal using the instructions in the [documentation](https://juno.build/docs/miscellaneous/cli#login). This will grant control of your machine to your satellite:

```bash
juno login
```

Finally, you can deploy your project using the following command:

```bash
juno deploy
```

Congratulations! Your app is now decentralized 🎉.

* * *

## Ressources

*   Juno documentation and getting started: [https://juno.build/docs/intro](https://juno.build/docs/intro)
*   Code source of this tutorial: [https://github.com/buildwithjuno/examples/tree/main/react/diary](https://github.com/buildwithjuno/examples/tree/main/react/diary)
*   The outcome of this article: [https://pycrs-xiaaa-aaaal-ab6la-cai.icp0.io/](https://pycrs-xiaaa-aaaal-ab6la-cai.icp0.io/)

> Juno is currently in closed beta 👀. Contact me on [Twitter](https://twitter.com/daviddalbusco) or fill this [form](https://jx5yt-yyaaa-aaaal-abzbq-cai.ic0.app/) to enter the waiting list.
