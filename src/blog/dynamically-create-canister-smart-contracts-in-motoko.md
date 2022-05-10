---
path: "/blog/dynamically-create-canister-smart-contracts-in-motoko"
date: "2022-05-10"
title: "Dynamically Create Canister Smart Contracts In Motoko"
description: "How to generate on-the-fly decentralized smart contracts on the Internet Computer."
tags: "#blockchain #programming #web3 #javascript"
image: "https://miro.medium.com/max/1400/1*0aVC6yVZLehL990fUJDazw.png"
canonical: "https://medium.com/dfinity/dynamically-create-canister-smart-contracts-in-motoko-d3b38a748c07"
---
![](https://miro.medium.com/max/1400/1*0aVC6yVZLehL990fUJDazw.png)

* * *

In one of my last [blog posts](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/call-internet-computer-canister-smart-contracts-in-nodejs) I shared a solution to query smart contracts on [Internet Computer](https://smartcontracts.org/) in a NodeJS context.

This article was the first of a series that will display the various scripts I have developed for new project [Papyrs](https://papy.rs) - an open-source, privacy-first, decentralized blogging platform that lives 100% on chain.

I notably plan to share how I query remaining cycles and update the code of my users' canisters.

However, it might be a good idea for me to share first the basis of the architecture - i.e. to demonstrate the code which allow a program to dynamically create canisters.

* * *

## Architecture

Unlike web2 projects which centralize the data of the users in a single - or distributed - database, I adopted a more futuristic approach for the data persistence of Papyrs.

A main actor acts as a a manager that — on the fly, upon object creation — generates a decentralized secure simple key-value database-like for each single data persistence of each user.

![manager-buckets.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/manager-buckets.png?token=CS-cusHrUKnmwvP6TDNpy)



In following chapters I introduce such a solution with a sample project developed in [Motoko](https://github.com/dfinity/motoko).

*For more details about this architecture you can read the article I wrote about it: [Internet Computer: Web App Decentralized Database Architecture](https://daviddalbusco.com/blog/internet-computer-web-app-decentralized-database-architecture).*

* * *

## Bucket

Each user gets a dedicated smart contract canister which I name a `bucket` to follow the convention of the actor classes example provided by DFINITY on [GitHub](https://github.com/dfinity/examples/tree/master/motoko/classes). On the [forum](https://forum.dfinity.org/) it might sometimes also be referenced as "child" canister.

For demo purposes I thought such a bucket - an `actor` - could expose a function that `say` hello. Furthermore, to anticipate my future writings as well, it also receives a `user` as parameter and contains a non stable `version` number that could be incremented each time a new canister's code is installed.

Note that I use a `Text` type for the user only to simplify the sample. In a real use case I would use a `Principal`.

```javascript
import Nat "mo:base/Nat";

actor class Bucket(user: Text) = this {

    var version: Nat = 1;

    public query func say() : async Text {
      return "Hello World - " # user # " - v" # Nat.toText(version);
    };

}

```

* * *

## Manager

The manager - or `Main` actor - contains more logic, so I will break it down into steps before presenting it in its entirety.

As mentioned before, it creates dynamically canisters. Therefore it can or should - depends of the use case - keep track of those that have been created - e.g. by stacking the canister ID that have been created within an `Hashmap`.

However, once again for simplicity reason, in this article I only keep track of the last smart contract that has been initialized with the help of a stable variable `canisterId`.

```javascript
actor Main {
  private stable var canisterId: ?Principal = null;

  public query func getCanisterId() : async ?Principal {
    canisterId
  };
};

```

* * *

To create a new canister we mainly need two things:

*   the bucket - i.e. the actor of previous chapter
*   the cycles [library](https://smartcontracts.org/docs/current/references/motoko-ref/experimentalcycles)

Because we implement the code of the bucket in the same project we can include it with a relative import path. Each call to `Bucket.Bucket(param)` instantiate a new bucket - i.e. dynamically creates a new smart contract canister.

The library is used to share the manager's cycles amongst the bucket it creates. The related computational costs is 100,000,000,000 - i.e. around $0.142 according [documentation](https://smartcontracts.org/docs/current/developer-docs/updates/computation-and-storage-costs).

```javascript
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Error "mo:base/Error";

import Bucket "./bucket";

actor Main {
  private stable var canisterId: ?Principal = null;

  public shared({ caller }) func init(): async (Principal) {
    Cycles.add(1_000_000_000_000);

    let b = await Bucket.Bucket("User1");

    canisterId := ?(Principal.fromActor(b));

    switch (canisterId) {
      case null {
        throw Error.reject("Bucket init error");
      };
      case (?canisterId) {
        return canisterId;
      };
    };
  };

  public query func getCanisterId() : async ?Principal {
    canisterId
  };
};
```

* * *

While this might be the end of the story, I would like to add another piece to the puzzle.

Indeed it might be interesting to set the controllers that can modify the bucket - e.g. it might be interesting to allow your principal and/or the one of the manager to update the code of the canisters.

For such purpose, we first need to add the specification of the Internet Computer to the project in form of a new Motoko `module`. You can either convert the [candid](https://github.com/dfinity/interface-spec/blob/master/spec/ic.did) file or grab the one I used in Papyrs ([source](https://github.com/papyrs/ic/blob/main/canisters/src/types/ic.types.mo)).

Finally, we can declare a variable that will be used to call the IC management canister address (`aaaaa-aa`) and use it to effectively update the settings of the newly created canister.

```javascript
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Error "mo:base/Error";

import IC "./ic.types";

import Bucket "./bucket";

actor Main {
  private stable var canisterId: ?Principal = null;

  private let ic : IC.Self = actor "aaaaa-aa";

  public shared({ caller }) func init(): async (Principal) {
    Cycles.add(1_000_000_000_000);
    let b = await Bucket.Bucket("User1");

    canisterId := ?(Principal.fromActor(b));

    switch (canisterId) {
      case null {
        throw Error.reject("Bucket init error");
      };
      case (?canisterId) {
        let self: Principal = Principal.fromActor(Main);

        let controllers: ?[Principal] = ?[canisterId, caller, self];

        await ic.update_settings(({canister_id = canisterId; settings = {
            controllers = controllers;
            freezing_threshold = null;
            memory_allocation = null;
            compute_allocation = null;
        }}));

        return canisterId;
      };
    };
  };

  public query func getCanisterId() : async ?Principal {
    canisterId
  };
};

```

* * *

## Web Application

The two canister smart contracts being implemented, we can develop a dummy frontend to tests their functionalities. It can contain two actions: one to create a bucket and another one to call it - i.e. to call its function `say`.

```html
<html lang="en">
  <body>
    <main>
      <button id="init">Init</button>

      <button id="say">Say</button>
    </main>
  </body>
</html>
```

* * *

If you ever created a sample project with the [dfx](https://smartcontracts.org/docs/current/references/cli-reference/dfx-parent/) command line, following will feel familiar.

I created a project named `buckets\_sample`. Dfx automatically installs the dependencies and a function that exposes the `main` actor. Therefore the JavaScript function that calls the manager to instantiate a new canister uses these pre-made methods. I also save the bucket - the principal id of the last canister that is created - in a global variable for reuse purpose.

```javascript
import { buckets_sample } from '../../declarations/buckets_sample';

let bucket;

const initCanister = async () => {
  try {
    bucket = await buckets_sample.init();
    console.log('New bucket:', bucket.toText());
  } catch (err) {
    console.error(err);
  }
};

const init = () => {
  const btnInit = document.querySelector('button#init');
  btnInit.addEventListener('click', initCanister);
};

document.addEventListener('DOMContentLoaded', init);

```

* * *

On the contrary, the process that creates a new sample project is not aware that we want to dynamically create canisters. That is why we have to generate the candid interfaces and related JavaScript code for the bucket we have coded previously.

[Currently](https://forum.dfinity.org/t/how-do-i-upgrade-child-canisters-that-were-dynamically-created-from-a-parent-canister-of-which-i-am-the-controlller-in-motoko/12289/27?u=peterparker) there is no other way to generate these files than the following workaround:

1\. Edit the configuration `dfx.json` to list the bucket actor

```jsonp
"canisters": {
    "buckets_sample": {
      "main": "src/buckets_sample/main.mo",
      "type": "motoko"
    },
    "bucket": { <----- add an entry for the bucket
      "main": "src/buckets_sample/bucket.mo",
      "type": "motoko"
    },
```

2\. Run the `dfx deploy` command to generate the files. The command will end in error ("Error: Invalid data: Expected arguments but found none.") that can safely be ignored 😉.

3\. Revert the change in `dfx.json`

4\. Copy the generated files to the source folder so that we can use them in the web application

```bash
rsync -av .dfx/local/canisters/bucket ./src/declarations --exclude=bucket.wasm
```

A bit of mumbo jumbo but that does the trick 😁.

Thanks the newly generated declaration files, we can create a custom function that instantiate an actor for the bucket - canister ID - we generate on the fly.

```javascript
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/bucket';

export const createBucketActor = async ({ canisterId }) => {
  const agent = new HttpAgent();

  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
};
```

Note in above snippet how I explicitly `import` another `idlFactory`, the one that matches the definition of the bucket.

We can finally implement the code that calls the `say` function which also ends the development of the demo application.

```javascript
import { Actor, HttpAgent } from '@dfinity/agent';
import { buckets_sample } from '../../declarations/buckets_sample';
import { idlFactory } from '../../declarations/bucket';

export const createBucketActor = async ({ canisterId }) => {
  const agent = new HttpAgent();

  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId
  });
};

let bucket;

const initCanister = async () => {
  try {
    bucket = await buckets_sample.init();
    console.log('New bucket:', bucket.toText());
  } catch (err) {
    console.error(err);
  }
};

const sayHello = async () => {
  try {
    const actor = await createBucketActor({
      canisterId: bucket
    });
    console.log(await actor.say());
  } catch (err) {
    console.error(err);
  }
};

const init = () => {
  const btnInit = document.querySelector('button#init');
  btnInit.addEventListener('click', initCanister);

  const btnSay = document.querySelector('button#say');
  btnSay.addEventListener('click', sayHello);
};

document.addEventListener('DOMContentLoaded', init);

```

* * *

## Demo

Everything comes to an end, the sample project can finally be tested 😉.

The `init` button dynamically creates a new canister, parse its ID in the console and the `say` button calls the function of the new bucket.

![ezgif.com-gif-maker(1).gif](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/ezgif.com-gif-maker(1).gif?token=KxVe2t40yk3ZCguV3_-B1)

* * *

## Conclusion

It took me much longer than expected to write this article 😅. I hope it will be useful and I am looking forward to share more tricks I learned while developing [Papyrs](https://papy.rs).

Speaking of which, if you have any related questions or suggestions that would made interesting blog posts, reach out and let me know!?!

To infinity and beyond  
David

* * *

For more adventures, follow me on [Twitter](https://twitter.com/daviddalbusco)
