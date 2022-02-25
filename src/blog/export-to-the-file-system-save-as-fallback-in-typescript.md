---
path: "/blog/export-to-the-file-system-save-as-fallback-in-typescript"
date: "2022-02-18"
title: "Export To The File System (Save As...) + Fallback In TypeScript"
description: "How to save a file to the user's local devices with the new File System Access API and a fallback for incompatible browsers."
tags: "#typescript #beginners #tutorial #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*5z07fHoPx9LGqb4UjH5PYg.jpeg"
canonical: "https://daviddalbusco.medium.com/export-to-the-file-system-save-as-fallback-in-typescript-6561eba853cb"
---
![](https://zhx6p-eqaaa-aaaai-abbrq-cai.raw.ic0.app/images/ivan-diaz-gcynzrxspce-unsplash-copie.jpg?token=7d3dab62-3d70-4541-a9f6-8057f0dda373)

Photo by [Ivan Diaz](https://unsplash.com/@ivvndiaz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/download?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

* * *

In almost every web application I end up reusing the same pattern to export data to the file system in JavaScript - i.e. a solution that uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) and a good old "download" feature as fallback. I thought it was worth writing a post about it as documentation purpose 😉.

* * *

## Introduction
The File System Access API allows read, write and file management capabilities within your browser. It enables developers to build powerful web apps that interact with files on the user's local device.

The web.dev team has a [tutorial](https://web.dev/file-system-access/) that introduces and highlights all the features.

It is a relatively new API and therefore is not yet adopted by all browser vendors.

One of the key feature we are about the use - `showSaveFilePicker` which opens a dialog to select the destination of the file that will be written on user's local drive - is only supported by Edge, Chrome and Opera (Feb. 2022- source [Caniuse](https://caniuse.com/?search=showSaveFilePicker)).

* * *

## Getting Started
Generally speaking I use TypeScript. This solution is provided with type safety as well. That's why it needs first the installation of the type definitions for the File System Access API.

```bash
npm i -D @types/wicg-file-system-access
```

* * *

## Hands-on
To export file I use a `Blob` - i.e. the content of the file I want to export - and a `filename` . I create a single function that saves to the user's local device and that can be use across my app.

```javascript
export const save = (data: {blob: Blob, filename: string}) => {
  if ('showSaveFilePicker' in window) {
    return exportNativeFileSystem(data);
  }

  return download(data);
};
```

* * *

### File System Access API - Save As
Above feature tests if `showSaveFilePicker` is available in the `window` object - i.e. it checks if the browser supports the File System Access API or not.

To save the file with the new API, we first show the user a dialog in "save" mode. Using it, user can pick the location where the file will be saved. Once the path set, the file can effectively be written to the local drive.

```javascript
const exportNativeFileSystem = 
      async ({blob, filename}: {blob: Blob, filename: string}) => {
  
  const fileHandle: FileSystemFileHandle = 
      await getNewFileHandle({filename});

  if (!fileHandle) {
    throw new Error('Cannot access filesystem');
  }

  await writeFile({fileHandle, blob});
};
```

In many cases I want my app to suggest a default file name. This can be achieved by setting `suggestedName`. In addition, I also scope the type(s) of files that can be selected by providing mime types and related file extensions.

```typescript
const getNewFileHandle = 
    ({filename}: {filename: string}): Promise<FileSystemFileHandle> => {
  const opts: SaveFilePickerOptions = {
    suggestedName: filename,
    types: [
      {
        description: 'Markdown file',
        accept: {
          'text/plain': ['.md']
        }
      }
    ]
  };

  return showSaveFilePicker(opts);
};
```

Finally, the file can be effectively written with `writeFile` - another function of the API. It uses the file handle I previously requested to know where to export the data on the file system.

```javascript
const writeFile = 
    async ({fileHandle, blob}: {fileHandle: FileSystemFileHandle, blob: Blob}) => {
  const writer = await fileHandle.createWritable();
  await writer.write(blob);
  await writer.close();
};
```
* * *
### Fallback - Download
As a fallback, I add to the DOM a temporary anchor element that is automatically clicked. To export the file to the default download folder of the user, I provide an object as a URL for the `blob`.

```javascript
const download = async ({filename, blob}: {filename: string; blob: Blob}) => {
  const a: HTMLAnchorElement = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);

  const url: string = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = `${filename}.md`;

  a.click();

  window.URL.revokeObjectURL(url);
  a.parentElement?.removeChild(a);
};
```

* * *

## Get The Code
You can find all the code presented in this article in a recent Chrome plugin I published on GitHub 👉 [save-utils.ts](https://github.com/papyrs/markdown-plugin/blob/main/src/plugin/utils/save.utils.ts)

* * *

## Summary
That was a fairly short post which I hope was at least a bit entertaining 🤪. If you would like to dig deeper the File System Access API, I once again advise you to have a look at the nice post of the [web.dev](https://web.dev/file-system-access/) team.

To infinity and beyond  
David

