---
path: "/blog/typescript-utilities-for-candid"
date: "2021-11-16"
title: "TypeScript Utilities For Candid"
description: "A collection of functions to handle Nullable, Date and Blob when interacting with canister smart contracts."
tags: "#typescript #blockchain #motoko #javascript"
image: "https://cdn-images-1.medium.com/max/2400/1*-zlHKiCIag6cmR5WO2Z_RQ.jpeg"
canonical: "https://daviddalbusco.medium.com/typescript-utilities-for-candid-bf5bdd92a9a3"
---

![](https://cdn-images-1.medium.com/max/2400/1*-zlHKiCIag6cmR5WO2Z_RQ.jpeg)

*Photo by [Georgie Cobbs](https://unsplash.com/@georgie_cobbs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*


*****

To port our web editor, [DeckDeckGo](https://deckdeckgo.com/), to [DFINITY](https://dfinity.org/)’s Internet Computer I developed several helpers in TypeScript to interact with our canister smart contracts.

If it can make your life easier too, here are those I use the most.

*****

### Nullable

The [Candid](https://smartcontracts.org/docs/candid-guide/candid-concepts.html) description that is generated for nullable types does not exactly match what I commonly used in JavaScript for optional types (see this [post](https://forum.dfinity.org/t/candid-code-generation-for-nullable-types/6820) for the why and how).

For example, if we generate an interface for such a [Motoko](https://smartcontracts.org/docs/language-guide/motoko.html) code snippet:

```
actor Example {
  public shared query func list(filter: ?Text) : async [Text] {
    let results: [Text] = myFunction(filter);
    return results;
  };
}
```

The definition of the optional parameter `filter` will not be interpreted as a `string` that can potentially be `undefined` but, rather as a one-element length `array` that contains a `string` or is empty.

```javascript
export interface _SERVICE {
  list: (arg_0: [] | [string]) => Promise<Array<string>>;
}
```

That is why I created functions to convert back and forth optional values.

```javascript
export const toNullable = <T>(value?: T): [] | [T] => {
  return value ? [value] : [];
};

export const fromNullable = <T>(value: [] | [T]): T | undefined => {
  return value?.[0];
};
```

`toNullable` convert an object that can either be of type `T` or `undefined` to what’s expected to interact with the IC and, `fromNullable` do the opposite.

*****

### Dates

System [Time](https://smartcontracts.org/docs/base-libraries/Time.html) (nanoseconds since 1970–01–01) gets parsed to `bigint` and exported as a type `Time` in Candid definition.

```javascript
export type Time = bigint;
```

To convert JavaScript `Date` to big numbers, the built-in object [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) can be instantiated.

```javascript
export const toTimestamp = (value: Date): Time => {
  return BigInt(value.getTime());
};
```

The other way around works by converting first the big numbers to their primitive [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) types.

```javascript
export const fromTimestamp = (value: Time): Date => {
  return new Date(Number(value));
};
```

To support `Nullable` timestamps values, I also created the following helpers that extend above converters and return the appropriate optional arrays.

```javascript
export const toNullableTimestamp = (value?: Date): [] | [Time] => {
  const time: number | undefined = value?.getTime();
  return value && !isNaN(time) ? [toTimestamp(value)] : [];
};

export const fromNullableTimestamp = 
       (value?: [] | [Time]): Date | undefined => {
  return !isNaN(parseInt(`${value?.[0]}`)) ? 
            new Date(`${value[0]}`) : undefined;
};
```

*****

### Blob

Binary [blobs](https://smartcontracts.org/docs/base-libraries/Blob.html) are described in Candid as `Array` of  `numbers`. To save untyped data in smart contracts (assuming the use case allows such risk) while still preserving types on the frontend side, we can `stringify` objects, converts these to blobs and gets their contents as binary data contained in an `ArrayBuffer`.

```javascript
export const toArray = 
       async <T>(data: T): Promise<Array<number>> => {
  const blob: Blob = new Blob([JSON.stringify(data)], 
                         {type: 'application/json; charset=utf-8'});
  return [...new Uint8Array(await blob.arrayBuffer())];
};
```

To convert back an `Array` of `numbers` to a specific object type, the [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) type can be used again but, this time a textual conversion shall be used to parse the results.

```javascript
export const fromArray = 
       async <T>(data: Array<number>): Promise<T> => {
  const blob: Blob = new Blob([new Uint8Array(data)], 
                         {type: 'application/json; charset=utf-8'});
  return JSON.parse(await blob.text());
};
```

Both conversions are asynchronous because interacting with the blob object requires resolving promises in JavaScript.

*****

### Further Reading

Wanna read more our project? Here is the list of blog posts I published since we started the project with the Internet Computer:

* [Bye-Bye Amazon & Google, Hello Web 3.0](https://daviddalbusco.com/blog/bye-bye-amazon-and-google-hello-web-3-0)
* [Dynamically Import ESM Modules From A CDN](https://daviddalbusco.com/blog/dynamically-import-esm-modules-from-a-cdn)
* [Internet Computer: Web App Decentralized Database Architecture](https://daviddalbusco.com/blog/internet-computer-web-app-decentralized-database-architecture)
* [Singleton & Factory Patterns With TypeScript](https://daviddalbusco.com/blog/singleton-and-factory-patterns-with-typescript)
* [Hosting on the Internet Computer](https://daviddalbusco.com/blog/getting-started-with-the-internet-computer-web-hosting)
* [We Received A Grant To Port Our Web App To The Internet Computer](https://daviddalbusco.com/blog/we-received-a-grant-to-port-our-web-app-to-the-internet-computer)

*****

### Keep In Touch

To follow our adventure, you can star and watch our [GitHub repo](https://github.com/deckgo/deckdeckgo) ⭐️ and [sign up](https://eepurl.com/hKeMLD) to join the list of beta tester.

*****

### Conclusion

I hope this short blog post and few utilities will be useful for you to start well with the Internet Computer, it is really a fun technology.

To infinity and beyond!

David
