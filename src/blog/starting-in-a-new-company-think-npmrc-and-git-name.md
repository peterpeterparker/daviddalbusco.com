---
path: "/blog/starting-in-a-new-company-think-npmrc-and-git-name"
date: "2020-03-24"
title: "Starting In A New Company? Think Npmrc And Git Name"
description: "How to configure your company's npm Enterprise registry and provide your name for Git interactions"
tags: "#git #npm #bash #freelance"
image: "https://daviddalbusco.com/assets/images/1*HG7Ivs6JrMErB7GdQZWSog.png"
canonical: "https://medium.com/@david.dalbusco/starting-in-a-new-company-think-npmrc-and-git-name-ebf44f71e498"
---

![](https://daviddalbusco.com/assets/images/1*HG7Ivs6JrMErB7GdQZWSog.png)

_Photo by [Max Rovensky](https://unsplash.com/@fivepointseven?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-six** days left until hopefully better days.

---

Every single time I am hired to join a team as an external developer for a while, I can guarantee you that I will have to google how I can configure the company [npm](https://www.npmjs.com) Enterprise registry on my laptop 🙈. Moreover, it is also pretty sure that my first commit is going to happens with my GitHub username [peterpeterparker](https://github.com/peterpeterparker) instead of my real name or any other expected IDs 😄.

Therefore see this new article as an open letter to my future self 😉.

---

### Setting your company’s npm Enterprise registry

If the company has hired you, there is a good chance that, unfortunately, at least some of their work is only available as closed source and distributed with a npm private registry. To configure such an entry, you can run the following command line in a terminal.

```bash
npm config set registry
```

#### Npmrc

If like me you are using your own laptop, you might not want to modify or mix up your private configuration with you client configuration right?

That’s why [npmrc](https://docs.npmjs.com/configuring-npm/npmrc.html) is there for us. With its help we are going to be able to define and switch between multiple npm profiles.

If you have not yet installed it, let’s first do so.

```bash
npm i npmrc -g
```

Once installed, we can use it to create Enterprise profile. For example, let’s create a profile called “client”.

```bash
npmrc -c client
```

After the profile has been created, it becomes the one in use, therefore, if we run the registry command, it will now set the registry only for the active profile.

```bash
npm config set registry
```

#### Switch Between Profiles

Cool we now in our “client” profile, but how do we go back to the previous one, the default one? Nothing easier, run the `npmrc` command followed by the profile’s name.

```bash
npmrc default
```

Or if you want to switch back to the “client” one.

```bash
npmrc client
```

If you are lost and don’t know which profile is currently active, typing `npmrc` without any arguments will list the available profiles.

```bash
npmrc

Available npmrcs:

* default

client
```

#### Manual Configuration

You might like command lines but you may also rather like to modify manually your configuration using `vi` for example 😉.

On a Mac, the profiles find place in a folder `.npmrcs` added to your user directory. When you switch between these, `npmrc` is going to change the symlink at the root of your profile.

```bash
ls /Users/daviddalbusco/.npmrcs/default
/Users/daviddalbusco/.npmrcs/default

ls /Users/daviddalbusco/.npmrcs/client
/Users/daviddalbusco/.npmrcs/client

ls -ltr /Users/daviddalbusco/.npmrc
/Users/daviddalbusco/.npmrc -> /Users/daviddalbusco/.npmrcs/default
```

---

### Setting Your Name In Git

To specify another name and email for your Git activity, you can either edit your global `config` or proceed by repository, up to you. I personally rather like to proceed by projects because I’ve got many clients.

Therefore, if like me you want to use your real name instead of your super cool GitHub username and also specify the email your client assigned to you, you can edit the file `.git/config` which find places, normally, in any Git project. In this data, add the following information:

```bash
[user]
    email = david.dalbusco@company.com
    name = David Dal Busco
```

And that’s it, all the interactions with the specific repo are going to be identified with these information.

Note that if you rather like to specify other inputs on a global level, you can run the following command lines.

```bash
git config --global user.name "David Dal Busco"
git config --global user.email "david.dalbusco@company.com"
```

Finally, in case you would have already performed a commit and are looking to amend your last commit user name, you can proceed with the `--amend` option of Git.

```bash
git commit --amend --author=”David Dal Busco <david.dalbusco@company.com>”
```

---

### Summary

Well I am pretty sure that even if I wrote the above lines, I may forget again in the future how I have to proceed. But at least this time, I will just have to browse my blog history 😇.

Stay home, stay safe!

David
