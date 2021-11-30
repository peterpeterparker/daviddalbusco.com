---
path: "/blog/a-simple-keyval-store-implemented-in-motoko"
date: "2021-11-30"
title: "A Simple KeyVal Store Implemented in Motoko"
description: "Build a generic keyval store for canister smart contract on the Internet Computer."
tags: "#motoko #blockchain #web3 #dapp"
image: "https://cdn-images-1.medium.com/max/1600/1*TtIqarWb4Sbvh2lntKUlHg.jpeg"
canonical: "https://daviddalbusco.medium.com/a-simple-keyval-store-implemented-in-motoko-f8ba5af43618"
---

![](https://cdn-images-1.medium.com/max/1600/1*TtIqarWb4Sbvh2lntKUlHg.jpeg)

*Photo by [Pedro Lastra](https://unsplash.com/@peterlaster?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

*****

I am a fond of offline web applications and most of my personal open source projects, such as [DeckDeckGo](http://deckdeckgo.com/) or [Tie Tracker](https://tietracker.app.link/), follow the approach.

In these two particular apps, I use [idb-keyval](https://github.com/jakearchibald/idb-keyval) to ease the interaction with IndexedDB through a keyval-like API.

That’s why, in the last iteration of our migration to the [DFINITY](https://dfinity.org/)’s Internet Computer, I developed a generic store for canister smart contract in [Motoko](https://smartcontracts.org/docs/language-guide/motoko.html) that also maintain data with key and values.

*****

### Store

My goal is to be able to reuse the same store across canisters and projects, multiple times. If one of my actor would contain different types of data, for example cars and vegetables, I would like to re-use the same helper that encapsulates the data and exposes functions such as: `put`, `get`, `delete` and `list`.

Therefore, the store I developed is nothing less than a generic class that uses a [HashMap](https://sdk.dfinity.org/docs/base-libraries/hashmap) for the persistence with textual keys (type [Text](https://smartcontracts.org/docs/base-libraries/Text.html)).

```javascript
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

module {
    public class DataStore<T>() {
        private var data: HashMap.HashMap<Text, T> = 
                HashMap.HashMap<Text, T>(10, Text.equal, Text.hash);
    }
}
```

*****

### Put, Get & Delete

Functions that modifies the state are basically applying changes directly to the `HashMap` except the deletion operation, which I extended with a `getter`, even though a `delete` does not do anything if the key does not exist. I thought occasionally it can be interesting to get back the value of the key that has been deleted.

```javascript
public func put(key: Text, value: T) {
    data.put(key, value);
};

public func get(key: Text): ?T {
    return data.get(key);
};

public func del(key: Text): ?T {
    let entry: ?T = get(key);

    switch (entry) {
        case (?entry) {
            data.delete(key);
        };
        case (null) {};
    };

    return entry;
};
```

*****

### List

Getting a list of all entries of the store would also not be much more than querying the `HashMap` directly if it were not for the possibility of filtering the data. Indeed, it might be interesting to search only keys that start with or contain a particular prefix.

I firstly defined a new type `DataFilter` for the filter and implemented the effective filtering functions that acknowledge the optional nature of these options.

```javascript
public type DataFilter = {
    startsWith: ?Text;
    contains: ?Text;
};

private func keyStartsWith(key: Text, startsWith: ?Text): Bool {
    switch (startsWith) {
        case null {
            return true;
        };
        case (?startsWith) {
            return Text.startsWith(key, #text startsWith);
        };
    };
};

private func keyContains(key: Text, contains: ?Text): Bool {
    switch (contains) {
        case null {
            return true;
        };
        case (?contains) {
            return Text.contains(key, #text contains);
        };
    };
};
```

The above functions are returning `true` if no filters are defined, assuming `undefined` means “ignore the option”. There is probably a better way of  implementing such condition in Motoko but, I am not yet as fluid in it as I am with others languages such as TypeScript. If you are up to improve the solution, go for it, send me a [Pull Request](https://github.com/deckgo/deckdeckgo/blob/main/canisters/src/data/data.filter.mo)!

Finally, I implemented the `list` function itself that either returns all entries or applies the filter following an `and` logic.

```javascript
public func list(filter: ?DataFilter): [(Text, T)] {
    let entries: Iter.Iter<(Text, T)> = data.entries();

    switch (filter) {
        case null {
            return Iter.toArray(entries);
        };
        case (?filter) {
            let keyValues: [(Text, T)] = Iter.toArray(entries);

            let {startsWith; contains} = filter;

            let values: [(Text, T)] = 
                        Array.mapFilter<(Text, T), (Text, T)>
            (keyValues, func ((key: Text, value: T)) : ?(Text, T) {
                if (keyStartsWith(key, startsWith) and 
                    keyContains(key, contains)) {
                    return ?(key, value);
                };

                return null;
            });

            return values;
        };
    };
};
```

*****

### Upgrades

To preserve the state of the canisters on upgrades, [preupgrade and postupgrade](https://smartcontracts.org/docs/language-guide/upgrades.html#_preupgrade_and_postupgrade_system_methods) system hooks can be implemented for variable that are not stable per default. To foresee such process, I also added two final functions to the store.

```javascript
public func preupgrade(): HashMap.HashMap<Text, T> {
    return data;
};

public func postupgrade(stableData: [(Text, T)]) {
    data := HashMap.fromIter<Text, T>(stableData.vals(), 10, Text.equal, Text.hash);
};
```


*****

### Usage

To showcase the usage of such generic store in an actor, we create an empty canister that defines a type of object to store, such as a `Car` .

We `import` the helper and declare both the objects we are going to use. The `store` itself and a stable `entries` to maintain the state on upgrades.

```javascript
import Iter "mo:base/Iter";

import DataStore "./store";

actor Test {

    type Car = {
        name: Text;
        manufacturer: Text;
    };

    private let store: DataStore.DataStore<Car> = 
                       DataStore.DataStore<Car>();

    private stable var entries : [(Text, Car)] = [];

    system func preupgrade() {
        entries := Iter.toArray(store.preupgrade().entries());
    };

    system func postupgrade() {
        store.postupgrade(entries);
        entries := [];
    };
};
```

Once these defined, we expose the functions that modify the state and link these with the store.

```javascript
public query func get(key: Text) : async (?Car) {
    let entry: ?Car = store.get(key);
    return entry;
};

public func set(key: Text, data: Car) : async () {
    store.put(key, data);
};

public func del(key: Text) : async () {
    let entry: ?Car = store.del(key);
};
```

Finally, we plug the last bit of code, the function that lists and filters the entries.

```javascript
public query func get(key: Text) : async (?Car) {
    let entry: ?Car = store.get(key);
    return entry;
};
```

Et voilà, with few lines of code, we have implemented a simple keyval canister smart contract that store our data 🥳.

*****

### Playground

Wanna play with the previous example and store? Checkout this [Motoko Playground](https://m7sm4-2iaaa-aaaab-qabra-cai.raw.ic0.app/?tag=1517752901) and have fun 🤙.

![](https://cdn-images-1.medium.com/max/1600/1*CgTzjuNqFv3mr1IpCZsPgw.png)

*****

### Further Reading

Wanna read more our project? Here is the list of blog posts I published since we started the project with the Internet Computer:

* [TypeScript Utilities For Candid](https://daviddalbusco.com/blog/typescript-utilities-for-candid)
* [Bye-Bye Amazon & Google, Hello Web 3.0](https://daviddalbusco.com/blog/bye-bye-amazon-and-google-hello-web-3-0)
* [Dynamically Import ESM Modules From A CDN](https://daviddalbusco.com/blog/dynamically-import-esm-modules-from-a-cdn)
* [Internet Computer: Web App Decentralized Database Architecture](https://daviddalbusco.com/blog/internet-computer-web-app-decentralized-database-architecture)
* [Singleton & Factory Patterns With TypeScript](https://daviddalbusco.com/blog/singleton-and-factory-patterns-with-typescript)
* [Hosting on the Internet Computer](https://daviddalbusco.com/blog/getting-started-with-the-internet-computer-web-hosting)
* [We Received A Grant To Port Our Web App To The Internet Computer](https://daviddalbusco.com/blog/we-received-a-grant-to-port-our-web-app-to-the-internet-computer)

*****

### Keep In Touch

To follow our adventure, you can star and watch our [GitHub repo](https://github.com/deckgo/deckdeckgo) ⭐️ and [sign up](http://eepurl.com/hKeMLD) to join the list of beta tester.

*****

### Conclusion

There might be a better way to implement the filtering options and, not sure such the architecture is the state of the art (do other Motoko developers create stores next to their canisters?).

However, it fits very well my projects and, as I am still learning, it can only be improved within time because I am porting our web editor to [DFINITY](https://dfinity.org/)’s Internet Computer and do not intend to stop soon.

To infinity and beyond!

David
