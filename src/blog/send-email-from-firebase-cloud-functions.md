---
path: "/blog/send-email-from-firebase-cloud-functions"
date: "2020-08-19"
title: "Send Email From Firebase Cloud Functions"
description: "How to send email with HTML content from Firebase Cloud functions"
tags: "#javascript #showdev #webdev #firebase"
image: "https://cdn-images-1.medium.com/max/1600/1*dsCLua-wdb1qDvvAfz8MmA.jpeg"
canonical: "https://medium.com/@david.dalbusco/send-email-from-firebase-cloud-functions-e406e1f3eea7"
---

![](https://cdn-images-1.medium.com/max/1600/1*dsCLua-wdb1qDvvAfz8MmA.jpeg)

_Photo by [Volodymyr Hryshchenko](https://unsplash.com/@lunarts?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

As you can probably imagine, at [DeckDeckGo](https://deckdeckgo.com), we do not have any collaborator who check that the publicly, published, slides have descent content. Neither do we have implemented a machine learning robot which would do so, yet.

I am taking care of such a task manually. I have to add, it makes me happy to do so. All the presentations published so far are always interesting.

Nevertheless, I have to be informed, when such decks are published. That’s why I have implemented a [Firebase Cloud Functions](https://firebase.google.com/docs/functions) to send my self an email with all the information I need to quickly review the new content.

---

### Setup A New Cloud Function

I assume you already have a Firebase project and, also have already created some functions. If not, you can follow the following [guide](https://firebase.google.com/docs/functions/get-started) to get started.

Moreover, note that I am using [TypeScript](https://www.typescriptlang.org/).

---

### Let’s Get Started

A function needs a trigger, that’s why we are registering a function in `index.ts` on a collection called, for example, `demo` (of course your collection can have a different name).

```javascript
import * as functions from "firebase-functions";

export const watchCreate = functions.firestore
	.document("demo/{demoId}")
	.onCreate(onCreateSendEmail);
```

We can use any other triggers or lifecycle, not necessary the `create` one.

To respond to the trigger's execution, we declare a new function which retrieve the newly created value (`const demo = snap.data()` ) and are adding, for now on, a `TODO` which should be replaced with the effective method to send email.

```javascript
import { EventContext } from "firebase-functions";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

interface Demo {
  content: string;
}

async function onCreateSendEmail(
                 snap: DocumentSnapshot,
                 _context: EventContext) {
  const demo: Demo = snap.data() as Demo;

  try {
    // TODO: send email
  } catch (err) {
    console.error(err);
  }
}
```

---

### Nodemailer

In order to effectively send email, we are going to use [Nodemailer](https://nodemailer.com/).

> Nodemailer is a module for Node.js applications to allow easy as cake email sending. The project got started back in 2010 when there was no sane option to send email messages, today it is the solution most Node.js users turn to by default.

> Nodemailer is licensed under MIT license.

As you can notice, Nodemailer is not just compatible with Firebase Cloud Functions but also with any [Node.js](https://nodejs.org/) projects.

To install it in our project, we run the following command:

```bash
npm install nodemailer --save
```

Furthermore, we also install its typings definition.

```bash
npm install @types/nodemailer --save-dev
```

---

#### SMTP Transport

Nodemailer uses SMTP as the main transport to deliver messages. Therefore, your email delivery provider should support such protocol. It also supports either the LTS or STARTTLS extension. In this post we are going to use STARTTLS and therefore are going to set the flag `secure` to `false` to activate this protocol.

You can find all options in the library [documentation](https://nodemailer.com/smtp/).

---

### Configuration

Specially if your project is open source, you might be interested to not hardcode your SMTP login, password, and host in your code but rather hide these in a configuration.

Firebase offers such ability. We can create a script to `set` these.

```bash
#!/bin/sh

firebase functions:config:set mail.from="hello@domain.com" mail.pwd="password" mail.to="david@domain.com" mail.host="mail.provider.com"
```

To retrieve the configuration in our function, we can access the configuration through `functions.config()` followed by the keys we just defined above.

```javascript
const mailFrom: string = functions.config().mail.from;
const mailPwd: string = functions.config().mail.pwd;
const mailTo: string = functions.config().mail.to;
const mailHost: string = functions.config().mail.host;
```

---

### Send Email

We have the transport, we have the configuration, we just need the final piece: the message.

I rather like to send my self HTML email, allowing me to include links in the
content, that’s why here too, we are using such a format.

```javascript
const mailOptions = {
	from: mailFrom,
	to: mailTo,
	subject: "Hello World",
	html: `<p>${demo.content}</p>`
};
```

Finally, we can use Nodemailer to create the channel and ultimately send our email.

```javascript
const transporter: Mail = nodemailer.createTransport({
  host: mailHost,
  port: 587,
  secure: false, // STARTTLS
  auth: {
    type: 'LOGIN',
    user: mailFrom,
    pass: mailPwd
  }
});

await transporter.sendMail(mailOptions);
```

---

### Altogether

All in all, our function is the following:

```javascript
import * as functions from 'firebase-functions';

import { EventContext } from "firebase-functions";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

import * as Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";

export const watchCreate =
       functions.
       firestore.
       document('demo/{demoId}').onCreate(onCreateSendEmail);

interface Demo {
  content: string;
}

async function onCreateSendEmail(
                 snap: DocumentSnapshot,
                 _context: EventContext) {
  const demo: Demo = snap.data() as Demo;

  try {
    const mailFrom: string = functions.config().info.mail.from;
    const mailPwd: string = functions.config().info.mail.pwd;
    const mailTo: string = functions.config().info.mail.to;
    const mailHost: string = functions.config().info.mail.host;

    const mailOptions = {
      from: mailFrom,
      to: mailTo,
      subject: 'Hello World',
      html: `<p>${demo.content}</p>`
    };

    const transporter: Mail = nodemailer.createTransport({
      host: mailHost,
      port: 587,
      secure: false, // STARTTLS
      auth: {
        type: 'LOGIN',
        user: mailFrom,
        pass: mailPwd
      }
    });

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
}
```

---

### Summary

With the help of a Firebase and Nodemailer, it is possible to relatively quickly set up a function which triggers email. I hope this introduction gave you some hints on how to implement such a feature and that you are going to give a try to [DeckDeckGo](https://deckdeckgo.com) for your next presentations.

I am looking forward to receiving an email telling me that I have to check your published slides 😉.

To infinity and beyond!

David
