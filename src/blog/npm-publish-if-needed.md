---
path: "/blog/npm-publish-if-needed"
date: "2023-10-27"
title: "$: npm publish -if-needed"
description: "Publish a new version of your libraries on NPM only if changes have been made."
tags: "#npm #javascript #programming #ci"
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KYD5_FMmuJCIbp2--hBcvA.jpeg"
canonical: "https://daviddalbusco.medium.com/npm-publish-if-needed-bfeaa781dfd0"
---

![](https://cdn-images-1.medium.com/max/6720/1*KYD5_FMmuJCIbp2--hBcvA.jpeg)

Photo by [Milad Fakurian](https://unsplash.com/fr/@fakurian?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/fr/photos/tableau-abstrait-rose-vert-et-bleu-UYgrVfIhBec?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

---

I’m not particularly strong in DevOps, but a few weeks ago, I found myself working on improving a monorepo that contains multiple JavaScript libraries published to NPM. Until then, we had been publishing all libraries with every release, whether they were modified or not. Surprisingly, there wasn’t an option to skip unmodified libraries. So, inspired by a GitHub [thread](https://github.com/npm/rfcs/issues/466), I decided to implement a small script that accomplishes this task. In this short blog post, I’m sharing the script with you.

## Script

The script that publishes a library only if it has been modified is as follows.

```bash
#!/usr/bin/env bash

function publish_npm() {
  local lib=$1

  LOCAL_SHASUM=$(npm pack -w packages/"$lib" --json | jq '.[] | .shasum' | sed -r 's/^"|"$//g')

  NPM_TARBALL=$(npm show @dfinity/"$lib" dist.tarball)
  NPM_SHASUM=$(curl -s "$NPM_TARBALL" 2>&1 | shasum | cut -f1 -d' ')

  if [ "$LOCAL_SHASUM" == "$NPM_SHASUM" ]; then
    echo "No changes in $lib need to be published to NPM."
  else
    npm publish --workspace=packages/"$lib" --provenance --access public
  fi
}

# Tips: libs use by other libs first
LIBS=utils,ledger-icrc,ledger-icp,nns-proto,nns,sns,cmc,ckbtc,ic-management

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  publish_npm "$lib"
done
```

So, what does it do?

First, I use a list of libraries that should be published, as seen in the variable `LIBS`. I could have simply listed all the packages present in the workspace with a bash command, but there might be some folders that should be skipped. Therefore, I decided to use a manual list.

> Note that I am using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

For each of these libraries, a function called `publish_npm` is executed.

To begin, the function calculates the shasum of the library as if it were to be published. It accomplishes this by using the npm command `pack` with the `--json` option. This command generates JSON output, including various information:

```json
[
	{
		"id": "@dfinity/utils@1.0.0",
		"name": "@dfinity/utils",
		"version": "1.0.0",
		"size": 35763,
		"unpackedSize": 124014,
		"shasum": "86f07bc3846e775ebc641486ff963f7b12e06476",
		"integrity": "sha512-xpsAgsx5jJZcdIYVbSHJ9XiNTtNIEzu8PH6Z2ALfYzF5an6B1HHTOGmhGUfLFBiEbQAyGb0zULcqBUV6lFVlCg==",
		"filename": "dfinity-utils-1.0.0.tgz",
		"files": []
	}
]
```

As you can see, it displays the shasum of the library. Therefore, I use `jq` and `sed` to extract this value into a variable.

Next, the function uses the `npm show` command to fetch the URL of the tarball hosted on npm:

```bash
❯ npm show @dfinity/utils dist.tarball
https://registry.npmjs.org/@dfinity/utils/-/utils-1.0.0.tgz
```

With this URL, the script can download the current version of the library without saving it to the filesystem. It does this by piping the data to the `shasum` command, allowing it to compute the current sha:

```bash
❯ curl -s https://registry.npmjs.org/@dfinity/utils/-/utils-1.0.0.tgz 2>&1 | shasum | cut -f1 -d' '
86f07bc3846e775ebc641486ff963f7b12e06476
```

Finally, the script compares both the local and remote shasums. If they are different, it proceeds to publish the new version to npm, as a difference in the two shasums indicates that the local library has been modified.

---

## Integration in GitHub Actions

Now that you have the script, here’s how you can integrate it into a GitHub Actions workflow that builds and publishes to npm each time you release your monorepo.

```yaml
name: Publish

on:
  release:
    types: [released]

jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18.x"
          registry-url: "https://registry.npmjs.org"
      - run: npm install -g npm
      - run: npm ci
      - run: npm run build --workspaces
      - name: Publish
        run: ./scripts/publish-npm.sh
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

This GitHub Actions workflow is configured to execute the NPM publishing script when a release is created in your repository. It checks out your code, sets up Node.js, installs dependencies, builds the project, and then runs our custom script, ensuring that libraries are selectively published only when changes have occurred. The `NODE_AUTH_TOKEN` secret is used to authenticate with npm during the publishing process.

To infinity and beyond.
David
