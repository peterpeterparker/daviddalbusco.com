---
path: "/blog/introducing-tie-tracker-a-simple-open-source-and-free-time-tracking-app"
date: "2020-03-11"
title: "Introducing: Tie Tracker. A simple, open source and free time tracking app ⏱️"
description: "Introducing: Tie Tracker. A simple, open source and free time tracking app ⏱️"
tags: "#webdev #showdev #javascript #react"
image: "https://daviddalbusco.com/assets/images/1*jjeZp6_jbltdQSeOcTGdlg.png"
canonical: "https://medium.com/@david.dalbusco/introducing-tie-tracker-e407daec4121"
---

![](https://daviddalbusco.com/assets/images/1*jjeZp6_jbltdQSeOcTGdlg.png)

I’m happy to share with you [Tie Tracker](https://tietracker.app.link): a simple, open source and free time tracking app ⏱️.

<iframe width="280" height="158" src="https://www.youtube.com/embed/iXDPd6hShA0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe
<br/>

### Back Story

Last December, in between clients' projects, I had some spare time to learn new concepts. Of all of interesting subjects out there, one particular retained my attention: improving my [React](https://reactjs.org) skills and giving a real try to [Redux](https://react-redux.js.org).

Knowing my self, in comparison to experimenting, I knew I had to implement something concrete to get to feel comfortable with the technologies, specially with Redux. That’s why I came back to my long time idea to implement a time tracking and reporting application which perfectly matches my business processes.

Nevertheless, at this point, I was still unsure to start or not this project. After all, developing an application needs a certain effort. Moreover, I was not that motivated to develop yet again another solution which would need a cloud, authentication and database.

But after much thinking about it, I finally found the last bit of motivation: I would develop the app to run entirely offline, with the help of [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), and I would give a try to [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) to defer “heavy” computation.

And that was it, I was all in. I started my new [Ionic](https://ionicframework.com) app and I developed my new tool 😁.

### Features

The application helps track productivity and billable hours for a list of clients and projects. Each entries can be billed. It also supports miscellaneous currencies and optionally a VAT rate.

- ✅ Simple work hours tracking
- ✅ Assign time to clients and projects
- ✅ Mark entries as billed

### Reporting

For my company, I use a third party online accounting system to generate my client’s bill. When I send these, I join a report of every worked hours I spent on the projects for the selected period. So far, I was editing these timesheets manually but fortunately, I can now extract these on demand directly from Tie Tracker 😄.

- ✅ Export open invoices to XLSX timesheets
- ✅ Weekly work summary
- ✅ Daily list of activities

### Goodies

Of course I had to implement some goodies 😉. One of these is an hourly reminder, through local notifications, about a task in progress. This notably took me some iterations before being stable, mobile development sometimes needs patience 😅.

I was also a little bit concerned about the persistence of the data on mobile devices, specially regarding iOS and its reliability with IndexedDB. To overcom this concern, I implemented a backup process: once a week, the application asks the user, if she/he would like to export all current not billed hours.

- Light and dark theme
- Weekly backup
- Hourly notification for task in progress (only mobile devices)

### Open Source

Obviously, at least for the few of you who are reading my articles time to time knowing that I have got an “open source mindset per default”, how could it have been different? Tie Tracker is open source, licensed under license AGPL v3 and above, its source code is available on [GitHub](https://github.com/peterpeterparker/tietracker) and contributions are most welcomed 🙏.

### What’s Next

I have used [Tie Tracker](https://tietracker.app.link/) for three months now and I have billed several clients with it, therefore it already improved my daily work life. However, there are still two features I would like to develop and if there would be a public interests for an online mode in order to save the data in the cloud, I would consider to go further. Get in touch if you are interested!

To infinity and beyond 🚀

David
