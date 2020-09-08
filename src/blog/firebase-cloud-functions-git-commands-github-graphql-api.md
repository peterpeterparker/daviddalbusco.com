---
path: "/blog/firebase-cloud-functions-git-commands-github-graphql-api"
date: "2020-09-08"
title: "Firebase Cloud Functions: Git Commands & GitHub GraphQL API"
description: "Execute Git commands, such as Clone or Push, and use the GitHub GraphQL API, to create a Pull Request, in Firebase Cloud Functions."
tags: "#firebase #javascript #webdev #showdev"
image: "https://cdn-images-1.medium.com/max/1600/1*CLLQh8vkxSkbYBCoXjU95A.png"
canonical: "https://medium.com/@david.dalbusco/firebase-cloud-functions-git-github-graphql-api-5c8577591cb1"
---

![](https://cdn-images-1.medium.com/max/1600/1*CLLQh8vkxSkbYBCoXjU95A.png)

*Background photo by [Lukas Blazek](https://unsplash.com/@goumbik?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

We recently released an exciting new unique feature at [DeckDeckGo](https://deckdeckgo.com). 

In addition to being able to deploy online your presentations as Progressive Web Apps, our web open source editor can now push their source codes to [GitHub](https://github.com) too 🎉.

<iframe width="280" height="158" src="https://www.youtube.com/watch?v=yVYEacO7qrQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/>

This new function runs in [Firebase Cloud Functions](https://firebase.google.com/docs/functions/). Because we like to share our discoveries, here are the key elements we learned while developing this integration.

*****

### Access Tokens

To interact with GitHub we need a token.

*****

#### Personal Token

If you are looking to interact with GitHub with your account, your can use a  [personal access token](https://github.com/settings/tokens). Once created, you can set in the configuration of our Firebase functions. Doing so, it will be obfuscated from your code.

```bash
#!/bin/sh
firebase functions:config:set github.token="4a686......."
```

*****

#### Firebase Auth And GitHub Token

If you are rather interested to interact with GitHub in behave of your users, you might use [Firebase UI](https://github.com/firebase/FirebaseUI-Web) and the [Firebase Authentication](https://firebase.google.com/docs/auth/).

As far as I discovered, with such combination, it is unfortunately not possible to get the user’s GitHub token in a Firebase Cloud Functions. I tried to hook on  the authentication [events](https://firebase.google.com/docs/functions/auth-events) but did not find any related information in the object triggered.

I might have missed something, in such a case please let me know as soon as possible (!), but if not, to get such information, you have to find it through the `signInSuccessWithAuthResult` callback of the Firebase UI configuration.

```javascript
callbacks: {
  signInSuccessWithAuthResult: 
    (authResult: firebase.auth.UserCredential, _redirectUrl) => {

    const token: string =
      (userCred.credential as 
               firebase.auth.OAuthCredential).accessToken;

    return true;
  },
},
```

*Note that I opened an issue to ask how it was possible to access the token using TypeScript and the cast to *`OAuthCredential`* was provided as [answer](https://github.com/firebase/firebaseui-web/issues/743).*

*****

### File System

Before going further, you may ask yourself how we are going to be able to execute Git command in the "cloud"? I was actually asking my self the same question, and it turns out that Firebase Functions have access to a temporary folder of their [file system](https://cloud.google.com/functions/docs/concepts/exec#file_system).

> The only writeable part of the filesystem is the `/tmp` directory, which you can use to store temporary files in a function instance. This is a local disk mount point known as a "tmpfs" volume in which data written to the volume is stored in memory. Note that it will consume memory resources provisioned for the function.

In addition, temporary directories are not share across functions. It means for example that you cannot use such a folder to share data.

The `tmp` order has not to be hardcoded. Instead of such, the [Node.js OS module](https://nodejs.org/api/os.html) can be used to retrieve the temporary folder. It can be more handy to it if for some reason it would change in the future, you never know 😉.

```javascript
import * as os from 'os';

console.log(os.tmpdir()); // -> /tmp
```

Using it together with the [Path module](https://nodejs.org/api/path.html), we can even create a short utility function to resolve files’ paths locally.

```javascript
import * as path from 'path';
import * as os from 'os';

export function getFilePath(...files: string[]): string {
  return path.join(os.tmpdir(), ...files);
}

console.log(getFilePath('yo', 'david.txt'); // -> /tmp/yo/david.txt
```

*****

### Git Commands

In order to clone a repo, or generally speaking to execute any Git commands such as commit, pull or push, I suggest the use the [simple-git](https://github.com/steveukx) interface for Node.js developed by [Steve King](https://github.com/steveukx) (1.5 millions weekly downloads on [npm](https://www.npmjs.com/package/simple-git)). It really eases all the work.

```bash
npm i simple-git --save
```

*****

#### Clone

Concretely, a clone function can be implemented as following:

```javascript
import * as path from 'path';
import * as os from 'os';

import simpleGit, {SimpleGit} from 'simple-git';

export async function clone(repoUrl: string, repoName: string) {
  const localPath: string = path.join(os.tmpdir(), repoName);

  await deleteDir(localPath);
  
  const git: SimpleGit = simpleGit();
  await git.clone(repoUrl, localPath);
}

// Demo:

(async () => {
 await clone('https://github.com/deckgo/deckdeckgo/', 'deckdeckgo'); 
})();
```

Even though temporary folder are probably going to be empty, it is probably a safe bet to try to delete the working subdirectory first. That’s why I call the `deleteDir` in the above function.

```javascript
import * as rimraf from 'rimraf';

export function deleteDir(localPath: string): Promise<void> {
  return new Promise<void>((resolve) => {
    rimraf(localPath, () => {
      resolve();
    });
  });
}
```

As you can notice, I use [rimraf](https://github.com/isaacs/rimraf) from [Isaac Z. Schlueter](https://twitter.com/izs) (37 millions weekly downloads on [npmjs](https://www.npmjs.com/package/rimraf)).

```bash
npm i rimraf --save && npm i @types/rimraf --save-dev
```

*****

#### Push

Another interesting example of Git commands is the Push request, as we do have to use the token to authenticate the request.

After searching for a solution to use the token, I notably spent some times reading this [Stackoverflow](https://stackoverflow.com/questions/18935539/authenticate-with-github-using-a-token) question and answers, I came to the conclusion that the solution which gives the best results, to avoid exposing the token, even though we are executing the interaction in the function, was to use it in the Git URI.

Note that the token is exposed in the potential error messages, that is why I think it is also good to catch properly these too.

In addition to the token, we might need to provide our GitHub account’s `username` (such as [peterpeterparker](https://github.com/peterpeterparker) for example) and `email`. These information can be administrated with the configuration of our functions too.

```javascript
import * as functions from 'firebase-functions';

import * as path from 'path';
import * as os from 'os';

import simpleGit, {SimpleGit} from 'simple-git';

export async function push(project: string,
                           branch: string) {
  try {
    const localPath: string = path.join(os.tmpdir(), repoName);

    // Git needs to know where is has to run, that's why we pass
    // the pass to the constructor of simple-git

    const git: SimpleGit = getSimpleGit(localPath);

    // Configure Git with the username and email

    const username: string = functions.config().github.username;
    const email: string = functions.config().github.email;

    await git.addConfig('user.name', username);
    await git.addConfig('user.email', email);

    // Finally Git push

    const token: string = functions.config().github.token;

    await git.push(`https://${username}:${token}@github.com/${username}/${project}.git`, branch);
  } catch (err) {
    throw new Error(`Error pushing.`);
  }
}

// Demo:

(async () => {
 await push('deckdeckgo', 'my-branch'); 
})();
```

*****

### GitHub GraphQL API

The last, or new, depends on the point of view, version (v4) of the GitHub API can be use with GraphQL queries. Its [documentation](https://docs.github.com/en/graphql) makes it relatively easy to search for information but the [explorer](https://developer.github.com/v4/explorer/), and its auto-complete feature, is probably even more handy to compose quickly flexible queries.

*****

#### Query

I did not use any GraphQL clients (as for example [Apollo](https://github.com/apollographql/apollo-client)) to perform the queries. Instead, I developed a utility to perform the HTTPS requests.

```javascript
import fetch, {Response} from 'node-fetch';

async function queryGitHub(githubToken: string, 
                           query: string): Promise<Response> {
  const githubApiV4: string = 'https://api.github.com/graphql';

  const rawResponse: Response = await fetch(`${githubApiV4}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `token ${githubToken}`,
    },
    body: JSON.stringify({query}),
  });

  if (!rawResponse || !rawResponse.ok) {
    throw new Error('Cannot perform GitHub query.');
  }

  return rawResponse;
}
```

As `fetch` is not natively available in [Node.js](https://nodejs.org/en/), I used [node-fetch](https://github.com/node-fetch/node-fetch) (16 millions weekly downloads on [npm](https://www.npmjs.com/package/node-fetch)).

```bash
npm i node-fetch --save && npm i @types/node-fetch --save-dev
```

*****

#### Query: User Information

A relatively basic example of query can be the following. In such function, we try to retrieve the GitHub `login` ("username") and `id` corresponding to the token we are using to authenticate the request, respectively the information of the [currently authenticated user](https://docs.github.com/en/graphql/reference/queries#user).

```javascript
export interface GitHubUser {
  id: string;
  login: string;
}

export function getUser(githubToken: string): Promise<GitHubUser> {
  return new Promise<GitHubUser>(async (resolve, reject) => {
    try {
      const query = `
        query {
          viewer {
            id,
            login
          }
        }
      `;

      const response: Response = 
            await queryGitHub(githubToken, query);

      const result = await response.json();

      resolve(result.data.viewer);
    } catch (err) {
      reject(err);
    }
  });
}

// Demo:

(async () => {
 const token: string = functions.config().github.token;
 
 const user = await getUser(token); 

 console.log(user); // -> {login: 'peterpeterparker', id: '123'}
})();
```

*****

#### Mutation: Pull Request

Creating a Pull Request is not a GraphQL query but a [mutation](https://docs.github.com/en/graphql/reference/mutations#createpullrequest). It needs a bit more information in comparison to previous query, but the logic behind is the same: compose a GraphQL query/mutation, send it through an HTTPS request and get the results 😁.

It is worth to notice that, in order to create a PR, the mutation will need a `repositoryId` . This information can be found with the help of another GraphQL query, as for example provided when requesting [repository](https://docs.github.com/en/graphql/reference/queries#repository) information.

```javascript
export function createPR(githubToken: string,
                         repositoryId: string,
                         branch: string): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const title: string = 'feat: my title';
            const body: string = `# The Pull Request body.
      
      It supports *Markdown*.`;

     // We want to provide a PR from a branch to master

     const query = `
             mutation CreatePullRequest {
               createPullRequest(input:{baseRefName:"master",body:"${body}",headRefName:"${branch}",repositoryId:"${repositoryId}",title:"${title}"}) {
                 pullRequest {
                   id
                 }
               }
             }
           `;

      const response: Response = 
            await queryGitHub(githubToken, query);

      const result = await response.json();

      if (!result || !result.data || 
          !result.data.createPullRequest || result.errors) {
        resolve(undefined);
        return;
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

// Demo:

(async () => {
 const token: string = functions.config().github.token;
 
 await createPR(token, '6789', 'my-branch');
})();
```

*****

### Summary

I learned many new things while developing this feature and, I hope that with the help of this blog post, I was able to share the major learnings.

In addition, we are open source, you can always have a look at our [repo](https://github.com/deckgo/deckdeckgo/)’s source code or contribute to our project.

You are also most welcomed to give a try to [DeckDeckGo](https://deckdeckgo.com) for your next presentations.

I am also looking forward to checkout and give a try to the GitHub repos that will contain the source code of your slides 😉.

To infinity and beyond!

David
