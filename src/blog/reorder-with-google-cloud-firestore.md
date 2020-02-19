---
path: "/blog/reorder-with-google-cloud-firestore"
date: "2020-02-19"
title: "Reorder With Google Cloud Firestore"
description: "How to maintain a list of data dynamically sorted with Cloud Firestore collection"
tags: "#firebase #javascript #webdev #serverless"
image: "https://cdn-images-1.medium.com/max/1600/1*wRwngS5dVwEFcnpF4t1q4w.jpeg"
canonical: https://medium.com/@david.dalbusco/reorder-with-google-cloud-firestore-8e13ea9f7fb9
---

![](https://cdn-images-1.medium.com/max/1600/1*wRwngS5dVwEFcnpF4t1q4w.jpeg)
*Photo by [Héctor J. Rivas](https://unsplash.com/@hjrc33?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Have you ever had the need to let your users order data as they wish to?

In one of my most recent work, one of the required feature had to do with giving the users the ability to reorder their data using Kanban boards. Likewise, in [DeckDeckGo](https://deckdeckgo.com), our web open source editor for presentations, users can sort slides according to their need.

In both cases, I use [Cloud Firestore](https://firebase.google.com/docs/firestore), a scalable NoSQL cloud database from Google, and I implemented the same approach which I’ll try to described the best I can in this blog post.

### Approaches

Firestore don’t offer out of box the ability to maintain data in collections ordered dynamically. It does give you the ability to perform sorted queries but doesn’t allow you to specify a custom ordering yet.

There are probably more than the following three solutions  but, after thinking about the problem, I figured out that these were probably my best approaches to achieve my goal:

1. Storing the data in document arrays instead of collections
2. Using linked list to keep track of the data's order
3. Saving the data in sub-collections and maintaining sorted arrays of their references in related documents

For me, the first approach, storing data in arrays, was quickly a no go idea. It would have probably been the fastet solution to implement but I find it not scalable. The second one, linked lists, was interesting but I thought that the realization would be a bit verbose because I could imagine that each time an element of the list is modified, its adjacent nodes have to be updated too.

That’s why the only remaining approach was the third one, using arrays of references, which has the advantages of being scalable and not too verbose. 

But, as great power comes with great responsibility, this solution has a small downside: it costs more than the two other solutions since it needs a bit more database operations.

### Model

Let’s say that our goal, in this blog post, is being able to sort dynamically the slides of a presentation, respectively of a deck. To follow the above third approach, we are going to save the presentations in a parent-collection `decks` and the slides in a sub-collection `slides`. Moreover, as we want to take care of the ordering, we add an array `slides_ids` in the parent document which will contains the ordered list of ids.

```javascript
// Query: `/decks/${deckId}`

export interface DeckData {
  slides_ids: string[]; // <-- The ordered slides ids
}

export interface Deck {
  id: string;
  data: DeckData;
}

// Query: `/decks/${deckId}/slides/${slideId}`

export interface SlideData {
  content: string; // Just a dummy content for demo purpose
}

export interface Slide {
  id: string;
  data: SlideData;
}
```

### Implementation

In order to split the implementation in separate parts we proceed with the following execution scenario. First we create a deck followed by the creation of three slides. We then implement a method to print the slides, because it is a good example of a retrieval function, and finally we implement a method to change the ordering of the slides.

```javascript
(async () => {
  try {
    const deckId = await createDeck();
    
    await createSlide(deckId, 'Slide 1');
    await createSlide(deckId, 'Slide 2');
    await createSlide(deckId, 'Slide 3');

    await printSlides(deckId);

    await moveSlide(deckId, 1, 0);

    await printSlides(deckId);
  } catch (err) {
    console.error(err);
  }
})();
```

### Create Data In The Parent-Collection

The creation of the parent data, the `deck`, isn’t different as any data creation with Firestore. It doesn’t contain specific information regarding the ordering.

```javascript
async createDeck() {
  const firestore = firebase.firestore();
  
  const data = {};

  const doc = await firestore.collection('decks').add(data);

  console.log('Deck created', {
    id: doc.id,
    data: data
  });

  return doc.id;
}
```

*In order to try to keep the demonstrated pieces of code clear and lean, please do note that in these I didn’t amended errors, performances and other subjects which are needed for a real implementation.*

### Create Data In The Sub-Collection

Likewise, creating the data in the sub-collection themselves, the `slides` , doesn’t contains any particular data regarding ordering **but** it does need an extra step to update the parent document because we want to keep track “manually” of the sorting.

```javascript
async createSlide(deckId, content) {
  const firestore = firebase.firestore();

  const data = {
    content: content
  };

  const doc = await firestore.collection(`/decks/${deckId}/slides`)
                    .add(data);
  
  console.log('Slide created', {
    id: doc.id,
    data: data
  });
  
  await updateDeck(deckId, doc.id);
}
```

This extra step, the update of the `deck` , can for example be implemented like the following:

```javascript
async updateDeck(deckId, slideId) {
  const firestore = firebase.firestore();
  
  const snapshot = await firestore
      .collection('decks')
      .doc(deckId)
      .get();

  if (!snapshot.exists) {
    console.error('Deck not found');
    return;
  }

  const data = snapshot.data();

  if (!data.slides_ids || data.slides_ids.length <= 0) {
    data.slides_ids.slides = [];
  }

  // Add the newly created slide ID to the list of slides
  data.slides_ids.push(slideId);

  await firestore
      .collection('decks')
      .doc(deckId)
      .set(data, {merge: true});
  
  console.log('Deck updated');
}
```

But, in my opinion and because we are already using Firestore, the most reliable solution would be to defer the update of the slides’ list of IDs in a [Cloud Functions for Firebase](https://firebase.google.com/docs/functions). For demonstration purpose I’ll stick to achieving the update from the client side but if you are implementing this solution in your application, I would suggest you to consider this option.

```javascript
import * as functions from 'firebase-functions';

export const slideCreate = functions.firestore
  .document('decks/{deckId}/slides/{slideId}')
  .onCreate(watchSlideCreate);

async function watchSlideCreate(snapshot, context) {
  const deckId: string = context.params.deckId;
  const slideId: string = context.params.slideId;

  await updateDeck(deckId, slideId);
}

// And adapt above `updateDeck` function to use 'firebase-admin'
```

### Retrieve Ordered Data

As mentioned in the approach, retrieving the “manually” ordered data costs more than querying these because we have first to get the list of IDs before being actually able to fetch these. But it does solve our goal.

```javascript
async printSlides(deckId) {
  const firestore = firebase.firestore();

  const snapshot = await firestore
      .collection('decks')
      .doc(deckId)
      .get();

  if (!snapshot.exists) {
    console.error('Deck not found');
    return;
  }

  const data = snapshot.data();

  if (!data.slides_ids || data.slides_ids.length <= 0) {
    console.error('No slides to print');
    return;
  }

  const promises = data.slides_ids.map((slideId) => {
    return printSlide(deckId, slideId);
  });

  await Promise.all(promises);
}
```

As you could notice, above we first fetch the deck and then map every single slides to a dedicated function to retrieve the related data.

```javascript
async printSlide(deckId, slideId) {
  const firestore = firebase.firestore();

  const snapshot = await firestore
      .collection(`/decks/${deckId}/slides`)
      .doc(slideId)
      .get();

  if (!snapshot.exists) {
    console.error('Slide not found');
    return;
  }

  const data = snapshot.data();

  console.log('Slide print', data.content);
}
```

It is also worth to notice, something I discovered recently, that it also offers some more flexibility in case you would be interested to develop a custom pagination. I won’t develop this topic in this particular article but if that would be interesting to you, ping me with a comment, I’ll be happy to develop this in a new blog post.

### Update Order

If retrieving costs more, the beauty of this solution is maybe the fact that updating the order doesn’t costs much, because the list of sorted data is contained in a single document and therefore a single update query on the indexed array is already enough to define the new order.

```javascript
async moveSlide(deckId, from, to) {
  const firestore = firebase.firestore();

  const snapshot = await firestore
      .collection('decks')
      .doc(deckId)
      .get();

  if (!snapshot.exists) {
    console.error('Deck not found');
    return;
  }

  const data = snapshot.data();

  if (!data.slides_ids || data.slides_ids.length <= 0) {
    console.error('No slides to move');
    return;
  }

  data.slides_ids.splice(to, 0, ...data.slides_ids.splice(from, 1));

  await firestore
      .collection('decks')
      .doc(deckId)
      .set(data, {merge: true});

  console.log('Deck updated');
}
```

In this particular example we don’t modify any other informations of the `slides` and that’s why I performed the update of the order from the client side but in the same way as I suggested in a previous chapter, if that would be the case, I would suggest to again defer such update in a cloud function.

### Epilogue

I'm honestly not sure my above explanations where that clear. I really wanted to share the subject because it is a feature's requirements I do face often when I implement applications.

I hope this will someday help someone and if you have any comments or ideas, ping me about it or maybe even better, create a presentation with our editor [DeckDeckGo](https://deckdeckgo.com) and don’t forget to try to order manually your slides 😉

To infinity and beyond 🚀

David
