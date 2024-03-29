---
path: "/blog/react-web-workers-indexeddb-and-exceljs"
date: "2020-04-10"
title: "React, Web Workers, IndexedDB and ExcelJS"
description: "How to generate an Excel spreadsheet with IndexedDB data and a Web Worker within a React application"
tags: "#react #showdev #webdev #javascript"
image: "https://cdn-images-1.medium.com/max/1600/1*KfXCp8tFOBqrJDS6BUIkYQ.png"
canonical: "https://medium.com/@david.dalbusco/react-web-workers-indexeddb-and-exceljs-2439ff1341ff"
---

![](https://cdn-images-1.medium.com/max/1600/1*KfXCp8tFOBqrJDS6BUIkYQ.png)

_Photo by [Dan Gold](https://unsplash.com/@danielcgold?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Nine** days left until this first milestone. Hopefully better days are ahead.

---

In previous blog posts, I shared how [React and Web Workers can interact](https://daviddalbusco.com/blog/react-and-web-workers) and how they can [use data stored in IndexedDB](https://daviddalbusco.com/blog/react-web-workers-and-indexeddb).

I learned these tricks when I was developing [Tie Tracker](https://tietracker.app.link/), a simple, open source and free time tracking app ⏱.

In this application, I use such features to notably generate Excel spreadsheet containing the user’s entries.

---

### User Interface

Regarding previous user interface we have developed in the series, we are still going to stick to a “Tomato counter”. Only changes we apply regarding user interaction is the fact that instead of calling a "sum function", we are going to call our Web Worker in order to generate an Excel spreadsheet.

```javascript
import {
    IonContent,
    IonPage,
    IonLabel,
    IonButton
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './Page.css';

import {set} from 'idb-keyval';

const Page: React.FC<RouteComponentProps<{ name: string; }>> = ({match}) => {

    const [countTomato, setCountTomato] = useState<number>(0);

    const exportWorker: Worker = new Worker('./workers/export.js');

    useEffect(() => {
        exportWorker.onmessage = ($event: MessageEvent) => {
            if ($event && $event.data) {
                download($event.data);
            }
        };
    }, [exportWorker]);

    useEffect(() => {
        incTomato();
    }, [countTomato]);

    async function incTomato() {
        if (countTomato > 0) {
            await set(`tomato${countTomato}`, countTomato);
        }
    }

    function doExportToExcel() {
        exportWorker
            .postMessage({msg: 'export'});
    }

    function download(blob: Blob) {
        // TODO: See last chapter
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonLabel>Tomato: {countTomato}</IonLabel>

                <div className="ion-padding-top">
                    <IonButton
                     onClick={() => setCountTomato(countTomato + 1)}
                     color="primary">Tomato</IonButton>

                    <IonButton
                     onClick={() => doExportToExcel()}
                     color="secondary">Export</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Page;
```

At this point it does not do much because the Web Worker to handle the “Export” action is not yet ready and we are also not yet using its potential result, but, it should looks like the following.

![](https://cdn-images-1.medium.com/max/1600/1*-nowDWxwoaRF8H2TUuLRMw.gif)

---

### Web Worker

Before implementing anything, we create a new almost empty Web Worker `./public/workers/export.js` which only takes care of handling a message “export”, the one we pass to start the process in this separate thread.

```javascript
self.onmessage = async ($event) => {
	if ($event && $event.data && $event.data.msg === "export") {
		const data = await generateExcel();
		self.postMessage(data);
	}
};

async function generateExcel() {
	return null;
}
```

Afterwards, we add [idb-keyval](https://github.com/jakearchibald/idb-keyval), my favorite library to interact with IndexedDB, and only call the function to list the `keys()` present in the database, keys which are generated by our above component on user interaction respectively each time the user increment the “tomato counter”.

```javascript
importScripts("https://unpkg.com/idb-keyval@latest/dist/idb-keyval-iife.min.js");

self.onmessage = async ($event) => {
	if ($event && $event.data && $event.data.msg === "export") {
		const data = await generateExcel();
		self.postMessage(data);
	}
};

async function generateExcel() {
	const keys = await idbKeyval.keys();

	return null;
}
```

---

### ExcelJS

There are a couple of libraries which help read, write and manipulate spreadsheet data. I selected [ExcelJS](https://github.com/exceljs/exceljs) and I think it did the job pretty well, that’s why we are using it in this tutorial too.

As previously for idb-keyval, we can import the dependency in our worker from [Unpkg](https://unpkg.com).

In our function to generate our spreadsheet, we create a new `ExcelJS.Workbook` object and define some attributes.

An Excel file can contain multiple sheets, that why we then create such working page.

We skip, until next step, the preparation of the data themselves and we are implementing the generation of the spreadsheet. For such purpose, ExcelJS exposes a function `writeToBuffer` to generate the data to, well, a buffer which we are using to generate finally a `blob` (which will ultimately contains our spreadsheet).

```javascript
importScripts("https://unpkg.com/idb-keyval@latest/dist/idb-keyval-iife.min.js");
importScripts("https://unpkg.com/exceljs@latest/dist/exceljs.min.js");

self.onmessage = async ($event) => {
	if ($event && $event.data && $event.data.msg === "export") {
		const data = await generateExcel();
		self.postMessage(data);
	}
};

async function generateExcel() {
	const workbook = new ExcelJS.Workbook();

	workbook.creator = "Tomato";
	workbook.lastModifiedBy = "Tomato";
	workbook.created = new Date();
	workbook.modified = new Date();

	// Force workbook calculation on load
	workbook.calcProperties.fullCalcOnLoad = true;

	const worksheet = workbook.addWorksheet("Tomato page 1", {
		properties: { tabColor: { argb: "#FF0000" } },
		pageSetup: { paperSize: 9, orientation: "landscape" }
	});
	// TODO Prepare the data table
	const buf = await workbook.xlsx.writeBuffer();

	return new Blob([buf], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	});
}
```

We are going to add a table to our spreadsheet.

To do so, we have to provide an array which should contain an array for each line to print 🤔.

Let’s say for example that our data to display are displayed with five rows of two columns, this means that the overall array should contain five elements and each of them should contain two.

Still confuse? I guess the code will speak for itself 😅.

```javascript
const keys = await idbKeyval.keys();

const data = [];
for (const key of keys) {
	const value = await idbKeyval.get(key);
	data.push([`Counter ${value}`, value]);
}
```

The data being prepared, we can finally add the table. It contains a name, a page reference, some options, the definitions of the columns and their options and finally the data we just prepared above.

```javascript
worksheet.addTable({
	name: "Tomatoes",
	ref: "A1",
	headerRow: true,
	totalsRow: true,
	style: {
		theme: "TableStyleLight1",
		showRowStripes: true
	},
	columns: [
		{ name: "Label", filterButton: true, totalsRowLabel: "" },
		{ name: "Count", totalsRowFunction: "sum" }
	],
	rows: data
});
```

That’s it, our worker is ready. Altogether it looks like the following:

```javascript
importScripts("https://unpkg.com/idb-keyval@latest/dist/idb-keyval-iife.min.js");
importScripts("https://unpkg.com/exceljs@latest/dist/exceljs.min.js");

self.onmessage = async ($event) => {
	if ($event && $event.data && $event.data.msg === "export") {
		const data = await generateExcel();
		self.postMessage(data);
	}
};

async function generateExcel() {
	const workbook = new ExcelJS.Workbook();

	workbook.creator = "Tomato";
	workbook.lastModifiedBy = "Tomato";
	workbook.created = new Date();
	workbook.modified = new Date();

	// Force workbook calculation on load
	workbook.calcProperties.fullCalcOnLoad = true;

	const worksheet = workbook.addWorksheet("Tomato page 1", {
		properties: { tabColor: { argb: "#FF0000" } },
		pageSetup: { paperSize: 9, orientation: "landscape" }
	});

	const keys = await idbKeyval.keys();

	const data = [];
	for (const key of keys) {
		const value = await idbKeyval.get(key);
		data.push([`Counter ${value}`, value]);
	}

	worksheet.addTable({
		name: "Tomatoes",
		ref: "A1",
		headerRow: true,
		totalsRow: true,
		style: {
			theme: "TableStyleLight1",
			showRowStripes: true
		},
		columns: [
			{ name: "Label", filterButton: true, totalsRowLabel: "" },
			{ name: "Count", totalsRowFunction: "sum" }
		],
		rows: data
	});

	const buf = await workbook.xlsx.writeBuffer();

	return new Blob([buf], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	});
}
```

---

### Download

If you try our solution, you may notice at this point that nothing is still happening and you are right, nothing is happening from a user perspective.

Even though we have implemented the user interaction, chained both Web Worker and spreadsheet generation, we are not yet interpreting the result, the buffer we have transformed to a blob.

That’s why the last piece of this implementation is the function `download()` we did not have so far implemented in our component.

Credits to the followings go to [kol](https://stackoverflow.com/users/600135/kol) with his answer on [Stackoverflow](https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link/19328891#19328891). Not all heroes wear capes 🙏.

The function is adding an hidden link to the DOM which contains our blob, our spreadsheet, as target. Within the same function, we are calling it to trigger the download and are removing the element from the DOM afterwards.

Note that the browser will notice that it has to handle the URL in such way as we have created a blob with the specific type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` .

```javascript
function download(blob: Blob) {
    const a: HTMLAnchorElement = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);

    const url: string = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'tomato.xlsx';

    a.click();

    window.URL.revokeObjectURL(url);

    if (a && a.parentElement) {
        a.parentElement.removeChild(a);
    }
}
```

And voilà, our Excel spreadsheet generated with a Web Worker using ExcelJS is downloaded 🎉.

![](https://cdn-images-1.medium.com/max/1600/1*9M_Bym_ORTCaMQx1P0kUdg.gif)

In case you would need it, here is the component enhanced with the `download` function.

```javascript
import {
    IonContent,
    IonPage,
    IonLabel,
    IonButton
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './Page.css';

import {set} from 'idb-keyval';

const Page: React.FC<RouteComponentProps<{ name: string; }>> = ({match}) => {

    const [countTomato, setCountTomato] = useState<number>(0);

    const exportWorker: Worker = new Worker('./workers/export.js');

    useEffect(() => {
        exportWorker.onmessage = ($event: MessageEvent) => {
            if ($event && $event.data) {
                download($event.data);
            }
        };
    }, [exportWorker]);

    useEffect(() => {
        incTomato();
    }, [countTomato]);

    async function incTomato() {
        if (countTomato > 0) {
            await set(`tomato${countTomato}`, countTomato);
        }
    }

    function doExportToExcel() {
        exportWorker
            .postMessage({msg: 'export'});
    }

    function download(blob: Blob) {
        const a: HTMLAnchorElement = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);

        const url: string = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = 'tomato.xlsx';

        a.click();

        window.URL.revokeObjectURL(url);

        if (a && a.parentElement) {
            a.parentElement.removeChild(a);
        }
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonLabel>Tomato: {countTomato}</IonLabel>

                <div className="ion-padding-top">
                    <IonButton
                     onClick={() => setCountTomato(countTomato + 1)}
                     color="primary">Tomato</IonButton>

                    <IonButton
                     onClick={() => doExportToExcel()}
                     color="secondary">Export</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Page;
```

---

### Summary

Who would have thought that generating Excel spreadsheet can be fun 😉?

Stay home, stay safe!

David
