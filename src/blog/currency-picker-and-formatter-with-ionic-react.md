---
path: "/blog/currency-picker-and-formatter-with-ionic-react"
date: "2020-04-18"
title: "Currency Picker And Formatter With Ionic React"
description: "Build a currency picker and formatter for your application developed with Ionic and React"
tags: "#react #ionic #javascript #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*vNyq4W-5NQoeX5jo8TqBQw.png"
canonical: "https://medium.com/@david.dalbusco/currency-picker-and-formatter-with-ionic-react-ede8e2ff53df"
---

![](https://cdn-images-1.medium.com/max/1600/1*vNyq4W-5NQoeX5jo8TqBQw.png)

*Photo by [Pawel Janiak](https://unsplash.com/@pawelj?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **One** days left until this first milestone. Hopefully better days are ahead.

*****

I was looking for a subject idea for today’s blog post and it came to my mind that I could maybe share something I  learned with [Tie Tracker](https://tietracker.app.link/) ⏱️, a simple, open source and free time tracking app I have developed with [Ionic](https://ionicframework.com/) and [React](https://reactjs.org/) again.

That’s why I’m sharing with you my solution to develop a custom currency picker and formatter.

![](https://cdn-images-1.medium.com/max/1600/1*YCPfr5rf-N4Tk9l9JusTXA.gif)

*****

### Start

If you don’t have an Ionic React application yet, you can follow this tutorial by creating a sample one using their CLI.

```bash
ionic start
```

When prompted, select “React”, your application name and for example the template “blank”.

*****

### List Of Currencies

We intend to develop a custom currency picker, that’s why we need, a list of currencies. For such purpose, we can download the one provided on the [Xsolla](https://github.com/xsolla/currency-format) repo as it is  free and licensed under MIT license.

```bash
curl https://raw.githubusercontent.com/xsolla/currency-format/master/currency-format.json -o public/assets/currencies.json
```

I use `curl` because I am using a Macbook but what does matter is to save the list of currencies in the assets folder as it will have to be shipped with the app.

*****

### TypeScript Definitions

We are going to need a TypeScript definitions to handle the list we just downloaded. That’s why we create following interfaces in `./src/definitions/currency.d.ts` .

```javascript
export interface Currency {
    name: string;
    fractionSize: number;
    symbol: {
        grapheme: string;
        template: string;
        rtl: boolean;
    };
    uniqSymbol: boolean;
}

export interface Currencies {
    [currency: string]: Currency;
}
```

Note that I am not sure that using a subfolder `definitions` is really the best practice, it is just something I do. Do not think it matters that much, I just like to split my code in, kind of, packages.

*****

### Modal: Currency Picker

To develop our picker I suggest that we use a modal. It should display the list of available currencies (currency name and abbreviation), allow the user to filter these and ultimately let him/her select one.

We create a new component `./src/components/CurrenciesModal.tsx` which receive as properties the current selected currency and a function to close the modal and pass the user selection.

```javascript
interface Props {
    closeAction: Function;
    currency: string;
}
```

It contains also two states. The list of currencies and a filtered one, which is, when component mounted, equals to the all list.

```javascript
const [currencies, setCurrencies] = 
      useState<Currencies | undefined>(undefined);
const [filteredCurrencies, setFilteredCurrencies] = 
      useState<Currencies | undefined>(undefined);
```

To initiate these we use `useEffect` hooks and we read the JSON data we downloaded before.

```javascript
useEffect(() => {
    initCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

useEffect(() => {
    setFilteredCurrencies(currencies);
}, [currencies]);

async function initCurrencies() {
    try {
        const res: Response = 
                   await fetch('./assets/currencies.json');

        if (!res) {
            setCurrencies(undefined);
            return;
        }

        const currencies: Currencies = await res.json();

        setCurrencies(currencies);
    } catch (err) {
        setCurrencies(undefined);
    }
}
```

To proceed with filtering, we implement a function which read the user inputs and call another one which effectively takes care of applying a filter on the list we maintain as state objects.

```javascript
async function onFilter($event: CustomEvent<KeyboardEvent>) {
    if (!$event) {
        return;
    }

    const input: string = ($event.target as InputTargetEvent).value;

    if (!input || input === undefined || input === '') {
        setFilteredCurrencies(currencies);
    } else {
        const filtered: Currencies | undefined = 
                        await filterCurrencies(input);
        setFilteredCurrencies(filtered);
    }
}
```

Finally we implement our modal’s GUI which contains a `searchbar` and a `list` of `items` , the currencies.

```javascript
<IonSearchbar debounce={500} placeholder="Filter"
              onIonInput={($event: CustomEvent<KeyboardEvent>) => onFilter($event)}></IonSearchbar>

<IonList>
    <IonRadioGroup value={props.currency}>
        {renderCurrencies()}
    </IonRadioGroup>
</IonList>
```

Altogether our component looks like the following:

```javascript
import React, {useEffect, useState} from 'react';

import {
    IonList,
    IonItem,
    IonToolbar,
    IonRadioGroup,
    IonLabel,
    IonRadio,
    IonSearchbar,
    IonContent,
    IonTitle,
    IonHeader, IonButtons, IonButton, IonIcon
} from '@ionic/react';

import {close} from 'ionicons/icons';

import {Currencies} from '../definitions/currency';

interface Props {
    closeAction: Function;
    currency: string;
}

interface InputTargetEvent extends EventTarget {
    value: string;
}

const CurrenciesModal: React.FC<Props> = (props: Props) => {

    const [currencies, setCurrencies] = 
          useState<Currencies | undefined>(undefined);
    const [filteredCurrencies, setFilteredCurrencies] = 
          useState<Currencies | undefined>(undefined);

    useEffect(() => {
        initCurrencies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredCurrencies(currencies);
    }, [currencies]);

    async function initCurrencies() {
        try {
            const res: Response = 
                  await fetch('./assets/currencies.json');

            if (!res) {
                setCurrencies(undefined);
                return;
            }

            const currencies: Currencies = await res.json();

            setCurrencies(currencies);
        } catch (err) {
            setCurrencies(undefined);
        }
    }

    async function onFilter($event: CustomEvent<KeyboardEvent>) {
        if (!$event) {
            return;
        }

        const input: string = 
              ($event.target as InputTargetEvent).value;

        if (!input || input === undefined || input === '') {
            setFilteredCurrencies(currencies);
        } else {
            const filtered: Currencies | undefined = 
                  await filterCurrencies(input);
            setFilteredCurrencies(filtered);
        }
    }

    async function filterCurrencies(filter: string): 
                   Promise<Currencies | undefined> {
        if (!currencies) {
            return undefined;
        }

        const results: Currencies = Object.keys(currencies)
            .filter((key: string) => {
                return ((key.toLowerCase().indexOf(filter.toLowerCase()) > -1) ||
                    (currencies[key].name && currencies[key].name.toLowerCase().indexOf(filter.toLowerCase()) > -1));
            })
            .reduce((obj: Currencies, key: string) => {
                obj[key] = currencies[key];
                return obj;
            }, {});

        return results;
    }

    return (
        <>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Picker</IonTitle>
                    <IonButtons slot="start">
                        <IonButton 
                          onClick={() => props.closeAction()}>
                          <IonIcon icon={close} slot="icon-only"> 
                          </IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonSearchbar debounce={500} placeholder="Filter"
                 onIonInput={($event: CustomEvent<KeyboardEvent>) => onFilter($event)}></IonSearchbar>

                <IonList>
                    <IonRadioGroup value={props.currency}>
                        {renderCurrencies()}
                    </IonRadioGroup>
                </IonList>
            </IonContent>
        </>
    );

    function renderCurrencies() {
        if (!filteredCurrencies 
            || filteredCurrencies === undefined) {
            return undefined;
        }

        return Object.keys(filteredCurrencies)
                     .map((key: string) => {
            return <IonItem key={`${key}`}
                            onClick={() => props.closeAction(key)}>
                <IonLabel>{filteredCurrencies[key].name} ({key})
                </IonLabel>
                <IonRadio value={key}/>
            </IonItem>
        });
    }

};

export default CurrenciesModal;
```

*****

### Page: Home

Our picker being ready, we can now use it. For such purpose we integrate it to the main page of our application, the `home` page. We are also adding a state to display the current selected currency which I initialized with `CHF` as it is the currency of Switzerland.

Moreover, we are also implementing a function to update the currency according the one the user would pick using our above modal.

```javascript
import React, {useState} from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonModal, IonButton, IonLabel} from '@ionic/react';

import CurrenciesModal from '../components/CurrenciesModal';

const Home: React.FC = () => {

    const [currency, setCurrency] = useState<string>('CHF');
    const [showModal, setShowModal] = useState<boolean>(false);

    function updateCurrency(currency?: string | undefined) {
        setShowModal(false);

        if (!currency) {
            return;
        }

        setCurrency(currency);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonModal isOpen={showModal} 
                 onDidDismiss={() => setShowModal(false)}>
                    <CurrenciesModal currency={currency}
                                     closeAction={updateCurrency}>
                    </CurrenciesModal>
                </IonModal>

                <h1>123.45 {currency}</h1>

                <IonButton onClick={() => setShowModal(true)}>
                    <IonLabel>Pick currency</IonLabel>
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Home;
```

If you implemented the above code you should now be able to run the application and pick currencies.

![](https://cdn-images-1.medium.com/max/1600/1*l7-IXroNBIyWj11Ho1h9gA.gif)

*****

### Format Currency

Being able to select a currency is nice, but being able to use it is even better 😉.

To format our amount, we are going to use the standard built-in object [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) which is now pretty well [supported](https://caniuse.com/#search=NumberFormat) by any browser.

```javascript
function formatCurrency(value: number): string {
    if (currency === undefined) {
        return new Intl.NumberFormat('fr').format(0);
    }

    return new Intl.NumberFormat('fr', 
           { style: 'currency', currency: currency }).format(value);
}
```

Note that in the above function I hardcoded french as it is my mother tongue. This can be replaced by the one of your choice or if you are using [i18next](https://www.i18next.com/) with the following dynamic language.

```javascript
import i18n from 'i18next';

function formatCurrency(value: number): string {
    if (currency === undefined) {
        return new Intl.NumberFormat(i18n.language).format(0);
    }

    return new Intl.NumberFormat(i18n.language, 
           { style: 'currency', currency: currency }).format(value);
}
```

Finally, we are replacing the static display of the value `123.45 {currency}` with the function’s call.

```javascript
<h1>{formatCurrency(123.45)}</h1>
```

Altogether our main page now should contain the following code:

```javascript
import React, {useState} from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonModal, IonButton, IonLabel} from '@ionic/react';

import CurrenciesModal from '../components/CurrenciesModal';

const Home: React.FC = () => {

    const [currency, setCurrency] = useState<string>('CHF');
    const [showModal, setShowModal] = useState<boolean>(false);

    function updateCurrency(currency?: string | undefined) {
        setShowModal(false);

        if (!currency) {
            return;
        }

        setCurrency(currency);
    }

    function formatCurrency(value: number): string {
        if (currency === undefined) {
            return new Intl.NumberFormat('fr').format(0);
        }

        return new Intl.NumberFormat('fr', 
           { style: 'currency', currency: currency }).format(value);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonModal isOpen={showModal} 
                          onDidDismiss={() => setShowModal(false)}>
                    <CurrenciesModal currency={currency}
                                     closeAction={updateCurrency}>
                    </CurrenciesModal>
                </IonModal>

                <h1>{formatCurrency(123.45)}</h1>

                <IonButton onClick={() => setShowModal(true)}>
                    <IonLabel>Pick currency</IonLabel>
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Home;
```

Voilà, both our currency picker and formatter are implemented in our Ionic React application 🎉.

![](https://cdn-images-1.medium.com/max/1600/1*6ugZ2Y2mcpHkmdS4gpNJ6w.gif)

*****

### Summary

Ionic and React together are really fun. Checkout [Tie Tracker](https://tietracker.app.link) and of course your [Pull Requests](https://github.com/peterpeterparker/tietracker) to improve the app are most welcomed 😁.

Stay home, stay safe!

David
