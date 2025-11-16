---
path: "/blog/translate-a-svelte-app-i18n"
date: "2023-05-18"
title: "Translate a Svelte app (i18n) without external dependencies"
description: "Adding internationalization support to a Svelte application: a step-by-step guide."
tags: "#svelte #i18n #webdev #programming"
image: "https://cdn-images-1.medium.com/max/1600/1*bXhlRgLdEKKomTCR32Q4ZA.jpeg"
canonical: "https://daviddalbusco.medium.com/translate-i18n-a-svelte-app-without-external-dependencies-7603630d2440"
---

![nareeta-martin-vf1ycolhmpg-unsplash.jpg](https://cdn-images-1.medium.com/max/1600/1*bXhlRgLdEKKomTCR32Q4ZA.jpeg)

_Photo by [Nareeta Martin](https://medium.com/r/?url=https%3A%2F%2Funsplash.com%2Fpt-br%2F%40splashabout%3Futm_source%3Dunsplash%26utm_medium%3Dreferral%26utm_content%3DcreditCopyText) on [Unsplash](https://medium.com/r/?url=https%3A%2F%2Funsplash.com%2Fphotos%2FvF1YCoLHMpg%3Futm_source%3Dunsplash%26utm_medium%3Dreferral%26utm_content%3DcreditCopyText)_

---

As a native French speaker living in the Swiss-German part of Switzerland, it goes without saying that translations, or more precisely, enabling users to switch languages in their apps, is a topic I am well-acquainted with. I consistently implement this functionality at the beginning of every project, regardless of whether the app will be fully translated or not.

Over the course of building several Svelte applications, I have discovered a recurring pattern that I consistently employ. This pattern, which I have successfully used in previous projects with different frameworks, revolves around the utilization of a lightweight store for managing translation keys, all without relying on any third-party dependencies.

In this tutorial, I’ll share this solution and provide practical features like generating TypeScript definitions and translation utilities. These tools will streamline your workflow.

---

## Important considerations: SEO limitations

This article covers a **client-side solution** for translations, which may have limitations in terms of search engine optimization (SEO). It does not address multi-language websites delivered through separate URLs or domains. While it is possible to extend the solution to accommodate such scenarios, it falls outside the scope of this tutorial’s objectives.

---

## Language definition

When adding translations to an existing Svelte application, the first step is to define the list of supported languages.

To accomplish this, create a `languages.d.ts` TypeScript definition file that enumerates the supported languages. For example, you can include English and Chinese as supported languages.

```typescript
type Languages = "en" | "zh-cn";
```

---

## Typing support

To enable typing support in TypeScript for the translation keys used in our application, we can create an `interface`. In this blog post, we will explore an automated approach for generating these interfaces. However, for now, let's manually create an `i18n.d.ts` file that defines two translated keys, namely `yes` and `no`. This will establish a foundation for managing typings for translations in our Svelte application.

```typescript
interface I18nCore {
	yes: string;
	no: string;
}

interface I18n {
	lang: Languages;
	core: I18nCore;
}
```

One approach to implementing these languages is to define them directly in the code.

```typescript
export const en: I18n = {
	lang: "en",
	core: {
		yes: "yes",
		no: "no"
	}
};

export const zhCn: I18n = {
	lang: "en",
	core: {
		yes: "是",
		no: "否"
	}
};
```

Personally, I find using JSON files to store translations more convenient than embedding them directly in code. This approach has proven to be accessible to translators and non-technical individuals I have collaborated with in the past.

For instance, I use an `en.json` file to store English translations, a `zh-cn.json` file for Chinese translations, and so on.

```json
{
  "core": {
    "yes": "Yes",
    "no": "No"
  }
}

{
 "core": {
     "yes": "是",
  "no": "否"
 }
}
```

---

## Lazy loading

Although it may not be critical if your app only has a small number of translations, loading all translations for every language at app startup can become problematic. To address this, I prefer to load only the default language initially and lazily load the others as needed.

In this tutorial, we will use English as the default language. To obtain the list of translations, we can utilize a statically built import.

```typescript
import en from "$lib/i18n/en.json";

const enI18n = (): I18n => {
	return {
		lang: "en",
		...en
	} as I18n;
};
```

Given that Chinese is an option, we can implement lazy loading for it using an asynchronous import. This import will be executed at runtime only if Chinese translations are needed, ensuring efficient resource utilization and improved performance.

```typescript
const zhCnI18n = async (): Promise<I18n> => {
	return {
		lang: "zh-cn",
		...(await import(`../i18n/zh-cn.json`))
	};
};
```

By implementing lazy loading, only users who request a specific language will need to download the corresponding JSON file, reducing unnecessary data transfer.

To initialize our project, we can create a single function that is called at boot time to handle translation initialization. This function will set up the necessary configurations and prepare the application for seamless translation integration.

```typescript
const loadLanguage = (lang: Languages): Promise<I18n> => {
	switch (lang) {
		case "zh-cn":
			return zhCnI18n();
		default:
			return Promise.resolve(enI18n());
	}
};
```

---

## Local storage

Considering the goal of supporting multiple languages in our application, it is crucial to deliver the content in the user’s preferred language whenever they visit the site.

To achieve this, a straightforward approach is to save the user’s language choice in the local storage. Since unforeseen circumstances can arise and server-side rendering is not a concern in this tutorial, we can encapsulate the storage logic within error-ignoring functions. This ensures that even in error scenarios, our application can still compile and operate smoothly.

```typescript
import { browser } from "$app/environment";

export const setLocalStorageItem = ({ key, value }: { key: string; value: string }) => {
	try {
		localStorage.setItem(key, value);
	} catch (err: unknown) {
		// We use the local storage for the operational part of the app but, fallback to english if necessary
		console.error(err);
	}
};

export const getLocalStorageLang = (): Languages => {
	try {
		const { lang }: Storage = browser ? localStorage : ({ lang: "en" } as unknown as Storage);
		return lang;
	} catch (err: unknown) {
		// We use the local storage for the operational part of the app but, fallback to english if necessary
		console.error(err);
		return "en";
	}
};
```

---

## Store

With the ability to load languages and save the user’s language choice, we can now proceed to develop the translation store.

The translation store will not only store the translations but also expose two key functions: one for initialization purposes and another for switching between languages. These functions will provide the necessary functionality to set up the translations and allow users to seamlessly switch between different language options.

```typescript
export interface InitI18nStore extends Readable<I18n> {
	init: () => Promise<void>;
	switchLang: (lang: Languages) => Promise<void>;
}
```

The implementation of the translation store extends the above interface and involves the following tasks:

- Create a Svelte `writable` store that is initialized with the default value of English.
- Expose the store's subscriber.

- Implement one function to populate the store with translations based on the selected language.

- And another function to persist the language choice in the storage.

```typescript
const initI18n = (): I18nStore => {
	const { subscribe, set } = writable<I18n>({
		lang: "en",
		...en
	});

	const save = (lang: Languages) => setLocalStorageItem({ key: "lang", value: lang });

	return {
		subscribe,

		init: async () => {
			const lang: Languages = getLocalStorageLang();

			if (lang === "en") {
				save(lang);
				// No need to reload the store, English is already the default
				return;
			}

			const bundle: I18n = await loadLanguage(lang);
			set(bundle);

			save(lang);
		},

		switchLang: async (lang: Languages) => {
			const bundle: I18n = await loadLanguage(lang);
			set(bundle);

			save(lang);
		}
	};
};

export const i18n = initI18n();
```

---

## Initialization

The store and loading of translations can be executed at any point during the application startup process. Personally, I prefer utilizing the `await` tag in Svelte to initialize such quick loaders at the root of my main `+layout.ts` file. This approach allows me to display a brief spinner while the translations are loading. However, the loading process is often so quick that the spinner may not even be visible. Additionally, this ensures that the UI is not rendered in English before being switched to the user's preferred language, especially if they had previously made a different language selection.

```typescript
<script lang="ts">
    import { i18n } from '$lib/stores/i18n.store';
    import MySpinner from '$lib/components/ui/MySpinner.svelte';

    const init = async () => await i18n.init();
</script>

{#await init()}
    <MySpinner />
{:then _}
    <slot />
{/await}
```

---

## Usage

The beauty of this solution lies in its simplicity, as it leverages Svelte stores, which you are likely already using in your application. There is no need to learn anything new to utilize them.

By auto-subscribing to translation keys, the text will be dynamically rendered. This means that whenever the user switches the language, the subscriber will be re-rendered, and the newly selected language will be automatically applied. This enables seamless and dynamic language switching within the application.

```typescript
<script lang="ts">
  import {i18n} from "$lib/stores/i18n.store";
</script>

<p>{$i18n.core.yes}</p>
<p>{$i18n.core.no}</p>
```

Similarly, the language can be switched by calling the corresponding function implemented in our translation store.

```typescript
<script lang="ts">
  import {i18n} from "$lib/stores/i18n.store";

  const switchChinese = () => i18n.switchLang("zh-cn");
</script>

<button on:click={switchChinese}>Chinese</button>
```

---

## Generate TypeScript definition automatically

To automatically generate the TypeScript definitions for our translation keys, we can create a Node.js script at the root of our project. This script will iterate through the default language, which is English in this case, and generate the necessary definitions.

It’s important to note that for the sake of simplicity, the script only follows a single level down. This means that it will generate types for keys at the current level, but not for nested keys like `$i18n.level.sublevel.key`.

By running this script, we can conveniently generate the TypeScript definitions required for our translations, enabling type-checking and improved development experience.

```typescript
#!/usr/bin/env node

import { writeFileSync } from "fs";

const PATH_FROM_ROOT = "./src/frontend/src";
const PATH_TO_EN_JSON = `${PATH_FROM_ROOT}/lib/i18n/en.json`;
const PATH_TO_OUTPUT = `${PATH_FROM_ROOT}/lib/types/i18n.d.ts`;

/**
 * Generate the TypeScript interfaces from the english translation file.
 *
 * Note: only supports "a one child depth" in the data structure.
 */
const generateTypes = async () => {
	const en = await import(PATH_TO_EN_JSON, { assert: { type: "json" } });

	const data = Object.keys(en.default).map((key) => {
		const properties = Object.keys(en.default[key]).map((prop) => `${prop}: string;`);

		return {
			key,
			name: `I18n${key.charAt(0).toUpperCase()}${key.slice(1)}`,
			properties
		};
	});

	const lang = `lang: Languages;`;

	const main = `\n\ninterface I18n {${lang}${data.map((i) => `${i.key}: ${i.name};`).join("")}}`;
	const interfaces = data.map((i) => `\n\ninterface ${i.name} {${i.properties.join("")}}`).join("");

	const comment = `/**\n* Auto-generated definitions file ("npm run i18n")\n*/`;

	writeFileSync(PATH_TO_OUTPUT, `${comment}${interfaces}${main}`);
};

await generateTypes();
```

To simplify the process of running the parser, we can add it to the list of scripts in our `package.json` file. Additionally, if you are using a code formatter like `prettier`, we can format the generated code afterwards to ensure it adheres to our desired code style and patterns. This ensures consistency and readability in the generated code.

```typescript
{
  "scripts": {
    "i18n": "node i18n.mjs && prettier --write ./src/frontend/src/lib/types/i18n.d.ts"
  }
}
```

By running the command `npm run i18n` in a terminal, the types will be automatically generated. It is recommended to run this command each time new translation keys are added to ensure the generated code is up to date. For safety reasons, it is also advisable to run the command before a production build to ensure that the generated code incorporates the most recent entries. This guarantees that the application uses the latest translations during the build process.

---

## Replace placeholders

Using static texts is convenient, but frequently we need to replace placeholders in sentences to incorporate dynamic values. This allows us to present content that adapts based on user input or other dynamic factors.

```json
{
	"core": {
		"problems": "I got {0} problems but a witch ain't {1}"
	}
}
```

This can be achieved with the help of a small utility that iterates through a value and replaces matching texts. There are multiple ways to implement this functionality, and here is a simple approach to consider.

```typescript
export const i18nFormat = (
	text: string,
	params: { placeholder: string; value: string }[]
): string => {
	params.forEach((param) => {
		const split = text.split(param.placeholder);
		text = split[0] + param.value + (split.length > 1 ? split[1] : "");
	});

	return text;
};
```

A function can be created to replace the selected keys in the input text with the provided parameters.

```typescript
<script lang="ts">
  import {i18nFormat} from "$lib/utils/i18n.utils";
</script>

<p>{i18nFormat($i18n.core.problems, [ { placeholder: '{0}', value: '99' }, { placeholder: '{1}', value: '1' } ])}</p>
```

Note that in this example, `{0}` and `{1}` were used as placeholders, but you can use any unique identifiers as placeholders.

---

## HTML tags

Sometimes, we may also need to apply styling within our translations. Since translations are just strings, we can include HTML tags within the text and utilize the `@html` tag in Svelte to render them properly. This allows us to incorporate styling elements and formatting directly within the translated text.

```json
{
	"core": {
		"bold": "This is <strong>bold</strong>."
	}
}
```

_Note: It's important to exercise caution when using the @html tag, as it can pose security risks. Make sure to use it only when necessary and follow best practices to mitigate potential vulnerabilities. Implementing a Content Security Policy (CSP) is highly recommended, and it's advisable to purify the HTML content before injecting it into the DOM. These precautions help ensure the safety and integrity of your application when using the `@html` tag._

```typescript
<script lang="ts">
import {i18n} from "$lib/stores/i18n.store";
</script>

<p>{@html $i18n.core.bold}</p>
```

## Source code

The source code for this tutorial can be found in the [GitHub repository](https://github.com/junobuild/juno) of [Juno](https://juno.build/), an open-source blockchainless platform designed for developers who want to build Web3 applications with the simplicity of Web2.
