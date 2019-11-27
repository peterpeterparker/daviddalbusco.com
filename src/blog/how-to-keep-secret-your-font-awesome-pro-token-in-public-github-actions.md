---
path: "/blog/how-to-keep-secret-your-font-awesome-pro-token-in-public-github-actions"
date: "2019-11-27"
title: "How to keep secret your Font Awesome Pro token in public GitHub actions"
description: "How to keep secret your Font Awesome Pro token or NPM private tokens in public GitHub actions"
tags: "#devops #webdev #github #fontawesome"
image: "https://cdn-images-1.medium.com/max/1600/1*oASKWYL2zJdXrSghTn92PA.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*oASKWYL2zJdXrSghTn92PA.jpeg)

*Photo by [Serkan Turk](https://unsplash.com/@serkanturk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Yesterday [Julien Renaux](https://twitter.com/julienrenaux) published a [series](https://twitter.com/julienrenaux/status/1199322520815583233) of interesting new blog posts. In one of these he notably displayed, step by step, [how to deploy StencilJS apps with GitHub actions and Firebase hosting](https://julienrenaux.fr/2019/11/25/building-deploying-stenciljs-apps-firebase-hosting-github-actions/).

This tutorial really caught my eye because all applications of our web open source project [DeckDeckGo](https://deckdeckgo.com)  are developed with [StencilJS](https://stenciljs.com) and hosted on [Firebase](https://firebase.google.com) 😁

Of course I couldn’t wait that much and I had to give it a try. Because I’ll have to make changes to obfuscate production tokens differently if I use a CI to build our editor for presentations, I thought I could first try out his recipe in the current [Ionic React](https://ionicframework.com/docs/react) demo application I’m developing for our [Meetup](https://www.meetup.com/fr-FR/Ionic-Zurich/events/265767496/) next week.

As a result, it just worked seamlessly 🎉 It worked so well and the setup was so easy, that I thought I could quickly setup another CI deployment for my [website](https://daviddalbusco.com) too.

Unfortunately it didn’t worked out 😕 Even if the technology and stack of my website, build with [Gatsby](https://www.gatsbyjs.org), is somehow really similar to the small app, the build performed by the CI failed:

```yaml
X Download Artifact
  1 Run actions/download-artifact@master
  2 with:
  3    name: build
  4 Download artifact 'build' to: '/home/runner/work/daviddalbusco.com/daviddalbusco.com/build'
  5 
6 
```

At first, I didn’t understood the error. Of course I noticed that some artifacts couldn’t be downloaded but I didn’t knew what where these and what was the root cause. After a bit I finally remembered that I used to face a similar problem with another CI.

For my website I’m using [Font Awesome](https://fontawesome.com) and notably the `@fortawesome/pro-light-svg-icons` icons which could only be used if my related Font Awesome Pro NPM token is configured. While the documentation explains clearly how to configure the token locally, they don’t (or at least I didn’t found out at first) provide an example which displays how to hide it from a public repository. Therefore, the purpose of this blog post.

### Configure the NPM registry

The Font Awesome NPM token could either be set up globally or per project. The method we need to build our project with a CI is the last one, “per project”. For that purpose, we create a new file `.npmrc` in the root of your project . To the contrary of the documentation, we only add one line in the file respectively we only add  the reference to the Font Awesome packet manager. We deliberately ignore to specify anything regarding our token.

```javascript
@fortawesome:registry=https://npm.fontawesome.com/
```

### Set up a new secret in GitHub

As we didn’t provided the token in the previous file, we will have to provide it to the GitHub action in a different way otherwise it will still not be able to download the dependency. Fortunately GitHub already provide an option to keep environment variables secret. Therefore we make the most of this option and we create a new secret for our Font Awesome NPM token. For example let’s call it `FONTAWESOME_NPM_AUTH_TOKEN`.

![](https://cdn-images-1.medium.com/max/1600/1*NVoURzVa2jn6uuvAKvo12Q.png)

*Set up a GitHub secret for the Font Awesome NPM token*

### Use the secret in our CI

If you already followed the tutorial of Julien, your CI workflow probably already contains the following to install the dependencies from NPM of your application:

```yaml
- name: Install Dependencies
        run: npm ci
```

This is the root of our problem, as NPM is not aware of the specific registry and token it has to use to download the specific artifact. Therefore we finally are going to resolve the issue by running a command-line, before the installation one, to configure NPM with our secret token.

The pipe (`|` ) let us specify multiple commands all run in the in the same shell (see [documentation](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepsrun)).

```yaml
- name: Install Dependencies
      run: |
        npm config set '//npm.fontawesome.com/:_authToken' "${{ secrets.FONTAWESOME_NPM_AUTH_TOKEN }}"
        npm ci
```

And voilà, our CI should now be able to download the required dependency and therefore build and deploy our project 🎉

![](https://cdn-images-1.medium.com/max/1600/1*B0QAOSrrjgtLV5zywnA8sg.png)

*Successful CI, happy CI 😺*

### Cherry on the cake 🍒🎂

My website is open source and available on [GitHub](https://github.com/peterpeterparker/daviddalbusco.com), check it out to validate the solution with your own eyes 😉

To infinity and beyond 🚀

David
