---
path: "/blog/deploy-internet-identity-locally"
date: "2022-11-27"
title: "Deploy Internet Identity locally"
description: "How to deploy the blockchain authentication system for the Internet Computer locally."
tags: "#blockchain #programming #webdevelopment #technology"
image: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/social-image.png?token=_XQlT4y9g-gN2mZh9g8Iz"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/deploy-internet-identity-locally"
---

![social-image.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/social-image.png?token=_XQlT4y9g-gN2mZh9g8Iz)

*Image source: [DFINITY foundation](https://dfinity.org/)*

So, you are looking to deploy [Internet Identity](https://identity.ic0.app/) (II) locally?

Here are my four easiest solution to do so!

* * *

## Introduction

To deploy II locally, we need to get its canister (Wasm module). We can either build the code ourself, using Docker and the [docker-build](https://github.com/dfinity/internet-identity/blob/main/scripts/docker-build) script provided by the II team, or download an existing [release](https://github.com/dfinity/internet-identity/releases).

As I really dislike doing anything Devops related myself and, also because the goal of this tutorial is to make things happen fast, the following solutions are using the pre-build/released wasm (the above second option).

The first two options are applicable for any dapps, the last two are more useful if you start a new project.

* * *

## 1. Automatic Installation

It's a bit verbose - or hacky depends the point of view - but it is possible to setup II for a project in `dfx` with a `custom` canister. By doing so, we can leverage the `build` callback to download and install II automatically.

So, just drop the following configuration in your project and that's already it.

```javascript
{
	"canisters": {

        ...

          "internet_identity": {
			"type": "custom",
			"candid": "internet_identity.did",
			"wasm": "internet_identity.wasm",
			"build": "bash -c 'test -f internet_identity.wasm || curl -sSL https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm -o internet_identity.wasm; test -f internet_identity.did || curl -sSL https://raw.githubusercontent.com/dfinity/internet-identity/main/src/internet_identity/internet_identity.did -o internet_identity.did'",
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

You might also want to skip committing the `.did` and `.wasm` files - that are going to be automatically downloaded - by omitting these in your `.gitignore`.

```javascript
internet_identity.wasm
internet_identity.did
```

* * *

## 2. Manual Installation

If you prefer to not touch any configuration of your project, it is possible to deploy II locally manually as well. e.g. that's the strategy I personally use when I deploy [Papyrs](https://papy.rs).

Anywhere on your computer, while `dfx start` has been started in your project, run following command lines and that's already it too.

```bash
git clone https://github.com/dfinity/internet-identity
cd internet-identity/demos/using-dev-build
npm ci
dfx deploy --no-wallet --argument '(null)'
```

* * *

## 3. New dapp

If you start from scratch or looking to create a sample dapp, instead of initializing a new project with `dfx`, I recommend you to use the `npm` CLI (I have created). It prompts you interactively for options and setup everything for you including II.

```bash
npm init ic
```

* * *

## 4. Game Changer

I am working on a new secret side project that aims to reduce the gap for web2 developer on the IC early 2023 (🤯). Join my [newsletter](http://eepurl.com/giun5j) to keep hearing about it or reach me out on [Twitter](https://twitter.com/daviddalbusco) to get to know more!

To infinity and beyond  
David
