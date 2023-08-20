---
path: "/blog/json-parse-and-stringify-bigint-objects-and-uint8arrays"
date: "2023-08-20"
title: "JSON Parse And Stringify: BigInt, Objects and Uint8Arrays"
description: "Learn JSON Handling for BigInts, Objects, and Uint8Arrays with Replacer and Reviver. Discover parsing, stringify, and testing strategies."
tags: "#javascript #programming #webdev #json"
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*V4hY8EjtJ0jlbJw4l9R4tg.jpeg"
canonical: "https://daviddalbusco.medium.com/json-parse-and-stringify-bigint-objects-and-uint8arrays-e861a7b327c8"
---

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*V4hY8EjtJ0jlbJw4l9R4tg.jpeg)

Photo by [Aron Visuals](https://unsplash.com/fr/@aronvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/bZZp1PmHI0E?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

***

As I’ve been doing in various recent projects, you might find yourself needing to [stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) bigints, objects, or Uint8Arrays, which aren’t supported natively by these two functions.

Before exploring the solution, let’s identify the errors you might have come across, prompting you to read this article.

## BigInt

JSON finds widespread usage across various systems, and from my observation, introducing support for new types could potentially result in disruptive changes. This is why BigInts were probably omitted from the ECMAScript specification for [SerializeJSONProperty](https://tc39.es/ecma262/#sec-serializejsonproperty).

```javascript
const value = 123456n
JSON.stringify(value)

>> Uncaught TypeError: BigInt value can't be serialized in JSON
```

## Objects

While converting and parsing objects doesn’t inherently throw an error, stringifying and parsing will result in the loss of the objects’ functions. This can be inconvenient if your goal is to maintain the nature of the utilized class.

```javascript
class Dog {
  woof() {
        console.log('woof');
    }
}

const dog = new Dog()
dog.woof()

>> woof

const str = JSON.stringify(dog)

const result = JSON.parse(str)

result.woof()

>> Uncaught TypeError: result.woof is not a function
```

## Uint8Array

Encoding and decoding Uint8Array doesn’t throw errors either, but it also doesn’t recreate the expected types. Upon parsing, the result turns into an object instead of the anticipated array.

```javascript
const value = Uint8Array.from([1, 2, 3])

console.log(value)

>> Uint8Array(3) [ 1, 2, 3 ]

const str = JSON.stringify(value)

const result = JSON.parse(str)

console.log(result)

>> Object { 0: 1, 1: 2, 2: 3 }
```

## Approach

Dealing with serialization of BigInts can be addressed by implementing a solution known as [monkey patching](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description) (`BigInt.prototype.toJSON = ...`) to incorporate a `toJSON()` method within the type.

However, our approach in this solution differs, as we aim to address additional requirements and prefer to tackle all challenges using a unified method.

The solution involves utilizing the optional `replacer` and `reviver` functions of the JSON API to modify the behavior of the stringification and parsing processes.

The concept is to intercept the types we intend to enhance support for, and manually convert them into intermediary values that allow us to maintain the essence of the type while storing their values in objects distinguished by custom constants.

For instance, during the stringify process, when encountering a bigint, we transform it into an object such as `{ __bigint__: ‘123456’ }`.

Subsequently, during the parsing of the result, we revert these objects back to bigints if we identify them by their key, like so: if `typeof value === "object"` and `'__bigint__'` exists in `value`, then return `BigInt(value.__bigint__)`.

However, this approach comes with a caveat: the constant identifiers we employ to indicate the manually encoded and decoded types must not serve any other purpose within the objects. Otherwise, these identifiers would be subject to manual decoding. For instance, if an object were to include `{ __bigint__: 123456 }`, the parsed value would not be a number but a bigint. Hence, I recommend utilizing highly distinctive keys and, if required, implementing additional checks within the application.

## Solution

Long story short, here’s the parse I use to stringify and parse BigInts, particulary objects and Uint8Array:

```typescript
const JSON_KEY_BIGINT = "__bigint__";
const JSON_KEY_MyObject = "__MyObject__";
const JSON_KEY_UINT8ARRAY = "__uint8array__";

// An inlined utilise to check for null and undefined
export const nonNullish = <T>(
  argument: T | undefined | null,
): argument is NonNullable<T> => argument !== null && argument !== undefined;

// An object for showcase purpose
export class MyObject {
  constructor(public value: string) {
  }
  
  toText(): string {
    return this.value
  }
  
  static fromText(value: string): MyObject {
    // This is used to recreate the object from its textual representation.
    return new MyObject(value)
  }
}

// The parser that interprets revived BigInt, MyObject, and Uint8Array when constructing JavaScript values or objects.
export const jsonReplacer = (_key: string, value: unknown): unknown => {
  if (typeof value === "bigint") {
    return { [JSON_KEY_BIGINT]: `${value}` };
  }

  if (nonNullish(value) && value instanceof MyObject) {
    return { [JSON_KEY_MyObject]: value.toText() };
  }

  if (nonNullish(value) && value instanceof Uint8Array) {
    return { [JSON_KEY_UINT8ARRAY]: Array.from(value) };
  }

  return value;
};

// A function that alters the behavior of the stringification process for BigInt, MyObject and Uint8Array.
export const jsonReviver = (_key: string, value: unknown): unknown => {
  const mapValue = <T>(key: string): T => (value as Record<string, T>)[key];

  if (
    nonNullish(value) &&
    typeof value === "object" &&
    JSON_KEY_BIGINT in value
  ) {
    return BigInt(mapValue(JSON_KEY_BIGINT));
  }

  if (
    nonNullish(value) &&
    typeof value === "object" &&
    JSON_KEY_MyObject in value
  ) {
    return MyObject.fromText(mapValue(JSON_KEY_MyObject));
  }

  if (
    nonNullish(value) &&
    typeof value === "object" &&
    JSON_KEY_UINT8ARRAY in value
  ) {
    return Uint8Array.from(mapValue(JSON_KEY_UINT8ARRAY));
  }

  return value;
};
```

The `jsonReplacer` and `jsonReviver` can now be integrated into your application's code for the purpose of stringifying and replacing your intricate objects.

```javascript
const str = JSON.stringify(yourObject, jsonReplacer);
const result = JSON.parse(str, jsonReviver);
```

## Tests

For additional examples and to maintain the solution, presented below are a few tests developed using Jest:

```typescript
import { jsonReplacer, jsonReviver, MyObject } from "./json.utils";

describe("json-utils", () => {
  describe("stringify", () => {
    it("should stringify bigint with a custom representation", () => {
      expect(JSON.stringify(123n, jsonReplacer)).toEqual(
        '{"__bigint__":"123"}',
      );
      expect(JSON.stringify({ value: 123n }, jsonReplacer)).toEqual(
        '{"value":{"__bigint__":"123"}}',
      );
    });

    it("should stringify MyObject with a custom representation", () => {
      const obj = new MyObject("hello");

      expect(JSON.stringify(obj, jsonReplacer)).toEqual(
        '{"__MyObject__":"hello"}',
      );
      expect(JSON.stringify({ obj }, jsonReplacer)).toEqual(
        '{"obj":{"__MyObject__":"hello"}}',
      );
    });

    it("should stringify Uint8Array with a custom representation", () => {
      const arr = Uint8Array.from([1, 2, 3]);

      expect(JSON.stringify(arr, jsonReplacer)).toEqual(
        '{"__uint8array__":[1,2,3]}',
      );
      expect(JSON.stringify({ arr }, jsonReplacer)).toEqual(
        '{"arr":{"__uint8array__":[1,2,3]}}',
      );
    });
  });

  describe("parse", () => {
    it("should parse bigint from a custom representation", () => {
      expect(JSON.parse('{"__bigint__":"123"}', jsonReviver)).toEqual(123n);
      expect(JSON.parse('{"value":{"__bigint__":"123"}}', jsonReviver)).toEqual(
        { value: 123n },
      );
    });

    it("should parse principal from a custom representation", () => {
      const obj = new MyObject("hello");

      expect(JSON.parse('{"__MyObject__":"hello"}', jsonReviver)).toEqual(obj);
      expect(
        JSON.parse('{"obj":{"__MyObject__":"hello"}}', jsonReviver),
      ).toEqual({ obj });
    });

    it("should parse principal to object", () => {
      const obj = JSON.parse(
        '{"__MyObject__":"tmxop-wyaaa-aaaaa-aaapa-cai"}',
        jsonReviver,
      );
      expect(obj instanceof MyObject).toBeTruthy();
      expect((obj as MyObject).toText()).toEqual("tmxop-wyaaa-aaaaa-aaapa-cai");
    });

    it("should parse Uint8Array from a custom representation", () => {
      const arr = Uint8Array.from([1, 2, 3]);

      expect(JSON.parse('{"__uint8array__":[1,2,3]}', jsonReviver)).toEqual(
        arr,
      );
      expect(
        JSON.parse('{"arr":{"__uint8array__":[1,2,3]}}', jsonReviver),
      ).toEqual({ arr });
    });
  });
});
```

Thank you for reading! Follow me on [Twitter / X](https://twitter.com/daviddalbusco) for more exciting coding content.

David
