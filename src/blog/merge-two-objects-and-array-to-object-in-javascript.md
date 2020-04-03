---
path: "/blog/merge-two-objects-and-array-to-object-in-javascript"
date: "2020-04-02"
title: "Merge Two Objects And Array To Object In JavaScript"
description: "How two merge two objects or transform an array into an object in JavaScript"
tags: "#javascript #codenewbie #beginners #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*RqxfxRKtnHkUdmbpCFhxSA.png"
canonical: "https://medium.com/@david.dalbusco/merge-two-objects-and-array-to-object-in-javascript-79580583727a"
---

![](https://cdn-images-1.medium.com/max/1600/1*RqxfxRKtnHkUdmbpCFhxSA.png)

*Photo by [Ludovic Migneault](https://unsplash.com/@dargonesti?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Seventeen** days left until hopefully better days.

*****

To be really honest with you, I did not had that much idea for today’s blog post. For my defense, this is the eighteenth blog post I write every day in a row, it might explains my lack of today’s inspiration 😅.

That being said, I will share with you the following two tricks which I find useful.

*****

### Merge Two Objects

Thanks to the introduction of [Spread Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) in ES6, it is now more than ever before really easy to merge two objects. No more loops, comparison or rocket science, the merge operation can be written in a single line of code.

It is also worth to notice that in case both objects would contain the same key, the value of the last object, “the one on the right in the line of code”, is the winning value.

```javascript
const bruno = {
  sing: true,
  song: 'Treasure'
};

const ratm = {
  type: 'band',
  song: 'Bombtrack'
};

const result = {...bruno, ...ratm};

console.log(result);

// -> {sing: true, song: "Bombtrack", type: "band"}
```

*****

### Array To Object

In order to transform an array to an object in JavaScript, I did not find so far the magic line of code which would do all the job in one single line of code. If you do know how to achieve this, ping me with your comments and best pieces of code, I would love to hear about it 😁.

Meanwhile, I use the [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) function. Fun fact, that’s probably one of the few times that I am using it. I use often `forEach` , `map` , `filter` and `find` but `reduce` , truly rarely.

```javascript
// {name: string, genre: string}[]
const bands = [
  {
    name: 'Ratm',
    genre: 'rock'
  },
  {
    name: 'Bruno',
    genre: 'Pop'
  }
];

// {ratm: string, bruno: string}
const artists = bands.reduce(
  (obj, item) => {
    obj[item.name] = item.genre;
    return obj;
  },
  {});

console.log(artists);

// {Ratm: "rock", Bruno: "Pop"}
```

*****

### Summary

It is interesting to notice that the more the language evolves, the more basic operations become easy to implement with few lines of code. Also interesting is the fact that sometimes it takes time to these new options to be rolled out to me. ES6 has been around for a while and I am still writing about it in 2020 😉.

Stay home, stay safe!

David
