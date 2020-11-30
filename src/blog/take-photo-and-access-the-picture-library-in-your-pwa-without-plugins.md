---
path: "/blog/take-photo-and-access-the-picture-library-in-your-pwa-without-plugins"
date: "2019-07-10"
title: "Take photo and access the picture library in your PWA (withoutplugins)"
description: "How to access camera and photo library in a Progressive Web App using web technologies and no plugins"
tags: "#javascript #webdev #programming #beginners"
image: "https://cdn-images-1.medium.com/max/1600/1*94yTSEwDkPK52B22ll74mQ.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*94yTSEwDkPK52B22ll74mQ.jpeg)
*When I wrote this post I was visiting Frankfurt, I could had use your PWA to take this picture 😉*

I recently developed a new feature in our upcoming web open source editor for presentations, [DeckDeckGo](https://deckdeckgo.com), to let users upload their own pictures. Turn out, as our application is a Progressive Web App, that the feature I implemented not only let users access their picture library on their phones but also allow them to take photos and upload these directly in their presentations 🚀

In this new blog post I’ll share how you could implement such a feature and will also try to display how you could limit the uploaded file size, upload the results to [Firebase Storage](https://firebase.google.com/docs/storage) (the solution I implemented) or convert the result to a [base64](https://en.wikipedia.org/wiki/Base64) string or to a blob with a local object URL (in case you would have one of these requirements).

<iframe width="280" height="158" src="https://www.youtube.com/embed/VMNa3RnWxHI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe
<br/>

*The outcome of this blog post on an Android phone*

### Before we start

The following solution works just fine in a Progressive Web App but are not going to work in an iOS and Android application you would develop with web technologies. Therefore, if you are targeting the web, both above platforms and only want to write one single code base for all of these, I could advise you to have a look, for example, to [Capacitor](https://capacitor.ionicframework.com).

### Getting started

In order to be able to access the camera and the photo library on mobile devices with the Web we actually only need an `<input/>` element with `type="file"` , nothing more nothing left. It’s nowadays well supported on both iOS and Android. On desktop, same element will give access to a file(s) picker instead.

Furthermore, as we may want to “only” import certain types of images, we may restrict the file types the file input should accept using the, well I guess you get it, `accept` attribute.

```
<input type="file" accept="image/x-png,image/jpeg,image/gif"/>
```

### Accessing the image

No matter if camera, photo library or file picker, once the user has perform the action, the resulting image is available as an attribute `files` of the `input` but we still need an event to trigger the next process. For that purpose we are going to hook on the `onChange` event of the `input` which is triggered as soon as the action has been completed.

*Note: I wrote and display the solution using JSX as I developed mine with [StencilJS](https://stenciljs.com). You could adapt it easily to Javascript. If you are facing trouble doing so, ping me, I’ll be happy to assist.*

```
<input type="file" accept="image/x-png,image/jpeg,image/gif" 
                       onChange={() => this.upload()}/>

private upload(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        const filePicker = document.querySelector('input');
        if (!filePicker || !filePicker.files 
            || filePicker.files.length <= 0) {
            reject('No file selected.');
            return;
        }

        const myFile = filePicker.files[0];

        console.log(myFile);
        resolve();
    });
}
```

An `input` of type `file` could be use to select multiple files too but in this post we are only considering selecting one as displayed above when assigning the result to a local variable `myFile`.

That’s it for the GUI implementation, nothing more, nothing less, the web is awesome 😄

### Limit image size

As far as I understood, we can’t be proactive and limit the image size at the time the user is taking or picking it but we could limit it afterwards by adding a simple check on the file size. For example we could extend the above code with a check on a maximum file size of 10 Mb (the size as to be provided in bytes):

```
if (myFile.size > 10485760) {
    reject('Image is too big (max. 10 Mb)');
    return;
}
```

### Upload the image to Firebase Storage

Like I said in my introduction, we are still developing our upcoming editor for presentations and we recently underwent, kind of, our third migration 😅 For the edition we are now using [Firestore](https://firebase.google.com/docs/firestore) and since we are already there, we decided to host user personal assets in Firebase Storage.

I won’t show you how to initialize Firebase but here’s how you could upload the image. Nothing easier, just grab a reference on your storage providing the directory and filename where you want to save the file and upload it.

If you don’t want to change the filename, respectively keep it as its original name, you could use the attribute of the `file` called `name` which is kind of handy as it contains the extension too.

Afterwards, if you wish to display the result in an `img` element for example, or even better in an open source Web Component to lazy load the image like the one we have developed for [DeckDeckGo](https://docs.deckdeckgo.com/components/lazy-img) 😉, as long as your Firebase rules allows it, you could use a download url which you could obtain from the storage reference.

```
import {firebase} from '@firebase/app';
import '@firebase/storage';

private upload(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        const filePicker = document.querySelector('input');
        if (!filePicker || !filePicker.files 
            || filePicker.files.length <= 0) {
            reject('No file selected.');
            return;
        }

        const myFile = filePicker.files[0];

        try {        
          const storagePathAndFilename =
             `myFolder/mySubfolders/${myFile.name}`

          const ref = 
             firebase.storage().ref(storagePathAndFilename);
          await ref.put(myFile);

          const myDownloadUrl = await ref.getDownloadURL();

          console.log(`Your image url is ${myDownloadUrl}`);

          resolve();
        } catch (err) {
          reject(err);
        }
    }); 
}
```

### Convert the image to a base64 string

You might want to display the picture which was taken or selected directly or just convert it to a base64 string as you would need this format to submit it to your storage. For that purpose you use a `FileReader` as displayed hereafter.

```
private upload(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        const filePicker = document.querySelector('input');
        if (!filePicker || !filePicker.files 
            || filePicker.files.length <= 0) {
            reject('No file selected.');
            return;
        }

        const myFile = filePicker.files[0];
  
        const myBase64File = await this.convert(myFile);

        console.log(`Your base64 image is ${myBase64File}`);
        resolve();
    });
}

private 
(myFile: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
        const fileReader: FileReader = new FileReader();

        if (fileReader && myFile) {
            fileReader.readAsDataURL(myFile);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        } else {
            reject('No file provided');
        }
    });
}
```

### Convert the image to a blob and create a local object URL

I had a chat this morning with [Sergey Rudenko](https://medium.com/@sergey.rudenko) who pointed out the fact that converting the image to a blob in order to create and use a local object url, instead of base64, might improve the performance in special cases. That’s why he provided me the following alternative, which might interest you too.

Kudos Sergey and thank your for this nice add-ons 👍

```
private convert(myFile: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            if (fileReader && myFile) {
                fileReader.readAsDataURL(myFile);
                fileReader.onload = () => {
                    const blob = new Blob([new Uint8Array(
                               fileReader.result as ArrayBuffer)]);
                    const blobURL = URL.createObjectURL(blob);
                    resolve(blobURL);
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
            } else {
                reject('No file provided');
            }
        });
    }
```

### Cherry on the cake 🍒🎂

This post is the outcome from a real use case and as our platform is open source, you are most welcomed to have a look at our code  and even better, most welcomed to send us a PR if you do notice any possible improvements 🙏

You could find the code related code at the following address, it is where it starts respectively where I declare the `input` :

[https://github.com/deckgo/deckdeckgo/blob/4030608803118d87ef7cd40bdbd6e1382d64211f/studio/src/app/modals/editor/app-custom-images/app-custom-images.tsx#L234](https://github.com/deckgo/deckdeckgo/blob/4030608803118d87ef7cd40bdbd6e1382d64211f/studio/src/app/modals/editor/app-custom-images/app-custom-images.tsx#L234)

To infinity and beyond 🚀

David
