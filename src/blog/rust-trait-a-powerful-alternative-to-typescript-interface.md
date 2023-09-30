---
path: "/blog/rust-trait-a-powerful-alternative-to-typescript-interface"
date: "2023-03-06"
title: "Rust Trait: A Powerful Alternative To TypeScript Interface"
description: "Comparing TypeScript “interface” with Rust “trait” for simple, flexible, and composable code."
tags: "#rust #typescript #programming #webdev"
image: "https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxfHxHcmFkaWVudHxlbnwwfHx8fDE2NzgwMzYwNDI&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://medium.com/@daviddalbusco/rust-trait-a-powerful-alternative-to-typescript-interface-e671cd7f9690"
---

![Distorted Sun](https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxfHxHcmFkaWVudHxlbnwwfHx8fDE2NzgwMzYwNDI&ixlib=rb-4.0.3&q=80&w=1080)

_Photo by [Gradienta](https://unsplash.com/pt-br/@gradienta?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

While Rust has a concept of interface, it differs from other programming languages in that it does not use the `interface` keyword to specify the behavior of classes and functions. Instead, Rust’s closest abstraction pattern is `trait`. Although these concepts have many differences, they both address the problem of having multiple possible implementations.

In this blog post, I will compare a TypeScript code snippet with its potential Rust equivalent to demonstrate how to achieve a simple flexible and composable code.

---

## Declaration

Let’s imagine a project that involves saving and listing documents and images in a database. Since both types of files are stored in the same storage and share common characteristics, we could use an `interface` to share this common information.

Using an interface would allow us to define a set of properties and methods that are common, making it easier to write code that works with either type of file.

In TypeScript, we can define this interface as follows:

```typescript
interface Entity {
	id: string;
	timestamp: number;
}

interface Document extends Entity {
	revised: boolean;
}

interface Image extends Entity {
	type: string;
}
```

Since Rust does not have inheritance, the simplest corresponding implementation would require us to duplicate the types.

```rust
struct Document {
    id: String,
    timestamp: u64,
    revised: bool,
}

struct Image {
    id: String,
    timestamp: u64,
    mime_type: String,
}
```

---

## Inheritance and Generic

Let’s now consider a scenario where we want to find a specific document or image. In TypeScript, we can write the code to accomplish this as follows:

```typescript
const getDocument = (id: string, documents: Document[]): Document | undefined =>
	documents.find(({ id: docId }) => docId === id);

const getImages = (id: string, images: Image[]): Image | undefined =>
	images.find(({ id: imageId }) => imageId === id);
```

However, since both types implement the same interface, we can avoid duplication by extracting a generic function:

```typescript
const get = <T extends Entity>(id: string, elements: T[]): T | undefined =>
	elements.find(({ id: elementId }) => elementId === id);

const getDocument = (id: string, documents: Document[]): Document | undefined =>
	get<Document>(id, documents);

const getImages = (id: string, images: Image[]): Image | undefined => get<Image>(id, images);
```

In Rust, implementing the same functionality would initially also require duplicating the code:

```rust
fn get_document(id: String, documents: Vec<Document>) -> Option<Document> {
    documents.into_iter().find(|document| document.id == id)
}

fn get_image(id: String, images: Vec<Image>) -> Option<Image> {
    images.into_iter().find(|image| image.id == id)
}
```

As you can see, the Rust code closely resembles the TypeScript implementation. However, since Rust does not have inheritance or an `interface` keyword, we cannot exactly replicate the same pattern as above to avoid duplication. This is where `trait` come into play.

In this particular example, the common trait shared by both documents and images is that they can be compared using IDs. This is why we can declare this characteristic as a `trait` and provide a respective implementation for both ```
struct.

```rust
trait Compare {
    fn compare(&self, id: &str) -> bool;
}

impl Compare for Document {
    fn compare(&self, id: &str) -> bool {
        self.id == id
    }
}

impl Compare for Image {
    fn compare(&self, id: &str) -> bool {
        self.id == id
    }
}
```

Finally, we can extract the common code to a generic function in Rust, just as we did earlier in TypeScript.

```rust
fn get<T: Compare>(id: String, elements: Vec<T>) -> Option<T> {
    elements.into_iter().find(|element| element.compare(&id))
}

fn get_document(id: String, documents: Vec<Document>) -> Option<Document> {
    get(id, documents)
}

fn get_image(id: String, images: Vec<Image>) -> Option<Image> {
    get(id, images)
}
```

It’s worth noting that `trait` in Rust can be combined using the “+” symbol, allowing us to define multiple common characteristics. For example:

```rust
fn get<T: Compare + OtherTrait>(id: String, elements: Vec<T>) -> Option<T> {
    elements
        .into_iter()
        .find(|element| element.compare(&id) && element.other_trait(&id))
}
```

Such pattern is also interesting to implement comparison of objects, as both parameter of the `trait` function can related to the same struct.

```rust
trait Compare {
    fn sort(&self, other: &Self) -> Ordering;
}

impl Compare for Document {
    fn sort(&self, other: &Self) -> Ordering {
        self.timestamp.cmp(&other.timestamp)
    }
}
```

---

## Conclusion

While we have only scratched the surface of the power that `trait` can offer, I hope that this brief tutorial will prove useful to my fellow JavaScript developers who, like me, are exploring Rust.

To infinity and beyond  
David
