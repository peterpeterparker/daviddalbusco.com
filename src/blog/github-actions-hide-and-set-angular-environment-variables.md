---
path: "/blog/github-actions-hide-and-set-angular-environment-variables"
date: "2020-04-11"
title: "GitHub Actions: Hide And Set Angular Environment Variables"
description: "How to hide Angular environments variables from your repo and set these at build time while using GitHubActions"
tags: "#angular #devops #github #javascript"
image: "https://cdn-images-1.medium.com/max/1600/1*D8K_z16GbcE3t3YqgvPbEQ.png"
canonical: "https://medium.com/@david.dalbusco/github-actions-hide-and-set-angular-environment-variables-e753d06d16a8"
---

![](https://cdn-images-1.medium.com/max/1600/1*D8K_z16GbcE3t3YqgvPbEQ.png)

*Photo by [jae bano](https://unsplash.com/@jae462?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Eight** days left until this first milestone. Hopefully better days are ahead.

*****

Yesterday I suddenly remembered that I still had to create a [GitHub Actions](https://github.com/features/actions) to build and deploy the editor of our project [DeckDeckGo](https://deckdeckgo.com).

Even though most of the integrations are already automated, this feature is still on my Todo list because I will have to obfuscate some production tokens before being able to properly finish this task.

When I thought about it, I asked my self if I actually had not already solved such feature in another project recently? Guess what, indeed I have 😉, but in an [Angular](https://angular.io) prototype. A small project I developed for my self in order to help me find a flat in Zürich a couple of weeks ago ([Watamato](https://watamato.com) if interested, check it out).

That’s why I am sharing with you today this new tricks.

*****

### Concept

Angular, out of the box, let us handle environments variables thanks to the property `fileReplacements` of our `angular.json` . Per default, most probably, your project contains two files, an `environment.ts` and another one for your productive build, `environment.prod.ts` .

The idea is the following: In `environment.prod.ts` we are going to define keys without any values, allowing us to push these in our public [GitHub](https://github.com) repo safely. Then, with the help of system variables, set these before build within our GitHub Actions.

*****

### Setup Environment.ts

To begin with, let’s setup first our `environment.ts` files. Our goal is to obfuscate a token, let’s say for example that we want to hide our [Firebase](https://firebase.google.com) Api key.

Not really related to the solution but let’s say a goodie, we also inject the `version` and `name` of our application in your configuration. Note that this requires the activation of the compiler options `resolveJsonModule` to `true` in your `tsconfig.json.` 

Our `environment.ts` :

```javascript
import {name, version} from '../../package.json';

export const environment = {
  production: false,
  firebase: {
    apiKey: 'the-key-you-can-expose',
  },
  name,
  version
};
```

And our `environment.prod.ts` which contains `'undefined'` for the hidden value. The reason behind this being a string is the fact that our upcoming parser is going to inject such value if the key is not defined at build time.

```javascript
export const environment = {
   production: true,
   firebase: {
        apiKey: 'undefined'
    },
    name: 'enviro-replace',
    version: '0.0.1'
};
```

*****

#### Hide Development Variables

In the previous setting, I amend the fact that we are agree to expose our key in our development configuration, but you might also want to hide it. In such case, what I recommend, is extracting the values in a separate local file which you explicitly ignore in your `.gitignore`.

For example, let’s say we create a new file `firebase.environment.ts` in which we move our configuration and which add to the list of Git ignored files.

```javascript
export const firebase = {
    firebase: {
        apiKey: 'the-key-you-can-expose',
    }
};
```

Then we can update our `environment.ts` as following:

```javascript
import {firebase} from './firebase.environment';

import {name, version} from '../../package.json';

export const environment = {
  production: false,
  ...firebase,
  name,
  version
};
```

*****

### Update Variables Before Build

Our productive environment contains at this point an hidden value `'undefined'` which we have to replace before building our application.

For such purpose we can use the “magic file” described in the [article](https://medium.com/@ferie/how-to-pass-environment-variables-at-building-time-in-an-angular-application-using-env-files-4ae1a80383c) of [Riccardo Andreatta](https://twitter.com/Ferie80) 👍.

We create a new script `./config.index.ts` . Basically what it does is overwriting our `environment.prod.ts` file with new values and notably these we are going to define in your environment or GiHub Actions secret store.

In this parser we notice two interesting things:

1. It contains the environment variables too. That means that if you would add a new key to your configuration, you will have to update the script too.
2. We are using the environment process `process.env.FIREBASE_API_KEY` to inject a value we would path from our environment or from GitHub Actions to overwrite the environment with the effective key we were looking to hide.

```javascript
import {writeFile} from 'fs';

import {name, version} from '../package.json';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
   production: true,
   firebase: {
        apiKey: '${process.env.FIREBASE_API_KEY}'
    },
    name: '${name}',
    version: '${version}'
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
```

Finally we can add the execution of the script to our `package.json` :

```json
"scripts": {
  "config": 
     "ts-node -O '{\"module\": \"commonjs\"}' ./config.index.ts",
  "build": "npm run config && ng build --prod",
}
```

*****

### Testing

We are all set, we can now give it a try. Let’s first run a build without doing anything.

![](https://cdn-images-1.medium.com/max/1600/1*JMobhDqd7gnda8JQ1etzQw.png)

As you can notice, our `apiKey` remains equals to `'undefined'` and therefor not valid for our build.

Let’s now try to define an environment variable (`export FIREBASE_API_KEY="this is my prod key"`) and run our build again.

![](https://cdn-images-1.medium.com/max/1600/1*BU5qNiYe0mr3JcjdUHc9bQ.png)

Tada, our environment variable has been set and use for our build  🎉.

At this point you may ask yourself “yes but David, if we do so, then each time we run a build our `environment.prod.ts` file is going to be modified”. To which I would answer “yes you are right … but our goal is to automate the build with a GitHub Actions in order to not run productive build locally anymore, therefore the modification is not that a problem for our daily workflow 😇”.

*****

### GitHub Actions

The very final piece, the automation with GitHub Actions.

I am not going to cover how is it possible to create such script, [Julien Renaux](https://twitter.com/julienrenaux) covers well the subject in one of his [blog post](https://julienrenaux.fr/2019/11/25/building-deploying-stenciljs-apps-firebase-hosting-github-actions/) or alternatively you can check out of my Angular related [app.yml](https://github.com/peterpeterparker/watamato/blob/master/.github/workflows/app.yml) GitHub actions.

I assume that your script is ready and that you have defined a `FIREBASE_API_KEY` in your repos’ secrets.

The related build sequence of your application probably looks like the following:

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master
      - name: Install Dependencies
        run: npm ci
      - name: Build
        run: npm run build
```

To which we now “only” need to add the following:

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master
      - name: Install Dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
```

That’s already it. Doing so, GitHub Actions will set the related environment variable for our build and our above script and configuration will take care of the rest.

*****

### Summary

GitHub Actions are so handy, there were and are a big asset to my continuous integration workflow.

Stay home, stay safe!

David
