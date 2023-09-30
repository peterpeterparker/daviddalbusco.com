---
path: "/blog/git-commands-i-always-forget"
date: "2020-04-16"
title: "Git Commands I Always Forget"
description: "Revert last commit, change last or multiple commit messages or delete tags"
tags: "#git #bash #github"
image: "https://cdn-images-1.medium.com/max/1600/1*9xilCpCgG-BqhOICl-zNCg.png"
canonical: "https://medium.com/@david.dalbusco/git-commands-i-always-forget-24cbb71c502a"
---

![](https://cdn-images-1.medium.com/max/1600/1*9xilCpCgG-BqhOICl-zNCg.png)

_Photo by [Jonatan Lewczuk](https://unsplash.com/@jonny_lew?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Three** days left until this first milestone. Hopefully better days are ahead.

---

When it comes to [Git](https://git-scm.com/), I probably rely too much on its really well-made integration of my editor, [WebStorm](https://www.jetbrains.com/webstorm/). This has for consequence, that I sometimes forget useful commands, even simple ones, which I only have rarely to run in my terminal.

That’s why I am sharing this blog post mostly for my future self 😅.

---

### Revert Last Commit

To revert your last commit if it has not been pushed yet, you can rewind the history from a step back with the help of the `reset` command.

However, if your commit has already been pushed, you can preserve your history and run a `revert` command (where `eec47301` is the revision number of the commit to revert which can be found for example with the help of the `git log` command) followed by a commit and push.

```bash
git revert eec47301
```

Alternatively revert it without preserving the history with the help of the `reset` command and the option `--hard` followed by a push with the option `--force`.

```bash
git reset --hard eec47301
```

Needless to say, it has to be use wisely.

---

### Change Last Commit Message

If your last commit message was wrong or if you had for example a typo, you can modify the last, or most recent, commit message with the option `--amend` .

```bash
git commit --amend
```

If your commit has not been pushed yet, nothing else to do. To the contrary, if you already have pushed it, you can update your repo with `--force` .

```bash
git push --force
```

---

### Change Multiple Commit Messages

If you are looking to amend multiple commit messages, which might happens for example if you did forget to specify the related issue number, you can proceed with the help of `rebase` .

Credits for this solution goes to these provided by [Jaco Pretorius](https://jacopretorius.net/2013/05/amend-multiple-commit-messages-with-git.html) and [Linuxize](https://linuxize.com/post/change-git-commit-message/). Not all heroes wear capes!

To start amending we run the following command where `2` is the number of commits on which we want to perform a `rebase` .

```bash
git rebase -i HEAD~2
```

This will open a prompt which will allow us to specify changes on each commits.

```bash
pick e68a142 my frst update
pick 1613f1e my scnd update
```

As we want to change the commit message, we modify `pick` with `reword` (or the short version `r` ).

```bash
reword e68a142 my frst update
reword 1613f1e my scnd update
```

Once done, we save ( `:wq` ) and the prompt will automatically guide us to the first selected commit we would like to change.

```bash
my frst update
```

We can correct the message (`x` to delete a character, `i`s to switch to insert mode, `a`a to append and always `Esc` escape editing mode), save it and the prompt will again automatically guide us to the next commit message we would like to change and so on.

```bash
my snd update
```

Once finished, our terminal will look like the following:

```bash
❯ git rebase -i HEAD~2

[detached HEAD 1f02610] my first update

Date: Thu Apr 16 15:55:09 2020 +0200

1 file changed, 1 insertion(+), 1 deletion(-)

[detached HEAD 68d3edd] my second update

Date: Thu Apr 16 16:00:29 2020 +0200

1 file changed, 4 insertions(+)

Successfully rebased and updated refs/heads/master.
```

At this point our history is locally rewritten but not yet updated in our repo, that’s why we push these.

```bash
git push --force
```

---

### Abort Rebase

If you would face problems while running the above process, you would be able to cancel the rebase operation using `--abort`.

```bash
git rebase --abort
```

---

### Abort Merge

Speaking of abort, it is also possible to quit a merge while using the same option.

```bash
git merge --abort
```

---

### Delete A Tag

When you delete a release on [GitHub](https://github.com/), it does delete it but it does not delete the related tag. Typically, if you go back to your repo with your browser, it is still displayed.

![](https://cdn-images-1.medium.com/max/1600/1*iRWNQQhtlR3gWy65f0qi0g.png)

If you would like to remove such tags, you can do so with the help of a Git push and the option`--delete` followed by the name of the tag to remove.

```bash
git push --delete origin v0.0.1
```

---

### Summary

Hopefully this time I will remember these command lines but if not, at least I will know where to find them 😁.

Stay home, stay safe!

David
