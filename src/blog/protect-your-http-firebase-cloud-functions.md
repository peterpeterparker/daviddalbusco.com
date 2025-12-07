---
path: "/blog/protect-your-http-firebase-cloud-functions"
date: "2020-03-28"
title: "Protect Your HTTP Firebase Cloud Functions"
description: "How to protect your HTTP Firebase Cloud Functions with an authorization bearer"
tags: "#firebase #javascript #webdev #serverless"
image: "https://daviddalbusco.com/assets/images/1*ScsCTy63_eHnGH57WbJcLQ.png"
canonical: "https://medium.com/@david.dalbusco/protect-your-http-firebase-cloud-functions-adf23c45765e"
---

![](https://daviddalbusco.com/assets/images/1*ScsCTy63_eHnGH57WbJcLQ.png)

_Photo by [Andre Hunter](https://unsplash.com/@dre0316?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-two** days left until hopefully better days.

---

Last year I developed an application for a foundation which has for goal to help people from a certain age. Mostly for administrative reason, the project was not yet released publicly.

Recently we noticed some similarities in its goal and the current lockdown situation. That’s why I was asked to create a spin-off, containing the useful features, which can be unleashed quickly because it would be useful!

I spent my Saturday morning “cloning” our [Firebase Cloud](https://firebase.google.com) infrastructure and had to protect the new [HTTP Functions](https://cloud.google.com/functions/docs/writing/http) I just deployed online. That’s why I had the idea to write this brief article about the subject.

---

### Authorization Bearer

When you create Firebase Cloud function which can be triggered or called through an HTTP request, the function is public and available on the internet. As far as I know, its generated URL does not contains any random id or other hash which would make the route not predictable, therefore you have to find a way to protect it.

That’s why the solution, in my point of view, is to authenticate each requests with an authorization token.

One way of solving this is adding a constant key in your code. For example, if we have deployed the following function.

```javascript
import * as functions from "firebase-functions";

export const helloWorld = functions.https.onRequest(async (request, response) => {
	response.json({
		result: `Hello World.`
	});
});
```

We can create a function to validate a `bearer` which would have to be provided for each requests.

```javascript
import {Request} from 'firebase-functions/lib/providers/https';

async function validBearer(request: Request): Promise<boolean> {
    const key: string = 'our-key-value';

    const authorization = request.get('Authorization');
    const split =
          authorization ? authorization.split('Bearer ') : [];
    const bearerKey =
          split && split.length >= 2 ? split[1] : undefined;

    return key === bearerKey;
}
```

And use it to extend our HTTP function with a test.

```javascript
export const helloWorld =
    functions.https.onRequest(async (request, response) => {
      const isValidBearer: boolean = await validBearer(request);

      if (!isValidBearer) {
        response.status(400).json({
            error: 'Not Authorized'
        });
        return;
      }

      response.json({
        result: `Hello World.`
      });
});
```

For the `key` we can of course use something like a password or dumb keyword as I used above but it would be more secure to use for example a Version 4 UUID. There are many tools to generate such but I used today [https://www.uuidgenerator.net](https://www.uuidgenerator.net) which perfectly did the job.

```javascript
const key = "975dd9f6-4a89-4825-9a6d-deae71304a29";
```

As a result, our HTTP route is now protected and only accessible if an authorization is provided.

```bash
#!/bin/sh
curl -i
     -H "Accept: application/json"
     -H "Authorization: Bearer 975dd9f6-4a89-4825-9a6d-deae71304a29"
     -X GET  https://us-central1-yolo.cloudfunctions.net/helloWorld
```

---

### Firebase Environment Variables

Protection is cool, but is our protection protected 🧐? If our code is published as an open source software, our key is going to be exposed. Moreover, it ain’t really cute to handle a key in middle of the code. But there is a solution.

Firebase provides the ability to define not publicly exposed environment variables which can be read from Cloud functions.

To define our above key as such we can run the following command with the help of the Firebase CLI.

```bash
#!/bin/sh
firebase functions:config:set hello.world.key="975dd9f6-4a89-4825-9a6d-deae71304a29"
```

Last remaining things to do is replacing our constant with the new variable.

```javascript
const key = functions.config().hello.world.key;
```

And that’s it, our HTTP Firebase Cloud function is protected 🎉.

---

### Altogether

Just in case you would need the above code in one block, here is it altogether:

```javascript
import * as functions from 'firebase-functions';

import {Request} from 'firebase-functions/lib/providers/https';

async function validBearer(request: Request): Promise<boolean> {
    const key = functions.config().hello.world.key;

    const authorization = request.get('Authorization');
    const split =
          authorization ? authorization.split('Bearer ') : [];
    const bearerKey =
          split && split.length >= 2 ? split[1] : undefined;

    return key === bearerKey;
}

export const helloWorld =
    functions.https.onRequest(async (request, response) => {
      const isValidBearer: boolean = await validBearer(request);

      if (!isValidBearer) {
        response.status(400).json({
            error: 'Not Authorized'
        });
        return;
      }

      response.json({
        result: `Hello World.`
      });
});
```

---

### Summary

Firebase is so handy 😃. If this project or any other work I’m publishing as open source piece of software might interest you, follow me on [Twitter](https://twitter.com/daviddalbusco) and say hi. But more important:

Stay home, stay safe!

David
