---
path: "/blog/build-a-web3-app-with-vuejs"
date: "2023-05-24"
title: "Build a Web3 App with VueJS"
description: "Empower your dapp development: Unleashing Vue and Juno for Web3 decentralized applications."
tags: "#vue #web3 #blockchain #programming"
image: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
canonical: "https://juno.build/blog/build-a-web3-app-with-vuejs"
---

## Introduction

As a frontend JavaScript developer stepping into the decentralized web, you may have encountered numerous solutions for Web3 development. However, these solutions often focus on wallet integration and transaction execution, creating a learning curve and deviating from the familiar Web2 development experience.

But fear not! There's a solution that bridges the gap between Web2 and Web3 seamlessly - [Juno](https://juno.build).

In this blog post, we will explore how to leverage the power of Vue and Juno to develop decentralized applications (dApps). By combining these technologies, you'll discover a user-friendly and efficient approach to building powerful dApps that harness the potential of Web3. Join us on this journey as we unveil the secrets of Juno and empower you to create remarkable decentralized experiences with ease!

---

## Foreword

In my previous blog posts, I discussed similar solutions for [React](https://juno.build/blog/build-a-web3-app-with-react-js) and [Angular](https://juno.build/blog/develop-an-angular-app-on-blockchain), two popular JavaScript frontend frameworks. If either of these frameworks is your preferred choice, I encourage you to explore those specific posts for tailored insights.

---

## How Juno Works

If you're not yet acquainted with Juno, it's a powerful open-source Blockchain-as-a-Service platform designed to make decentralized application development more accessible. Think of it as a serverless platform, similar to popular services like Google Firebase or AWS Amplify, but with the added advantage of blockchain technology. Juno takes care of everything by running your applications entirely on the blockchain, ensuring a fully decentralized and secure infrastructure.

By leveraging the [Internet Computer](https://internetcomputer.org/) blockchain network and infrastructure, Juno introduces a unique concept called "Satellites" for each app you create. These Satellites act as robust smart contracts that encapsulate your entire application, including web assets like JavaScript, HTML, and image files, as well as a simple database, file storage, and authentication mechanisms. With Juno, you have complete control over your app's functionality and data.

---

## Build A Dapp

Let's start building our first decentralized application, or "dapp" for short. In this example, we will create a note-taking app that allows users to store and retrieve data entries, as well as upload files.

---

### Introduction

This tutorial and code sample utilize the Vue Composition API.

---

### Initialization

Before you can integrate Juno into your app, you'll need to create a satellite. This process is explained in detail in the [documentation](https://juno.build/docs/add-juno-to-an-app/create-a-satellite).

Moreover, you also need to install the SDK.

```bash
npm i @junobuild/core
```

After completing both of these steps, you can initialize Juno with your satellite ID at the root of your Vue app, for example in `App.vue`. This will configure the library to communicate with your smart contract.

```html
<script setup lang="ts">
	import { onMounted } from "vue";
	import { initJuno } from "@junobuild/core";

	onMounted(
		async () =>
			await initJuno({
				satelliteId: "pycrs-xiaaa-aaaal-ab6la-cai"
			})
	);
</script>

<template>
	<h1>Hello World</h1>
</template>
```

That's it for the configuration! Your app is now ready for Web3! 😎

---

### Authentication

In order to ensure secure and anonymous user identification, it is necessary for users to sign in and sign out. To accomplish this, you can bind the relevant functions to call-to-action buttons placed anywhere within your application.

```html
<script setup lang="ts">
	import { signIn, signOut } from "@junobuild/core";
</script>

<button @click="signIn">Sign-in</button>
<button @click="signOut">Sign-out</button>
```

In order to establish seamless integration with other services, the library and satellite components automatically generate a new entry within your smart contract upon successful user sign-in. This functionality empowers the library to efficiently verify permissions during any data exchange.

To monitor and gain insights into this entry, and consequently access information about the user's state, Juno offers an observable function called `authSubscribe()`. You have the flexibility to utilize this function as many times as necessary. However, you can also create a store that effectively propagates the user information throughout your app.

```typescript
import { authSubscribe, type User } from "@junobuild/core";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
	const user: Ref<User | null | undefined> = ref(undefined);

	const unsubscribe = authSubscribe((u) => (user.value = u));

	return { user, unsubscribe };
});
```

By doing so, it becomes convenient to subscribe to it at the top level of your application.

```html
<script setup lang="ts">
	import { useAuthStore } from "../stores/auth.store";
	import { storeToRefs } from "pinia";

	const store = useAuthStore();
	const { user } = storeToRefs(store);
</script>

<template>
	<template v-if="user !== undefined && user !== null">
		<slot />
	</template>

	<template v-else>
		<p>Not signed in.</p>
	</template>
</template>
```

---

### Storing Documents

Juno presents a feature called "Datastore" designed for storing data directly on the blockchain. A Datastore comprises a set of collections, where each collection holds documents, uniquely identified by a key of your choice.

In this tutorial, our objective is to store notes, so it is essential to create a collection in accordance with the instructions provided in the documentation. Choose an appropriate name for the collection, such as "notes."

Once you have set up your application and created the necessary collection, you can utilize the library's `setDoc` function to persist data onto the blockchain. This function enables you to store your notes securely and immutably.

```typescript
import { setDoc } from "@junobuild/core";

// TypeScript example from the documentation
await setDoc<Example>({
	collection: "my_collection_key",
	doc: {
		key: "my_document_key",
		data: myExample
	}
});
```

Since the documents in the collection are identified by a unique key, we create keys using [nanoid](https://github.com/ai/nanoid) - a tiny string ID generator for JavaScript.

```html
<script lang="ts" setup>
	import { ref } from "vue";
	import { setDoc } from "@junobuild/core";
	import { nanoid } from "nanoid";

	const inputText = ref("");

	const add = async () => {
		const key = nanoid();

		await setDoc({
			collection: "notes",
			doc: {
				key,
				data: {
					text: inputText.value
				}
			}
		});
	};
</script>

<template>
	<textarea rows="5" placeholder="Your diary entry" v-model="inputText"></textarea>

	<button @click="add">Add</button>
</template>
```

_Please note that for the sake of simplicity, the code snippets provided in this tutorial do not include proper error handling nor complex form handling._

---

### Listing Documents

In order to retrieve the collection of documents stored on the blockchain, we can utilize the library's `listDocs` function. This versatile function allows for the inclusion of various parameters to facilitate data filtering, ordering, or pagination.

For the purpose of this tutorial, we will keep the example minimalistic. Our objective is to simply list all user data when a component is mounted.

```html
<script lang="ts" setup>
	import { listDocs } from "@junobuild/core";
	import { onMounted, ref } from "vue";

	const items = ref([]);

	const list = async () => {
		const { items: data } = await listDocs({
			collection: "notes"
		});

		items.value = data;
	};

	onMounted(async () => await list());
</script>

<template>
	<p v-for="(item, index) in items">
		<span> {{ index + 1 }} </span>
		<span>{{ item.data.text }}</span>
	</p>
</template>
```

---

### Uploading File

Storing data on the decentralized web can be a complex task. However, Juno is designed to simplify this process for app developers who require easy storage and retrieval of user-generated content, such as photos or files.

When it comes to handling documents, the first step is to create a collection by following the instructions provided in the [documentation](https://juno.build/docs/build/storage#collections-and-rules). In this tutorial, we will focus on implementing image uploads, so the collection can be appropriately named as "images."

To ensure uniqueness and proper identification of stored data, each file is assigned a unique file name and path. This is essential because the data is served on the web, and each piece of data should have a distinct URL.

To accomplish this, we can create a key using a combination of the user's unique ID in its textual representation and a timestamp for each uploaded file. By accessing the property we previously declared in a store, we can retrieve the corresponding user's key.

```html
<script lang="ts" setup>
	import { ref } from "vue";
	import { useAuthStore } from "@/stores/auth.store";
	import { storeToRefs } from "pinia";
	import { uploadFile } from "@junobuild/core";

	const file = ref(undefined);

	const store = useAuthStore();
	const { user } = storeToRefs(store);

	const setFile = (f) => (file.value = f);

	const upload = async () => {
		// Demo purpose therefore edge case not properly handled
		if ([null, undefined].includes(user.value)) {
			return;
		}

		const filename = `${user.value.key}-${file.value.name}`;

		const { downloadUrl } = await uploadFile({
			collection: "images",
			data: file.value,
			filename
		});

		console.log("Uploaded", downloadUrl);
	};
</script>

<template>
	<input type="file" @change="(event) => setFile(event.target.files?.[0])" />

	<button @click="upload">Upload</button>
</template>
```

Once an asset is uploaded, a `downloadUrl` is returned which provides a direct HTTPS link to access the uploaded asset on the web.

---

### Listing Assets

To retrieve the collection of assets stored on the blockchain, we can utilize the `listAssets` function provided by the library. This function offers flexibility in terms of parameters, allowing us to filter, order, or paginate the files as needed.

Similar to the previous example with documents, we will keep this example minimalistic.

```html
<script lang="ts" setup>
	import { listAssets } from "@junobuild/core";
	import { onMounted, ref } from "vue";

	const assets = ref([]);

	const list = async () => {
		const { assets: images } = await listAssets({
			collection: "images"
		});

		assets.value = images;
	};

	onMounted(async () => await list());
</script>

<template>
	<img loading="lazy" :src="asset.downloadUrl" v-for="asset in assets" />
</template>
```

---

### Deployment 🚀

After you have developed and built your application, the next step is to deploy it on the blockchain. To do this, you need to install the Juno [command line interface (CLI)](https://juno.build/docs/miscellaneous/cli) by executing the following command in your terminal:

```bash
npm i -g @junobuild/cli
```

After the installation process is finished, you can gain access to your satellite by following the instructions in the [documentation](https://juno.build/docs/miscellaneous/cli#login) and logging in from the terminal. This will enable your machine to control your satellite.

```bash
juno login
```

Finally, you can deploy your project using the following command:

```bash
juno deploy
```

Congratulations! Your Vue dapp is now live and fully powered by the blockchain 🎉.

---

## Resources

- Juno documentation and getting started: [https://juno.build/docs/intro](https://juno.build/docs/intro)
- The source code of this tutorial is available in our [GitHub Repository](https://github.com/junobuild/examples/tree/main/vue/diary).

To infinity and beyond
David
