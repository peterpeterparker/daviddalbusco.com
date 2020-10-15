---
path: "/blog/recursively-clean-firestore-fieldvalue-delete"
date: "2020-10-15"
title: "Recursively Clean Firestore FieldValue.delete()"
description: "How to recursively remove delete methods from the document's object you just updated and have in memory."
tags: "#firebase #javascript #webdev #firestore"
image: "https://cdn-images-1.medium.com/max/1600/1*2lFmIJDlVr6D_q8iAchhxw.jpeg"
canonical: "https://daviddalbusco.medium.com/recursively-clean-firestore-fieldvalue-delete-60b7dff00bf4"
---

![](https://cdn-images-1.medium.com/max/1600/1*2lFmIJDlVr6D_q8iAchhxw.jpeg)

*Photo by [The Creative Exchange](https://unsplash.com/@thecreative_exchange?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

This morning I had to improve a function we used in [DeckDeckGo](https://deckdeckgo.com) to recursively clean objects after persistence. Because I am currently quite busy but would not like to push my blogging habits too much on the side, I got the idea that this small "hack" would be a nice subject for a new blog post 🤗.

*****

### Introduction

When you use [Cloud Firestore](https://firebase.google.com/docs/firestore/), in order to delete specific fields from a document, you have to use the `FieldValue.delete()` method when you update a document (as displayed in the [documentation](https://firebase.google.com/docs/firestore/manage-data/delete-data)).

For example, if your database contains a document such as the following:

```json
{
  description: 'Hello World'
}
```

You have to use the above method to remove it because setting it for example to `null` would not remove the attribute but “only” set its value to `null` .

```javascript
import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firestore = firebase.firestore();

const ref = firestore.collection('users').doc('david');

const user = {
  description: firebase.firestore.FieldValue.delete()
};

await ref.update(user);
```

Thanks to this method, the above document's example becomes `{}` in the database.

*****

### Issue

This method works like a charm but can lead to an issue. Indeed, if you are not refreshing your local object after its update, it will still contain the method `FieldValue.delete()` afterwards, which does not reflect its effective value in database.

Concretely, with our above example, if we would print out the `user` to the console, its output would be the following.

```json
{
  description: n {h_: n}
}
```

This can lead to some unexpected behavior in your application, if you are still using the object after its update, notably if it is a state.

*****

To overcome this issue, one solution would be explicitly fetch the newly updated document from Firestore, what is also happening automatically if you have developed some polling to fetch the information or if you are using libraries such as [AngularFire](https://github.com/angular/angularfire) or [RxFire](https://github.com/firebase/firebase-js-sdk/tree/master/packages/rxfire).

```javascript
import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firestore = firebase.firestore();

const ref = firestore.collection('users').doc('david');

let user = {
  description: firebase.firestore.FieldValue.delete()
};

await ref.update(user);

user = ref.get();

console.log(user); // {}
```

This solution has the advantage to keep your objects in sync with the database but has the disadvantage to cost you an extra query.

Indeed, when you use [Cloud Firestore](https://firebase.google.com/docs/firestore/), you are [charged](https://cloud.google.com/firestore/pricing) according the number of reads, writes, and deletes that you perform. Therefore, one more query can, according its frequency, leads to more costs.

That’s why I came up to the idea of cleaning recursively clean the method `FieldValue.delete()`, why I had the idea of a "hack" 😎.

*****

### Solution

The following function `filterDelete` iterates all `keys` of an object and identify these which have to be ignored (`shouldAttributeBeCleaned` ), these which contains the method `FieldValue.delete()`.

If not ignored, then it recursively calls the function `filterDelete` for the current child und this until all children have been processed the same way.

In addition, as the reducer is initialized with an empty object `{}`, it also has to check if the effective value of the object is not empty in order to not add empty leaf to the accumulator.

```javascript
export function filterDelete<T>(obj: T): T {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  return Object.keys(obj)
    .filter((key) => !shouldAttributeBeCleaned(obj[key]))
    .reduce((res, key) => {
      const value: T = filterDelete(obj[key]);

      if (value && typeof value === 'object') {
        if (Object.keys(value).length > 0) {
          res[key] = value;
        }
      } else {
        res[key] = value;
      }

      return res;
    }, {} as T);
}

function shouldAttributeBeCleaned<T>(attr: T): boolean {
  if (typeof attr !== 'object' || Array.isArray(attr)) {
    return false;
  }

  const firestoreDelete = Object.keys(attr).find((key: string) => {
    return attr[key] === 'FieldValue.delete';
  });

  return firestoreDelete !== null && firestoreDelete !== undefined;
}
```

Thanks to this function, I am able to achieve the exact same behavior as if I would fetch the updated document from the database.

```javascript
import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firestore = firebase.firestore();

const ref = firestore.collection('users').doc('david');

let user = {
  description: firebase.firestore.FieldValue.delete()
};

await ref.update(user);

console.log(filterDelete(user)); // {}
```

*****

### Limitation

The major limitation of this strategy is its dependency on the [Firebase](https://github.com/firebase/firebase-js-sdk) library. After each update, it is worth to check if it still works out as the detection of the method `FieldValue.delete()` may have to change between versions. It happened to me before, therefore be careful if you would use the function.

I can also recommend, if you would use it, to have a special attention on the error handling between the update and clean, because you may want to avoid the scenario in which the values of the local objects are not equals to their database value (“not in sync”).

*****

### Conclusion

You might notice some potential improvements in the above solution. DeckDeckGo is open source, therefore I would be more than happy to get your contribution to the [code source of this function](https://github.com/deckgo/deckdeckgo/blob/master/studio/src/app/utils/editor/firestore.utils.tsx). It is still [Hacktoberfest](https://hacktoberfest.digitalocean.com/) 2020 after all 😎.

To infinity and beyond!

David

*****

Reach me out on [Twitter](https://twitter.com/daviddalbusco) and, why not, give a try to [DeckDeckGo](https://deckdeckgo.com/) for your next presentations.

It deploys your decks online as Progressive Web Apps and can even push your slides’ source code to GitHub.
