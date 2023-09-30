---
path: "/blog/develop-an-angular-app-on-blockchain"
date: "2023-04-21"
title: "Develop An Angular App On Blockchain"
description: "How to create a Web3 decentralized application using Angular and Juno."
tags: "#angular #web3 #blockchain #programming"
image: "https://images.unsplash.com/photo-1514428631868-a400b561ff44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyfHxjb21wdXRlciUyMGFuZ3VsYXJ8ZW58MHx8fHwxNjgyMDgwMTI3&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://juno.build/blog/develop-an-angular-app-on-blockchain"
---

![Macbook Pro](https://images.unsplash.com/photo-1514428631868-a400b561ff44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyfHxjb21wdXRlciUyMGFuZ3VsYXJ8ZW58MHx8fHwxNjgyMDgwMTI3&ixlib=rb-4.0.3&q=80&w=1080)

_Photo by [Maxwell Nelson](https://unsplash.com/fr/@maxcodes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/taiuG8CPKAQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

## Introduction

There are various Web3 development solutions with unique advantages and limitations. If you are a frontend JavaScript developer seeking to build on the decentralized web, you may find it challenging to navigate. Fortunately, [Juno](https://juno.build) provides a unique approach that combines Web3 power with the ease and familiarity of Web2 development.

After exploring how to combine React and Juno to develop a dApp in a previous [blog post](https://juno.build/blog/build-a-web3-app-with-react-js), we are now going to take a look at how to develop an Angular app on blockchain.

So, let’s dive in and discover how you can build powerful and user-friendly decentralized applications with Angular!

---

## How Juno Works

If you’re not familiar with Juno, it’s an open-source Blockchain-as-a-Service platform that enables you to build decentralized applications with ease. Think of it as a serverless platform, like Google Firebase or AWS Amplify, but with the added benefits of blockchain technology. With Juno, everything runs on the blockchain, providing a fully decentralized and secure infrastructure for your applications.

Juno leverages the [Internet Computer](https://internetcomputer.org/) blockchain network and infrastructure to launch a “Satellite” for each app you build, essentially a powerful smart contract that contains your entire app. From the assets provided on the web, such as JavaScript, HTML, and image files, to its state saved in a super simple database, file storage, and authentication, each Satellite is controlled solely by you and contains everything it needs to run smoothly.

---

## Build Your First Dapp

Let’s start building our first decentralized application, or “dapp” for short. In this example, we’ll be creating a note-taking app that enables users to store and retrieve data entries, as well as upload files.

---

### Initialization

Before you can integrate Juno into your Angular app, you’ll need to create a satellite. This process is explained in detail in the [documentation](https://juno.build/docs/add-juno-to-an-app/create-a-satellite).

Moreover, you also need to install the SDK.

```bash
npm i @junobuild/core
```

After completing both of these steps, you can initialize Juno with your satellite ID in the main component of your Angular app. This will configure the library to communicate with your smart contract.

```typescript
import { Component, OnInit } from "@angular/core";
import { initJuno } from "@junobuild/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
	async ngOnInit() {
		await initJuno({
			satelliteId: "pycrs-xiaaa-aaaal-ab6la-cai"
		});
	}
}
```

That’s it for the configuration! Your app is now ready for Web3! 😎

---

### Authentication

To enable secure and **anonymous** user identification, users will need to sign in and sign out. You can bind the corresponding functions to call-to-action buttons anywhere in your app.

```typescript
import { Component } from "@angular/core";
import { signIn, signOut } from "@junobuild/core";

@Component({
	selector: "app-demo",
	template: `<button (click)="signIn()">Sign-in</button>
		<button (click)="signOut()">Sign-out</button>`,
	standalone: true
})
export class DemoComponent {
	readonly signOut = signOut;
	readonly signIn = signIn;
}
```

To integrate tightly with other services, the library and satellite automatically create a new entry in your smart contract when a user successfully signs in. This enables the library to check permissions on any exchange of data.

To observe this entry and, consequently, understand the user’s state, Juno offers an observable function called `authSubscribe()`. You can use this function as many times as needed, but it’s convenient to create a service that provides the information. This way, you can derive RxJS `Observable` to propagate the user.

```typescript
import { Injectable } from "@angular/core";
import { authSubscribe, User } from "@junobuild/core";
import { map, Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	readonly user$: Observable<User | null> = new Observable((observer) =>
		authSubscribe((user) => observer.next(user))
	);

	readonly signedIn$: Observable<boolean> = this.user$.pipe(map((user) => user !== null));
}
```

Juno’s library is designed to be framework-agnostic and currently doesn’t include any framework-specific code. However, we encourage contributions from the community, and if you’re interested in providing Angular bindings, we welcome your contributions to the project! 💪

---

### Storing Documents

Juno offers a feature called “Datastore” for storing data on the blockchain. A Datastore consists of a list of collections that hold your documents, each identified by a key that you define.

In this tutorial, we aim to store notes, so you’ll need to create a collection following the instructions in the [documentation](https://juno.build/docs/build/datastore#collections-and-rules) and name it accordingly (e.g., “notes”).

After setting up your app and creating the collection, you can use the `setDoc` function provided by the library to persist data on the blockchain.

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

Since the documents in the collection are identified by a unique key, we create keys using [nanoid](https://github.com/ai/nanoid) — a tiny string ID generator for JavaScript.

```typescript
import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { setDoc } from "@junobuild/core";
import { nanoid } from "nanoid";
import { Entry } from "../../types/entry";

@Component({
	selector: "app-input",
	template: ` <form (ngSubmit)="onSubmit()" [formGroup]="entryForm">
		<textarea formControlName="entry"></textarea>

		<button [disabled]="entryForm.disabled">Submit</button>
	</form>`,
	standalone: true,
	imports: [ReactiveFormsModule]
})
export class InputComponent {
	entryForm = this.formBuilder.group({
		entry: ""
	});

	constructor(private formBuilder: FormBuilder) {}

	async onSubmit() {
		await this.save();
	}

	private async save() {
		const key = nanoid();

		await setDoc<Entry>({
			collection: "notes",
			doc: {
				key,
				data: {
					text: this.entryForm.value.entry
				}
			}
		});
	}
}
```

_Please note that for the sake of simplicity, the code snippets provided in this tutorial do not include proper error handling nor complex form handling._

In the above code snippet, we are persisting an object called “entries” to the blockchain. For the purposes of this tutorial, we have declared the type of the object in our frontend code as “Entry”. The documents are persisted on the blockchain as blobs, which means that you can persist any structure that can be serialized.

```typescript
export interface Entry {
	text: string;
	url?: string;
}
```

---

### Listing Documents

To retrieve the list of documents saved on the blockchain, we can use the `listDocs` function provided by the library. This function can accept various parameters to filter, order, or paginate the data.

In this tutorial, we simply list all data of the users while observing the authentication state with the service we declared previously. If a user is set, we fetch the data; if none, we reset the entries. This is possible because every time the user signs in or out, the state will automatically be reflected.

In addition, we create also a dedicated service to keep the data in memory for reusability purposes. This service includes a reload function, which can be useful to reload the data as needed.

```typescript
import { Inject, Injectable } from "@angular/core";
import type { Doc } from "@junobuild/core";
import { listDocs } from "@junobuild/core";
import type { Observable } from "rxjs";
import { Subject, combineLatest, from, map, of, shareReplay, startWith, switchMap } from "rxjs";
import type { Entry } from "../types/entry";
import { AuthService } from "./auth.service";

@Injectable({
	providedIn: "root"
})
export class DocsService {
	private reloadSubject = new Subject<void>();

	docs$: Observable<Doc<Entry>[]> = combineLatest([
		this.authService.user$,
		this.reloadSubject.pipe(startWith(undefined))
	]).pipe(
		switchMap(([user, _]) => {
			if (user === null) {
				return of([]);
			}

			return from(
				listDocs<Entry>({
					collection: "notes",
					filter: {}
				})
			).pipe(map(({ items }) => items));
		}),
		startWith([]),
		shareReplay({ bufferSize: 1, refCount: true })
	);

	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	reload() {
		this.reloadSubject.next();
	}
}
```

For display purposes, we can subscribe to the asynchronous stream as we would with any observable.

```typescript
import { Component, Inject } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { type Doc } from "@junobuild/core";
import { Observable } from "rxjs";
import { DocsService } from "../../services/docs.service";
import type { Entry } from "../../types/entry";

@Component({
	selector: "app-list",
	template: `<p *ngFor="let doc of docs$ | async">{{ doc.key }}: {{ doc.data.text }}</p>`,
	imports: [BrowserModule],
	standalone: true
})
export class ListComponent {
	readonly docs$: Observable<Doc<Entry>[]> = this.docsService.docs$;

	constructor(@Inject(DocsService) private readonly docsService: DocsService) {}
}
```

---

### Uploading File

Storing user-generated content on Web3 can be a challenge, but Juno makes it easy for app developers. It’s designed to enable the storage and serving of assets such as photos or videos effortlessly.

To upload files, you’ll need to create a collection by following the instructions in the [documentation](https://juno.build/docs/build/storage#collections-and-rules). In this tutorial, we’ll focus on image uploads, so the collection should be named “images.”

Each file stored on the blockchain is identified by a unique filename and path that corresponds to a unique URL. To accomplish this, we create a key using a combination of the user’s unique ID in text form and a timestamp for each uploaded file. We can retrieve the corresponding user’s key by accessing the observable of the authentication service we declared in previous chapter.

```typescript
import { Component, Inject } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AssetKey, User, uploadFile } from "@junobuild/core";
import { filter, from, switchMap, take } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
	selector: "app-upload",
	template: `
		<input type="file" accept="image/png, image/gif, image/jpeg" (change)="onFileChanged($event)" />

		<img *ngIf="downloadUrl !== undefined" [src]="downloadUrl" loading="lazy" />

		<button (click)="add()">Upload</button>
	`,
	standalone: true,
	imports: [BrowserModule]
})
export class UploadComponent {
	private file: File | undefined;

	downloadUrl: string | undefined;

	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	add() {
		this.authService.user$
			.pipe(
				filter((user) => user !== null),
				switchMap((user) => from(this.upload(user as User))),
				take(1)
			)
			.subscribe(({ downloadUrl }) => {
				this.downloadUrl = downloadUrl;
			});
	}

	onFileChanged($event: Event) {
		const target = $event.target as HTMLInputElement;
		this.file = target.files?.[0];
	}

	private async upload(user: User): Promise<AssetKey> {
		const filename = `${user.key}-${this.file.name}`;

		return uploadFile({
			collection: "images",
			data: this.file,
			filename
		});
	}
}
```

Once an asset is uploaded, a `downloadUrl` is returned which provides a direct HTTPS link to access the uploaded asset on the web.

---

### Listing Assets

To fetch the list of assets saved on the blockchain, we can use the `listAssets` function provided by the library. This function can accept various parameters to filter, order, or paginate the files.

Similar to the documents, we can create a service that converts the list into an observable.

```typescript
import { Inject, Injectable } from "@angular/core";
import type { Assets } from "@junobuild/core";
import { listAssets } from "@junobuild/core";
import type { Observable } from "rxjs";
import { Subject, combineLatest, from, map, of, shareReplay, startWith, switchMap } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
	providedIn: "root"
})
export class AssetsService {
	private reloadSubject = new Subject<void>();

	assets$: Observable<Assets[]> = combineLatest([
		this.authService.user$,
		this.reloadSubject.pipe(startWith(undefined))
	]).pipe(
		switchMap(([user, _]) => {
			if (user === null) {
				return of([]);
			}

			return from(
				listAssets({
					collection: "images",
					filter: {}
				})
			).pipe(map(({ assets }) => assets));
		}),
		startWith([]),
		shareReplay({ bufferSize: 1, refCount: true })
	);

	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	reload() {
		this.reloadSubject.next();
	}
}
```

For display purposes, we also subscribe to the asynchronous stream as we would with any observable.

```typescript
import { Component, Inject } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Asset } from "@junobuild/core";
import { Observable } from "rxjs";
import { AssetsService } from "../../services/assets.service";

@Component({
	selector: "app-assets",
	template: `<img
		*ngFor="let asset of assets$ | async"
		[src]="asset.downloadUrl"
		loading="lazy"
	/>`,
	imports: [BrowserModule],
	standalone: true
})
export class AssetsComponent {
	readonly assets$: Observable<Asset[]> = this.assetsService.assets$;

	constructor(@Inject(AssetsService) private readonly assetsService: AssetsService) {}
}
```

---

### Deployment 🚀

Once your application is developed and built, the next step is to launch it on the blockchain. To accomplish this, you must install the Juno [command line interface](https://juno.build/docs/miscellaneous/cli) by executing the following command in your terminal:

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

Congratulations! Your Angular app is now decentralized 🎉.

---

## Resources

- Juno documentation and getting started: [https://juno.build/docs/intro](https://juno.build/docs/intro)
- The source code of this tutorial is available in our [GitHub Repository](https://github.com/buildwithjuno/examples/tree/main/angular/diary).

To infinity and beyond
David
