---
path: "/blog/essential-javascript-functions-for-detecting-users-device-characteristics"
date: "2023-11-12"
title: "Essential JavaScript Functions for Detecting User’s Device Characteristics"
description: "Learn how to detect iOS, Android, fullscreen mode, Firefox, Safari, and more with JavaScript."
tags: "#javascript #programming #webdev #showdev"
image: "https://daviddalbusco.com/assets/images/1*dQT7UMbmwnLQNoV4Z0Uqzg.jpeg"
canonical: "https://daviddalbusco.medium.com/essential-javascript-functions-for-detecting-users-device-characteristics-763e397514cd"
---

![](https://daviddalbusco.com/assets/images/1*dQT7UMbmwnLQNoV4Z0Uqzg.jpeg)

Photo by [Bram Naus](https://unsplash.com/fr/@bramnaus?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/fr/photos/macbook-argento-accanto-a-iphone-6-grigio-siderale-e-bicchiere-trasparente-su-ripiano-in-legno-marrone-n8Qb1ZAkK88?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

---

Time and again, I’ve encountered the need to implement features in my web-based projects that specifically target certain types of devices. Each time, I find myself falling back on the same set of utilities I’ve been using for years. It’s high time I shared these invaluable tools in a blog post.

In this article, you’ll gain access to a curated collection of JavaScript functions for identifying iOS and Android devices, detecting fullscreen mode, distinguishing Firefox from Safari, and more.

> It’s important to be aware that some of these methods are based on parsing the navigator user-agent string, which might see changes in the future as Google plans to [reduce the information](https://developer.chrome.com/blog/user-agent-reduction-deprecation-trial/) provided by this string.

---

## isMobile

Let’s start with the detection of a mobile device. I determine if a user is using my applications in a browser-based environment that might be a mobile device by testing whether the user is using a pointing device with limited accuracy, such as a touch screen, and which is not a precise device such as a mouse.

```typescript
const isMobile = (): boolean => {
	const isTouchScreen = window.matchMedia("(any-pointer:coarse)").matches;
	const isMouseScreen = window.matchMedia("(any-pointer:fine)").matches;

	return isTouchScreen && !isMouseScreen;
};
```

The [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) interface returns an object that can be used to determine if the document or web page matches a specific media query. To test the pointing device, I utilize the [any-pointer](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer) CSS media feature.

---

## isIPad

Identifying an iPad device involves inspecting the user-agent, but it also necessitates combining this data with the previous mobile detection function. This is because Safari presents a string similar to that of desktop or laptop devices.

```typescript
const isIPad = (): boolean => {
	const {
		navigator: { userAgent }
	} = window;

	// iOS 12 and below
	if (/iPad/i.test(userAgent)) {
		return true;
	}

	// iOS 13+
	return /Macintosh/i.test(userAgent) && isMobile();
};
```

On older versions of iPadOS, the user-agent used to include the indentation; therefore, I also check if the string might contain this information.

> Note that the `i` in the regex showcased in this article stands for `insensitive` meaning it performs a test without considering case sensitivity.

---

## isIPhone

I combine iPhone and iPod into a single function because their user experience is similar for my projects. Both can be tested by querying the user-agent, which contains their indication.

```typescript
const isIPhone = (): boolean => /iPhone|iPod/i.test(window.navigator.userAgent);
```

---

## isIOS

I assume you already know the answer: to detect if a device is running iOS, we can simply use the two previous functions.

```typescript
const isIOS = (): boolean => isIPhone() || isIPad();
```

## isAndroid

Similar to iPhones, detecting Android devices is straightforward because the necessary information is provided in the user-agent string.

```typescript
const isAndroid = (): boolean => /android/i.test(window.navigator.userAgent);
```

---

## isAndroidTablet

According to my tests, an Android tablet is an Android device, which is strangely not identified by the keyword `mobile` in its user-agent string.

```typescript
const isAndroidTablet = (): boolean => isAndroid() && !/mobile/i.test(window.navigator.userAgent);
```

---

## isPortrait

Once, I also had to determine if the user’s device was held in portrait mode. Instead of comparing screen dimensions, I utilized the `matchMedia` interface to determine the orientation of the device.

```typescript
const isPortrait = (): boolean => window.matchMedia("(orientation: portrait)").matches;
```

---

## isLandscape

Similarly, we can implement the opposite of the previous function to determine if the device’s orientation is in landscape mode.

```typescript
const isLandscape = (): boolean => !isPortrait();
```

---

## isFullscreen

To determine if a browser is used in fullscreen mode, I typically use the document [fullscreenElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenElement) property, but I also check vendor-specific properties that are supposed to reflect the same information.

```typescript
const isFullscreen = (): boolean => {
	return (
		// @ts-ignore
		// prettier-ignore
		!!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
	);
};
```

---

## isSafari

While the navigator [vendor](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vendor) property is marked as deprecated by MDN, I still rely on it to check if a browser is Safari.

```typescript
const isSafari = (): boolean => /apple/i.test(navigator.vendor);
```

You might argue that this would also return true on an iPhone when, for example, Chrome is used. To that, I would offer a friendly reminder that any browser running on an iPhone or iPad is, unfortunately, still Safari due to Apple’s vendor lockdown monopoly.

---

## isFirefox

Knowing if an application is running in a Firefox browser can be determined by checking the user-agent string.

```typescript
const isFirefox = (): boolean => /firefox/i.test(window.navigator.userAgent);
```

---

## isRTL

Finally, if your application focuses on internationalization, this is how I determine if the content should be read from right to left. I set the [dir](https://developer.mozilla.org/en-US/docs/Web/API/Document/dir) attribute at the top level of the document.

```typescript
const isRTL = (): boolean => {
	const htmlDir = document.documentElement.getAttribute("dir");
	return htmlDir === "rtl";
};
```

To infinity and beyond.
David
