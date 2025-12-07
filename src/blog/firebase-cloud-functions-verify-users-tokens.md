---
path: "/blog/firebase-cloud-functions-verify-users-tokens"
date: "2020-09-04"
title: "Firebase Cloud Functions: Verify Users Tokens"
description: "Grant access to your Firebase Cloud Functions only for authenticated users."
tags: "#firebase #javascript #webdev #showdev"
image: "https://daviddalbusco.com/assets/images/1*BSLn4cG8OsG63z4pbJqrXA.jpeg"
canonical: "https://medium.com/@david.dalbusco/firebase-cloud-functions-verify-users-tokens-d4e60e314d1a"
---

![](https://daviddalbusco.com/assets/images/1*BSLn4cG8OsG63z4pbJqrXA.jpeg)

_Photo by [Nigel Tadyanehondo](https://unsplash.com/@nxvision?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/you-shall-not-pass?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I started yesterday the refactoring of one of the core functions of [DeckDeckGo](https://deckdeckgo.com) by declaring a new [Firebase Cloud Functions](https://firebase.google.com/docs/functions/), which can be triggered via [HTTP requests](https://firebase.google.com/docs/functions/http-events).

As I was looking to protect its access, in order to avoid sneaky requests, I followed one of my [previous blog post](https://medium.com/better-programming/protect-your-http-firebase-cloud-functions-adf23c45765e) to protect it with the help of a bearer.

Once I tested this first step of the feature, I actually noticed that it was not the correct solution for my use case. I rather had to grant the access using the users tokens.

---

### Verify Users’ Tokens In Cloud Functions

It will probably sound silly for those who know the solution, but it actually took me quite some time to find how to verify the tokens of the users in Firebase Cloud Functions.

I took a wrong start by trying to implement the solution as I was implementing it in a backend respectively as displayed in the [Authenticate with a backend server](https://developers.google.com/identity/sign-in/web/backend-auth) using the library [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs). I spent time implementing the solution and finding where I could find the requested OAuth `CLIENT_ID` information of my projects to finally face the following error while I was trying the process:

```bash
No pem found for envelope: {"alg":"RS256","kid":"...","typ":"JWT"}
```

Finally, after many tries, I accepted the defeat and googled for solutions. Fortunately, for me, at the end of a [Stackoverflow question](https://stackoverflow.com/questions/61937587/how-to-get-valid-token-from-react-firebase-f%c3%bcr-nodesjs-server-verification/61937783#comment112690479_61937783), I discovered, thanks to an answer of [Will](https://stackoverflow.com/users/8535518/will), that there was a way easier to verify the tokens.

Indeed, if I had known the [Admin documentation](https://firebase.google.com/docs/auth/admin/verify-id-tokens), I would have discovered that Firebase as a built-in method to solve this requirement.

> The Firebase Admin SDK has a built-in method for verifying and decoding ID tokens. If the provided ID token has the correct format, is not expired, and is properly signed, the method returns the decoded ID token. You can grab the uid of the user or device from the decoded token.

Once I discovered this gem and, once my brain finally clicked, I was able to implement a small utility function:

```javascript
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export async function verifyToken(
                request: functions.Request): Promise<boolean> {
  try {
    const token: string | undefined = await getToken(request);

    if (!token) {
      return false;
    }

    const payload: admin.auth.DecodedIdToken =
                   await admin.auth().verifyIdToken(token);

    return payload !== null;
  } catch (err) {
    return false;
  }
}

async function getToken(request: functions.Request):
                       Promise<string | undefined> {
  if (!request.headers.authorization) {
    return undefined;
  }

  const token: string =
        request.headers.authorization.replace(/^Bearer\s/, '');

  return token;
}
```

Note that I test if the `payload` is not `null` to consider the token as valid but, I think that it might be not needed. The method `verifyIdToken` throw an error when it is not valid.

In addition, you can also notice that I except the user’s token to be passed as in the `headers` of the HTTP request and prefixed with a keyword `Bearer`.

Given for example a token ID `975dd9f6` , an HTTP POST request would look like the following:

```bash
#!/bin/sh
    curl -i
         -H "Accept: application/json"
         -H "Authorization: Bearer 975dd9f6"
         -X POST https://us-central1-yolo.cloudfunctions.net/helloWorld
```

---

### Grant Only Not Anonymous Users

Anyone can try out [DeckDeckGo](https://deckdeckgo.com), there is no mandatory login or sign-in upfront if you just want to give it a try. It is something really important to us, we are not chasing data or number of users, we are developing an editor for presentations for users’ who want to use it, or not 😉.

That being said, if users want to share publicly their presentations, because we don’t want to have too much “This is a test” or “Yolo” decks publicly published, respectively avoid if possible not meaningful public content, we do restrict our “publishing process” (the one in which we transform and deploy the presentations online as Progressive Web Apps), to signed users.

For these processes, we are using the ability given by Firebase to use [anonymous users](https://firebase.google.com/docs/auth/web/anonymous-auth).

That’s why, in addition to verify the tokens, I also add to check this information. Fortunately, this can also be solved easily, as the `payload` provided by the `verifyToken` function does contain such information.

```javascript
const payload: admin.auth.DecodedIdToken =
                   await admin.auth().verifyIdToken(token);

return payload !== null &&
       payload.firebase.sign_in_provider !== 'anonymous';
```

---

### Call Function With Bearer

In case you would be interested, here is how I provide the above `bearer` to a function call in TypeScript and in an application which use Firebase Auth.

```javascript
helloWorld(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const token: string =
            await firebase.auth().currentUser.getIdToken();

      const functionsUrl: string =
           'https://us-central1-yolo.cloudfunctions.net';

      const rawResponse: Response =
            await fetch(`${functionsUrl}/helloWorld`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          something: 'a value'
        }),
      });

      if (!rawResponse || !rawResponse.ok) {
        reject('Post failed etc.');
        return;
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
```

---

### Cherry On Top: CORS

Since I was implementing our first function to handle HTTP request, I had to deal with CORS. A quick Google search and a [Gist](https://gist.github.com/mediavrog/49c4f809dffea4e00738a7f5e3bbfa59#gistcomment-2585600) provided by [CoderTonyB](https://github.com/CoderTonyB) provided a solution.

The [expressjs/cors](https://github.com/expressjs/cors) should be installed in the functions’ project.

```bash
npm i cors --save && npm i @types/cors --save-dev
```

Finally, a handler should be used, before the effective implementation, to process the CORS request.

```javascript
import * as functions from 'firebase-functions';
import * as cors from 'cors';

export const helloWorld = functions.https.onRequest(myHelloWorld);

async function helloWorld(request: functions.Request,
                          response: functions.Response<any>) {
  const corsHandler = cors({origin: true});

  corsHandler(request, response, async () => {
      response.send('Yolo');
  });
}
```

---

### Take Away

Needless to say, it is actually easy to begin the development of a new feature wrongly and to lose quickly time. I would love to say that taking a deep breath or doing a break is the key, but once in a while it happens, stuffs happens 😉. Nevertheless, if you have got awesome tips and tricks to avoid such scenario, let me know, I am curious to hear about these!

If you are curious about the outcome, follow us on [Twitter](https://twitter.com/deckdeckgo) as we might release a super cool feature for developers next week 🚀.

To infinity and beyond!

David
