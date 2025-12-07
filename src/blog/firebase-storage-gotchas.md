---
path: "/blog/firebase-storage-gotchas"
date: "2020-02-04"
title: "Firebase Storage Gotchas 😅"
description: "Sharing some Google Cloud Storage key points I learned while implementing private assets and reverting two days of work."
tags: "#firebase #javascript #webdev #serverless"
image: "https://daviddalbusco.com/assets/images/1*58twqItpOjtMRuQquE2l5w.jpeg"
canonical: "https://medium.com/@david.dalbusco/firebase-storage-gotchas-63a7cfef7677"
---

![](https://daviddalbusco.com/assets/images/1*58twqItpOjtMRuQquE2l5w.jpeg)

_Photo by [Element5 Digital](https://unsplash.com/@element5digital?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

When was the last time you reverted several working days?

I recently took some time to make the assets, moreover than the content, private for every users of our web editor for presentations, [DeckDeckGo](https://deckdeckgo.com).

After two working days, I finally noticed that I misinterpreted one fundamental point of the [Google Cloud Storage](https://firebase.google.com/docs/storage) and I figured out that I had to revert my new implementation, because our assets were actually, already private 😅. That’s why I’m writing this new blog post, hoping that my “unlucky” experience might help someone else in the future.

### Rules: Storage Does Not Have Access To Firestore

Sometimes when things are not written down, I'm asking my self if they aren't, because they are not possible or because they actually are possible 🤔.

Being able to write Storage rules by querying [Firestore](https://firebase.google.com/docs/firestore) was one of these things and the answer is **no.** There is currently no possibility to access a Firebase product from another product.

### Rules: Users Read And Write Privileges

It is possible to restrict the access, read and write, to the storage to only authenticated users.

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

But the above rule still implies that users would be able overwrite data provided by other users. To overcome this problem, we can prefix the data of each users in the Storage with their respective `userId`.

For example, if you are using the [Firebase JavaScript SDK](https://github.com/firebase/firebase-js-sdk), an upload would look like the following:

```javascript
const ref: Reference =
      firebase.storage().ref(`${userId}/assets/photo.jpg`);

await ref.put(data);
```

Once the storage files ordered in that structure, we are then be able to define a rule like the following which only allows users to write and read data in their respective folder of the storage:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/assets/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Format: Storage References

To access a public file or a private one, with a granted rule access, the Storage URL could be made of the following parts:

```html
<img src={`https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(path)}?alt=media`}/>
```

Where `${projectId}` is the Id of the Firebase project and `${path}` the path to the file in the storage (a string) which has to be encoded with [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) in order to be compliant.

### Fetch: Access Image Securely With OAuth2

If we define the above rules or any other rules which grant access to the storage only to authenticated users, it is possible with JavaScript to fetch and load an image with OAuth2 as Bryan Burman displayed in his blog post “[How To Access Images Securely with OAuth 2.0](https://www.twelve21.io/how-to-access-images-securely-with-oauth-2-0/)”.

```javascript
try {
    const imgSrc: string =
      'https://firebasestorage.googleapis.com/.../photo.jpg';
    const rawResponse: Response = await fetch(imgSrc, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${firebase_user_auth_token}`
        }
    });

    if (!rawResponse || !rawResponse.ok) {
        console.error(`Image can not be fetched.`);
        return;
    }

    const blob: Blob = await rawResponse.blob();
    document.querySelector('img').src = URL.createObjectURL(blob);
} catch (err) {
    console.error(err);
}
```

### downloadURL: Public But Private

This was my biggest “gotcha” and the reason why I reverted hours of work.

For each and every single asset uploaded in the Storage, Firebase create, regardless if you use them or not, a `downloadUrl` which is **public**, regardless of your rules, and accessible on the internet. **But**, because the url contains a `token` which is essentially impossible for anyone to guess, these urls are, as long as we don’t share these with anyone, **private**.

Here’s for example `downloadUrl` where the token is use as parameter to grant the access to the file.

```html
<img src={`https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${path}?alt=media&token=4733325a-78ff-444d-a67c-01fd8ab30fe`}/>
```

This was a turning point to me in the process and I have to thank [Doug Stevenson](https://twitter.com/CodingDoug) for having answered my question about it on [StackOverflow](https://stackoverflow.com/questions/59782590/firebase-storage-never-fully-private).

_Note that, without being absolutely sure, I think it might be possible if you are using the Cloud Solution from the server side to instruct Firebase to not generate such urls but it is definitely not possible from the Web/Client side._

### downloadUrl: Lifecycle

Firebase Storage token does **not** expire (see [StackOverflow](https://stackoverflow.com/a/42598354)). Therefore, without any other modifications, our `downloadUrl` also never expire and remain available. **But**, is it possible in the Firebase Console, to invalidate a specific url. **But**, once invalidated, Firebase will create a new `downloadUrl` respectively a new `token` for the selected file.

It is also worth to notice, that for each overwrites, Firebase will also generate a new `token` . This means that for example if the users of ours applications are able to upload files, each time they would upload again a file without changing its name, a new `downloadUrl` would be automatically created.

That’s it, I think this is the summary of my learnings. Firebase Storage is definitely an incredible developer friendly piece of software and all the content and assets of every single users of [DeckDeckGo](https://deckdeckgo.com) is private until they decide to share publicly their presentations.

To infinity and beyond 🚀

David
