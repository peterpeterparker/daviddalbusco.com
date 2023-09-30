---
path: "/blog/singleton-and-factory-patterns-with-typescript"
date: "2021-07-26"
title: "Singleton & Factory Patterns With TypeScript"
description: "The singleton and factory design pattern implemented with TypeScript, explained with a hairdresser and an ice creams shop examples."
tags: "#javascript #beginner #webdev #programming"
image: "https://cdn-images-1.medium.com/max/1600/1*0XVEe8Cqa9xFGveX8JLMxA.jpeg"
canonical: "https://daviddalbusco.medium.com/singleton-factory-patterns-with-typescript-59e5a405531e"
---

![](https://cdn-images-1.medium.com/max/1600/1*0XVEe8Cqa9xFGveX8JLMxA.jpeg)

_[Eisvogel](https://www.zentrale.ch/) — The best ice creams in Zürich_

Of all design patterns I learned in engineering school, the singleton and factory are probably those I use the most in my day to day programming activities. Sometimes I even mix the two to double the fun 😜.

In this blog post, I will show you how to implement these patterns with [TypeScript](https://www.typescriptlang.org/).

---

### Singleton

> In software engineering, the singleton pattern is a software design pattern that restricts the instantiation of a class to one “single” instance ([source](https://en.wikipedia.org/wiki/Singleton_pattern)).

A singleton is probably like your hairdresser. When you need an haircut, you do not want to go to a salon and get any new professional, even though she/he shares the same skills as yours but, you exactly want yours because she/he knows already your favorite settings ✂️.

Such a pattern can be implemented by defining the `constructor` of a `class` as `private`, making it de facto not accessible outside the class declaration, and by providing only one single instance of the object which have been made `static` .

```javascript
export class Hairdresser {
  private static instance: Hairdresser | undefined = undefined;

  private constructor() {}

  static getInstance(): Hairdresser {
    if (!Hairdresser.instance) {
      Hairdresser.instance = new Hairdresser();
    }

    return Hairdresser.instance;
  }
}
```

Using the above snippet, we are not able to get any new hairdresser. Trying to instantiate a new object lead to an error.

```javascript
// TS2673: Constructor of class 'Hairdresser' is private and only accessible within the class declaration.
const hairdresser: Hairdresser = new Hairdresser();
```

To the contrary, accessing the instance will always return the first object which has been initialized.

```javascript
const hairdresser: Hairdresser = Hairdresser.getInstance();
```

---

### Factory

> In class-based programming, the factory method pattern is a creational pattern that uses factory methods to deal with the problem of creating objects without having to specify the exact class of the object that will be created. This is done by creating objects by calling a factory method rather than by calling a constructor ([source](https://en.wikipedia.org/wiki/Factory_method_pattern)).

The factory pattern is like [Eisvogel](https://www.gaultmillau.ch/zuri-isst/eisvogel-das-beste-glace-zurich), my favorite and of course the best ice creams shop in Zürich. They sell artisanal yummy ice creams they manufacture on a daily basis with five new different flavors a day.

When you get there, you know you are going to get an ice cream but, you do not know which flavor.

In other words, you can use a factory to get objects that share an expected behavior but, which can be implemented differently.

First, it either needs an `interface` or an `abstract` class which describes the common behavior in addition to the effective implementation of the expected object which should be created by the factory.

With `interface` :

```javascript
export interface IceCream {
  yummy(): boolean;
}

export class Strawberry implements IceCream {
  yummy(): boolean {
    return true;
  }
}

export class Chocolate implements IceCream {
  yummy(): boolean {
    return true;
  }
}
```

With `abstract` (note: using the decorator `override`, newly introduced with TypeScript 4.3, that indicates a method overrides the parent definition):

```javascript
export abstract class IceCream {
  abstract yummy(): boolean;
}

export class Strawberry extends IceCream {
  override yummy(): boolean {
    return true;
  }
}

export class Chocolate extends IceCream {
  override yummy(): boolean {
    return true;
  }
}
```

Regardless of the above implementation, a related factory can be implemented. It can be in the form of a `static` method or a stateless `function`. The important thing is that depending on a parameter the desired implementation is created and returned.

With a `static` method:

```javascript
export class Factory {
  static getIceCream(): IceCream {
    return Math.random() % 2 === 0 ?
                new Strawberry() : new Chocolate();
  }
}
```

With a `function` :

```javascript
export const getIceCream = (): IceCream =>
  Math.random() % 2 === 0 ? new Strawberry() : new Chocolate();
```

I used a `random` number to create either one or the other type of object. In a real world applications, the variable is often either a parameter of the factory or another option.

Requesting an object through the `static` method or the `function` will return different objects.

```javascript
// Static method call
console.log(Factory.getIceCream().yummy());

// Function call
console.log(getIceCream().yummy());
```

---

### Combined

As I said in my introduction, sometimes I like to double the fun and combine the two patterns.

For example, in [DeckDeckGo](https://github.com/deckgo/deckdeckgo/), I developed such a concept to get different services according the environment (“local, staging or production”).

Applied to the above `IceCream` snippet, it would mean that the `factory` would need to keep track of the object created with a `singleton` .

```javascript
export class SingletonFactory {
  private static instance: IceCream | undefined = undefined;

  static getInstance(): IceCream {
    if (!this.instance) {
      this.instance =
        Math.random() % 2 === 0 ?
             new Strawberry() : new Chocolate();
    }

    return this.instance;
  }
}
```

---

### Summary

There are many [patterns](https://en.wikipedia.org/wiki/Software_design_pattern) but, these are those I use the most often. Next time I use another type, I should probably bookmark it, it might be worth a new article 😉.

Meanwhile, treat yourself with a yummy ice-cream of Eisvogel next time you visit Zürich 🍦.

To infinity and beyond!

David
