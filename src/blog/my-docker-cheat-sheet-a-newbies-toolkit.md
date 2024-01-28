---
path: "/blog/my-docker-cheat-sheet-a-newbies-toolkit"
date: "2024-01-28"
title: "My Docker Cheat Sheet: A Newbie’s Toolkit"
description: "Simple Docker Commands for Everyday Development on a MacBook M2."
tags: "#programming #webdev #showdev"
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ryeo2D3AbYwp-vOhW5aDWQ.png"
canonical: "https://daviddalbusco.medium.com/my-docker-cheat-sheet-a-newbies-toolkit-d8ee930bca5a"
---

![](https://cdn-images-1.medium.com/max/3584/1*Ryeo2D3AbYwp-vOhW5aDWQ.png)

---

Hey everyone! I’m pretty new to the whole Docker scene and I’ve been hacking around with it to develop a container for [Juno](https://juno.build) devs. I thought I’d share some commands that I’ve found helpful along the way. They’re easy to follow and have been a great aid to me, a self-proclaimed newbie in this domain.

---

## Dockerfile

Before we delve into the Docker commands, let’s begin with a basic Dockerfile as an example, such as the following for a basic Node.js application:

```
# Use the official Node.js 18 Alpine image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci

# Copy the application source code
COPY . .

# Command to run the application
CMD ["node", "src/index.js"]

# Expose port 3000
EXPOSE 3000
```

A Dockerfile is a blueprint for building Docker images. It contains the commands that are executed when the image is assembled with `docker build`. This command does not start the container. Instead, it reads the Dockerfile and executes the instructions within it, resulting in a Docker image. This image contains everything needed to run your application - the base operating system, application code, dependencies, environment variables, and other configurations.

On the contrary, `docker run` will start a container from that image. This is when your application actually starts running. `docker run` takes the image created by `docker build` and starts a container from it. You can start, stop, and restart this container without having to rebuild the image, unless there are changes to the Dockerfile or the context that require a new image to be built.

Now, Let’s Explore the Docker Commands…

---

## Building Your Image

When you’re just getting started, the first step is to build your Docker image. Here’s the command I typically use:

```bash
docker build . --file Dockerfile -t my-project --platform=linux/amd64
```

This command builds an image from the Dockerfile in the current directory and tags it as ‘my-project’.

To ensure compatibility with my MacBook’s architecture, I specify the platform in the command. Additionally, I have enabled “Use Rosetta for x86/amd64 emulation on Apple Silicon” in my Docker settings. I’m using Docker Desktop 4.26.1 with engine 24.0.7.

If you want to see the full stack trace during the build process, you can add `--progress=plain` to the command.

Docker restarts the build process from where a modification was made, rather than proceeding with a full rebuild every time. This saves time and resources. However, if you need to build the image from scratch, ignoring the cache, you can use the `--no-cache` flag.

---

## Running Your Container

Once the image is built, the next step is to run it:

```bash
docker run -p 127.0.0.1:5987:5987 my-project
```

This runs the image and maps port 5987 of my local machine to port 5987 in the Docker container.

---

## Running with Persistent State

Sometimes, it’s crucial to maintain the state of your application between runs. This is especially important in scenarios where your app generates or modifies data that you want to persist. For example, imagine you’re working on a database application or a web application that stores user uploads. If you stop and restart the container, you wouldn’t want to lose all the stored data or have to re-upload files.

That’s where Docker volumes come in handy:

```bash
docker volume create my-state
docker run -p 127.0.0.1:5987:5987 -v my-state:/app/data my-project
```

In this command, `docker volume create myapp_project` creates a new volume named 'my-state'. When running the container, the `-v my-state:/app/data` part mounts this volume to `/app/data` inside the container. This means any data written to `/app/data` in the container is actually written to the volume on the host machine. So, when you stop and restart the container, the data persists.

It is worth noting that Docker manages the volume, so you might not be able to directly browse its contents through a folder using your terminal. If you’re interested in accessing these files, you can utilize the Docker Desktop app, which provides a way to explore what’s inside the volume.

---

## Stopping Containers

To stop all running containers quickly, I use:

```bash
docker stop $(docker ps -aq)
```

---

## Cleaning Up

And finally, when I need or want to clean everything, like removing all images and volumes:

```bash
docker system prune --all --force --volumes
```

This is especially useful when I want to start fresh or free up some space.

---

That’s about it! These commands are the core of my Docker development routine. I hope they prove to be as beneficial for you as they have been for me.
