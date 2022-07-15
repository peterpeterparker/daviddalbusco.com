---
path: "/blog/how-to-programmatically-convert-icp-to-cycles-in-nodejs"
date: "2022-07-15"
title: "ICP to cycles in JavaScript"
description: "How to programmatically convert ICP to cycles in NodeJS?"
tags: "#javascript #nodejs #web3 #tutorial"
image: "https://images.unsplash.com/photo-1613905780946-26b73b6f6e11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyMHx8bWF0aHxlbnwwfHx8fDE2NTc4MDgxNTQ&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/icp-to-cycles-in-javascript"
---
![https://unsplash.com/photos/4ApmfdVo32Q](https://images.unsplash.com/photo-1613905780946-26b73b6f6e11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyMHx8bWF0aHxlbnwwfHx8fDE2NTc4MDgxNTQ&ixlib=rb-1.2.1&q=80&w=1080)

*Photo by [Michal Matlon](https://unsplash.com/@michalmatlon?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Until there is a library (e.g. [cmc-js](https://github.com/dfinity/ic-js) 👀) that facilitates the conversion of ICP to cycles in JavaScript, the following tutorial may help you implement such a transformation.

* * *

## Introduction

Long story short, to convert ICP to cycles you need two things:

1.  the exchange rate to transform the values which is returned by the cycles-minting canister (CMC)
2.  a function that, well, does the conversion

The CMC keeps a rolling average over the ICP closing price over the last 30 days (source [wiki](https://wiki.internetcomputer.org/wiki/Node_rewards)). It provides the information through the function `get\_average\_icp\_xdr\_conversion\_rate`.

* * *

## Dependencies

To query the CMC in JavaScript easily you need [agent-js](https://github.com/dfinity/agent-js) (and its peer dependencies). In addition, because following solution runs in a NodeJS context and not in a browser, [node-fetch](https://github.com/node-fetch/node-fetch) is required as well to provide previous library a way to perform `XMLHttpRequest`.

```bash
npm i node-fetch @dfinity/agent @dfinity/candid @dfinity/principal
```

* * *

## Candid

The description of the interface of the cycles-minting canister has to be used to initialize the communication channel.

The CMC candid file can be downloaded on the Internet Computer [repo](https://github.com/dfinity/ic/tree/master/rs/nns/cmc). Its binding files ( `.idl.js`, `.d.ts` etc. ) can be generated with the [didc](https://github.com/dfinity/candid/tree/master/tools/didc) command line tool or [Canlista](https://k7gat-daaaa-aaaae-qaahq-cai.raw.ic0.app/docs/) (a GUI version of the tool) but, if you want to spare yourself such operations, you can download all these files directly from the backend [repo](https://github.com/papyrs/ic/tree/main/ic/cmc) of my project [Papyrs](https://papy.rs).

In following code snippets I use these particular bindings.

* * *

## XDR conversion rate

On mainnet, the canister ID of the CMC is `rkp4c-7iaaa-aaaaa-aaaca-cai`. This ID should be used to instantiate the actor in order to query `get\_icp\_xdr\_conversion\_rate` which returns `xdr\_permyriad\_per\_icp`, the actual conversion rate in XDR we are looking for.

1 XDR being equal to 1 Trillion cycles, I convert the result to trillion ratio before returning it.

```javascript
import pkgAgent from "@dfinity/agent";
import fetch from "node-fetch";
import { idlFactory } from "./cmc/cmc.utils.did.mjs";

const { HttpAgent, Actor } = pkgAgent;

const icpXdrConversionRate = async () => {
  const agent = new HttpAgent({ fetch, host: "https://ic0.app" });

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "rkp4c-7iaaa-aaaaa-aaaca-cai",
  });

  const {
    data: { xdr_permyriad_per_icp },
  } = await actor.get_icp_xdr_conversion_rate();

  const CYCLES_PER_XDR = BigInt(1_000_000_000_000);

  // Return conversion rate in trillion ratio
  return (xdr_permyriad_per_icp * CYCLES_PER_XDR) / BigInt(10_000);
};
```

* * *

## Conversion ICP to cycles

We aim to convert readable numbers. That is why, we first need a small utility that maps `number` to `BigInt` (because the conversion function will process such types).

```javascript
const E8S_PER_ICP = BigInt(100000000);

const toBigint = (amount) => {
  const [integral, fractional] = `${amount}`.split(".");

  if ((fractional ?? "0").length > 8) {
    throw new Error("More than 8 decimals not supported.");
  }

  return (
    BigInt(integral ?? 0) * E8S_PER_ICP +
    BigInt((fractional ?? "0").padEnd(8, "0"))
  );
};
```

A few samples of above function result (number -> bigint):

*   `1` -> `100000000n`
*   `1.2` -> `120000000n`
*   `34.456` -> `3445600000n`

* * *

Finally, to effectively convert the ICP to cycles, we can implement a cross-multiplication with the conversion rate.

```javascript
const icpToCycles = async ({icp, conversionRate}) => {
  const e8ToCycleRatio = conversionRate / E8S_PER_ICP;
  return toBigint(icp) * e8ToCycleRatio;
};
```

* * *

## Demo

Put together in a small demo, e.g. above functions can be chained to log the result of the conversion to the console.

```javascript
const convertICPToCycles = async (icp) => {
  const conversionRate = await icpXdrConversionRate();
  const cycles = await icpToCycles({icp, conversionRate});

  const ONE_TRILLION = BigInt(1000000) * BigInt(1000000);

  console.log(
      `${icp} ICP equals ${
          Number(cycles) / Number(ONE_TRILLION)
      } (${cycles}) cycles`
  );
}

await convertICPToCycles(123.56);
```

If run in a command line, the sample should output such a result:

```bash
❯ node index.mjs
123.56 ICP equals 652.0879 (652087900000000) cycles
```

* * *

## Conclusion

I hope this small tutorial will be useful. If you have any idea of improvements, let me know!

To infinity and beyond  
David
