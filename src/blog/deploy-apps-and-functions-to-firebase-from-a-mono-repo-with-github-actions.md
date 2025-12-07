---
path: "/blog/deploy-apps-and-functions-to-firebase-from-a-mono-repo-with-github-actions"
date: "2020-03-23"
title: "Deploy Apps And Functions To Firebase From A Mono Repo With GitHub Actions"
description: "How to deploy applications and functions from a mono repo with GitHub Actions to Firebase Hosting and Functions"
tags: "#devops #github #webdev #yaml"
image: "https://daviddalbusco.com/assets/images/1*-sJcIhzFM8ypB7ifPgYdow.png"
canonical: "https://medium.com/@david.dalbusco/deploy-apps-and-functions-to-firebase-from-a-mono-repo-with-github-actions-371082ed7031"
---

![](https://daviddalbusco.com/assets/images/1*-sJcIhzFM8ypB7ifPgYdow.png)

_Photo by [张 嘴](https://unsplash.com/@zhangzui?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-seven** days left until hopefully better days.

---

I am a big fan of a [blog post](https://julienrenaux.fr/2019/11/25/building-deploying-stenciljs-apps-firebase-hosting-github-actions/) published by [Julien Renaux](https://twitter.com/julienrenaux) a couple of months ago in which he displays how to deploy an application using [GitHub Actions](https://github.com/features/actions) to [Firebase Hosting](https://firebase.google.com/docs/hosting).

The article is super comprehensive and I even already have published a [following post](https://daviddalbusco.com/blog/how-to-keep-secret-your-font-awesome-pro-token-in-public-github-actions) about it once before 🤣. Nevertheless I think that this challenge is the perfect excuse to publish again another follow-up 😉.

---

### Mono Repo

Our open source project [DeckDeckGo](https://deckdeckgo.com) contains many Progressive Web Apps and Cloud Functions, for which, obviously, I did set up GitHub actions as Julien displayed.

In this blog post I share the enhancement I had to implement in order to make the integration supports a mono repo.

---

### To Firebase Hosting

Let’s say that one of your application is available in a sub-folder of our repo called `docs` . Basically, everything you have to do in addition to the original post is to prefix all steps of the Action with your sub-directory, respectively with `docs` .

Concretely, if for example we would like to trigger the action when a merge happens in the master branch, but, only if a modifications impacts our specific app, we specify a path to the Action `on` listener.

Listen to push to master for the all repo:

```yaml
on:
  push:
    branches:
      - master
```

Listen to push to master only if sub-folder is affected:

```yaml
on:
  push:
    branches:
      - master
    paths:
      - "docs/**"
```

Because the Git checkout of our pipeline happens on the root level of our repo, when it goes to installing dependencies or running a build, we do have to observe our sub-folder too. For such purpose, GitHub Action provides a handy option `working-directory` for the `npm` steps.

Run `npm` in the root folder:

```yaml
- name: Install Dependencies
        run: npm ci
```

Run `npm` in a sub-directory:

```yaml
- name: Install Dependencies
  run: npm ci
  working-directory: ./docs
```

Likewise, when it goes to artifacts, we also have to prefix the path to our bundle.

Archiving without sub-folder:

```yaml
- name: Archive Artifact
  uses: actions/upload-artifact@master
  with:
    name: www
    path: www
```

Archiving with sub-folder:

```yaml
- name: Archive Artifact
  uses: actions/upload-artifact@master
  with:
    name: docs
    path: docs/www
```

Finally, the Firebase Action does also provide an option to specify a project path.

Deploy to Firebase from root:

```yaml
- name: Deploy to Firebase
  uses: w9jds/firebase-action@master
  with:
    args: deploy --only hosting
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

Deploy to Firebase for a sub-directory:

```yaml
- name: Deploy to Firebase
  uses: w9jds/firebase-action@master
  with:
    args: deploy --only hosting
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
    PROJECT_ID: "default"
    PROJECT_PATH: "./docs"
```

All in all, here’s the action to deploy our application for a sub-folder of our
mono repo to Firebase Hosting:

```yaml
name: CI - Docs

on:
  push:
    branches:
      - master
    paths:
      - "docs/**"

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master
      - name: Install Dependencies
        run: npm ci
        working-directory: ./docs
      - name: Build
        run: npm run build
        working-directory: ./docs
      - name: Archive Artifact
        uses: actions/upload-artifact@master
        with:
          name: docs
          path: docs/www
  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master
      - name: Download Artifact
        uses: actions/download-artifact@master
        with:
          name: docs
          path: docs/www
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          PROJECT_ID: "default"
          PROJECT_PATH: "./docs"
```

---

### To Firebase Cloud

In [DeckDeckGo](https://deckdeckgo.com) we are also taking advantages of the amazing [Cloud Functions](https://firebase.google.com/docs/functions) features of Firebase.

The process is basically the same as previously with that difference that you don’t have to build or even bundle anything because these steps are contained in the deployment process it self. Therefore checking out the repo, installing the dependencies and deploying is going to do the trick.

Note that again, as we have a mono repo, the following example happens in a sub-directory called `cloud` which contains the functions.

```yaml
name: CI - Cloud

on:
  push:
    branches:
      - master
    paths:
      - "cloud/**"

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master
      - name: Install Dependencies
        run: npm ci
        working-directory: ./cloud/functions
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          PROJECT_ID: "default"
          PROJECT_PATH: "./cloud"
```

---

### Summary

GitHub actions are awesome! Seriously, few lines, few configuration, supports mono repo, really a perfect solution for a project like ours.

That being said, notably if you are and want to use them in your company, you might be interested by another blog post published by Julien which describes some [possible risks](https://julienrenaux.fr/2019/12/20/github-actions-security-risk/) linked to versioning and dependencies.

You are also most welcomed to have a look to our open source Actions in our [repo](https://github.com/deckgo/deckdeckgo) or even better, if you notice anything which can be improved in [DeckDeckGo](https://deckdeckgo.com), don’t hesitate to open an issue or even better, send us a Pull Request 😃.

Stay home, stay safe!

David
