---
path: "/blog/move-a-project-without-losing-claude-code-history"
date: "2026-10-17"
title: Move a Project Without Losing Your Claude Code History
description: "Claude Code saves sessions with absolute paths. Here is how to move or rename a repo without losing your conversations."
tags: "#claudecode #ai #bash"
image: "https://daviddalbusco.com/assets/images/christopher-burns-Kj2SaNHG-hg-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/christopher-burns-Kj2SaNHG-hg-unsplash.jpg)

> Photo by [Christopher Burns](https://unsplash.com/fr/@christopher__burns?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/white-and-black-digital-wallpaper-Kj2SaNHG-hg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I've been working on a rather large personal project for two months now - which I aim to open-source soon.

I spent the first weeks defining its patterns and architecture, and started recently using Claude Code more extensively. This process required a certain investment but, now that the foundations are strictly defined, I can use the LLM assistant to generate boilerplate without too many mistakes. It creates little slop, almost no duplication, while reusing all the patterns and abstractions I put together. I still review every contribution, because a few times a week it takes a decision that could have quite a cost in the future, like requiring a large migration, but I have to say, it pays off.

As per usual, when I started the project I had neither its branding nor its name, so I used a work in progress name which, fun fact - and not kidding - was something like "fckthissolution". I'm building a tool that aims to replace something I've used for several years and about which I'm quite critical (to say the least 😆).

This week, I finally settled on a name. I bought the domains, actually six of them 😅, reserved the GitHub and npm organizations, and even an X handle (even though I don't plan to use it).

So this morning, enjoying my coffee, I decided to reflect those choices by moving and renaming the workspace on my machine. Kind of an important milestone, it means the project isn't something that may or may not be published anymore, but something that will soon be "real".

The mono-repo contains several AGENTS.md files, so the instructions would survive the move, but I wasn’t sure about my chat history.

> Note: if you didn't know, Claude Code now supports AGENTS.md as a fallback for CLAUDE.md, so you don't need the latter in your repo

After prompting and Googling, I learned that one cannot just move a folder and hope Claude Code remembers everything, because it saves its conversations based on the path of the project. There are a few [issues](https://github.com/anthropics/claude-code/issues/27473) about it, as well as some scripts or gists that should take care of such a migration. But, as usual, I rather wanted to understand what needed to change and how, and it turned out to require only a few steps.

Since I might have to go through the same process again in the future, I thought I'd document it, as I've been doing with my blog posts since 2018. So, long story short, here's how you can move and rename a project on your machine and still resume Claude Code with your cherished history.

---

## How Claude Code stores sessions

> Note: obviously, this and the entire article might not be up-to-date anymore by the time you read it, so double check before following it.

From what I understood, Claude Code doesn't identify a project by its name or its Git remote, but by its absolute path on the machine. Each project gets a folder under `~/.claude/projects/`, named after that path with every `/` and `.` replaced by a `-`.

So, for example, for `/Users/daviddalbusco/opensource/my-project`, I get:

```
~/.claude/projects/
├── -Users-daviddalbusco-opensource-my-project/
│   ├── 1f3c...e2a.jsonl
│   └── 9b7d...41c.jsonl
└── ...
```

Each `.jsonl` file is - I'm guessing - a session, which contains the absolute path of the project written over and over again.

Furthermore, there is also a `~/.claude/history.jsonl` file, which similarly contains references to the projects' paths.

If I had moved my repo without updating those references, Claude Code would have computed a new key when resuming, found no folder for it, and the old sessions would not have been found - i.e. I would have restarted with a blank history.

So, here are the few steps I followed to move everything over.

---

## 1. Move the repo

Nothing special here, move or rename the project as you usually would:

```bash
mv ~/opensource/my-project ~/my-new-org/my-renamed-project
```

Not sure about it but, maybe make sure Claude Code isn't running while you do this and the following steps.

---

## 2. Rename the sessions folder

> As for the next two chapters, the script I share below takes care of the renaming.

Rename the matching folder under `~/.claude/projects/` so its name follows the new path:

```bash
mv ~/.claude/projects/-Users-daviddalbusco-opensource-my-project \
   ~/.claude/projects/-Users-daviddalbusco-my-new-org-my-renamed-project
```

---

## 3. Update the paths inside the sessions

After renaming the folder, replace the old path in each and every `.jsonl` file it contains.

---

## 4. Update the global history

Same story for `~/.claude/history.jsonl`, which keeps track of your prompts across all projects. Update the entries with the new path.

---

## 5. The sandbox

Last but not least. If, like me, you run Claude Code with the sandbox enabled, don't forget to update your `~/.claude/settings.json` as well.

For example, if you allow readable paths, update those to reflect the change, otherwise the resumed session won't be able to read your project anymore:

```json
"sandbox": {
  "enabled": true,
  "autoAllowBashIfSandboxed": false,
  "allowUnsandboxedCommands": false,
  "filesystem": {
    "denyRead": ["~/"],
    "allowRead": [
      "/Users/daviddalbusco/my-new-org/my-renamed-project"
    ]
  }
}
```

---

## The script

While steps 2 and 4 can be done manually as they do not require much work, updating all `.jsonl` files might require a bit more time.

So, here's a script that takes care of those steps:

> ⚠️ The script is kept short so that you can easily review it. I hate those long gists where you don't know whether they'll inject some malicious code or not. As with the rest of this article, double check before executing it.

```bash
#!/bin/bash

OLD="/your/project/original/path"
NEW="/your/project/new/path"

OLD_KEY=$(echo "$OLD" | sed 's#[/.]#-#g')
NEW_KEY=$(echo "$NEW" | sed 's#[/.]#-#g')

if [ -d "$HOME/.claude/projects/$OLD_KEY" ]; then
  mv "$HOME/.claude/projects/$OLD_KEY" "$HOME/.claude/projects/$NEW_KEY"
fi

if [ -d "$HOME/.claude/projects/$NEW_KEY" ]; then
  find "$HOME/.claude/projects/$NEW_KEY" -name '*.jsonl' -exec \
    sed -i '' -e "s#$OLD_KEY#$NEW_KEY#g" -e "s#$OLD#$NEW#g" {} +
fi

if [ -f "$HOME/.claude/history.jsonl" ]; then
  sed -i '' -e "s#$OLD_KEY#$NEW_KEY#g" -e "s#$OLD#$NEW#g" "$HOME/.claude/history.jsonl"
fi
```

`OLD_KEY` and `NEW_KEY` are the dash-prefixed folder names used by Claude Code.

The `sed` patterns replace the paths in all the `.jsonl` files of the project and within `history.jsonl`.

---

## Resume

That's it. Run `claude --resume` from your project root, pick your previous session and carry on with your history in your pocket 🥳.

Hope it saves your history too.

Until next time!
David
