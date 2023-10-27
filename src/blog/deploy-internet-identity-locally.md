---
path: "/blog/deploy-internet-identity-locally"
date: "2022-11-27"
title: "Deploy Internet Identity locally"
description: "How to deploy the blockchain authentication system for the Internet Computer locally."
tags: "#blockchain #programming #webdevelopment #technology"
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*E9xLy3n5oiiTp91mKI6TfA.png"
canonical: "https://daviddalbusco.medium.com/deploy-internet-identity-locally-8a0ac2c891eb"
---

![social-image.png](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*E9xLy3n5oiiTp91mKI6TfA.png)

_Image source: [DFINITY foundation](https://dfinity.org/)_

So, you are looking to deploy [Internet Identity](https://identity.ic0.app/) (II) locally?

Here are my four easiest solution to do so!

---

## Introduction

To deploy II locally, we need to get its canister (Wasm module). We can either build the code ourself, using Docker and the [docker-build](https://github.com/dfinity/internet-identity/blob/main/scripts/docker-build) script provided by the II team, or download an existing [release](https://github.com/dfinity/internet-identity/releases).

As I really dislike doing anything Devops related myself and, also because the goal of this tutorial is to make things happen fast, the following solutions are using the pre-build/released wasm (the above second option).

The first two options are applicable for any dapps, the last two are more useful if you start a new project.

---

## 1. Automatic Installation

It is possible to set up II for a project with `dfx` >= 0.12.0 using a `custom` canister.

So, just drop the following configuration in your project and that's already it.

```bash
{
	"canisters": {

        ...

          "internet_identity": {
			"type": "custom",
            "candid": "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity.did",
            "wasm": "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz",
            "shrink": false,
			"remote": {
				"candid": "internet_identity.did",
				"id": {
					"ic": "rdmx6-jaaaa-aaaaa-aaadq-cai"
				}
			}
		  }
	},

    ...

}
```

Using `dfx` < v0.12.0, it's a bit more verbose - or hacky depends the point of view - but we can also leverage the `build` callback to download and install II automatically.

```javascript
{
	"canisters": {

        ...

          "internet_identity": {
			"type": "custom",
			"candid": "internet_identity.did",
			"wasm": "internet_identity.wasm.gz",
			"build": "bash -c 'test -f internet_identity.wasm.gz || curl -sSL https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz -o internet_identity.wasm.gz; test -f internet_identity.did || curl -sSL https://raw.githubusercontent.com/dfinity/internet-identity/main/src/internet_identity/internet_identity.did -o internet_identity.did'",
			"remote": {
				"candid": "internet_identity.did",
				"id": {
					"ic": "rdmx6-jaaaa-aaaaa-aaadq-cai"
				}
			}
		  }
	},

    ...

}
```

As we only want to deploy II locally, it is worth to note that above config contains a `remote` option that points to II on mainnet. Thanks to it, the wasm won't be deployed when we deploy our canisters to mainnet.

You might also want to skip committing the `.did` and `.wasm.gz` files - that are going to be automatically downloaded - by omitting these in your `.gitignore`.

```javascript
internet_identity.wasm.gz;
internet_identity.did;
```

---

## 2. Manual Installation

If you prefer to not touch any configuration of your project, it is possible to deploy II locally manually as well. e.g. that's the strategy I personally use when I deploy [Papyrs](https://papy.rs).

Anywhere on your computer, while `dfx start` has been started in your project, run following command lines and that's already it too.

```bash
git clone https://github.com/dfinity/internet-identity
cd internet-identity/demos/using-dev-build
npm ci
dfx deploy --no-wallet --argument '(null)'
```

---

## 3. New dapp

If you start from scratch or looking to create a sample dapp, instead of initializing a new project with `dfx`, I recommend you to use the `npm` CLI (I have created). It prompts you interactively for options and setup everything for you including II.

```bash
npm init ic
```

---

## 4. Game Changer

I am working on a new secret side project that aims to reduce the gap for web2 developer on the IC early 2023 (🤯). Join my [newsletter](http://eepurl.com/giun5j) to keep hearing about it or reach me out on [Twitter](https://twitter.com/daviddalbusco) to get to know more!

To infinity and beyond  
David
