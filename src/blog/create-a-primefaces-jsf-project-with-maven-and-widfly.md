---
path: "/blog/create-a-primefaces-jsf-project-with-maven-and-widfly"
date: "2019-10-30"
title: "Create a Primefaces JSF project with Maven and Widfly"
description: "How to create a Primefaces and JSF project with Maven and Widfly as a local server"
tags: "#tutorial #java #jsf #primefaces"
image: "https://cdn-images-1.medium.com/max/1600/1*35EpK66yg5VJBNvbzaLBmw.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*35EpK66yg5VJBNvbzaLBmw.jpeg)
*Photo by [Michal Mrozek](https://unsplash.com/@miqul?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/fuerteventura?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I'm currently on my way to Fuerteventura to enjoy a week of holidays ☀️ Earlier this year, I found out that writing blog posts was a great way to use wisely my time spent traveling, that's why I'm repeating the experience.

When I thought about which subject I should write about earlier this morning (I don't generally have any plan in advance when it comes to writing) I came to the idea that it would be maybe interesting to share my favorite JSF trick (or hack, depends if you see the glass half empty or full). But before doing so, I had to initialize a clean blank project, that's why I've decided to first write this tutorial. Moreover, I spare the other article idea for my way back home 😋   

### But why a JSF project?

![](https://cdn-images-1.medium.com/max/1600/1*evsRlXzetp7FdEOK2ynL1Q.gif)

*But why a JSF project?*

Honestly, I don't know exactly why anyone would be still interested to create a brand new JSF project in 2019 and even why would anyone even read this article 🤣. Not that I don't like Java, I still do and I still think it's a good match for certain types of projects, notably when it goes to the back- and middle-end layers but I would personally not use or advice it for the frontend part of any **new** projects.

That's why I'm really curious to hear your voice, why are you reading this article? Why are you looking to create a JSF project? Let me know with a comment 😁

### Getting started

In this article we are going to follow the following steps:

1. Create a new web project
2. Add a Wildfly development server to our tooling
3. Load and configure JSF
4. Implement Primefaces

Let's get started 🚀

### 1. Create a new project

To create a new project, we are going to use [Apache Maven](https://maven.apache.org) and its [web starter kit](https://maven.apache.org/archetypes/maven-archetype-webapp/) or as it is described in its documentation "an archetype which generates a sample Maven webapp project".

For this purpose we run the following command in a terminal:

```bash
mvn archetype:generate -DgroupId=com.jsfdemo.app -DartifactId=jsf-demo -DarchetypeArtifactId=maven-archetype-webapp -DarchetypeVersion=1.4 -DinteractiveMode=false
```

If everything went according plan, we should be able to change directory and compile the project without any errors:

```bash
cd jsf-demo/ && mvn package
```

### 2. Add a Wildfly development server to our tooling

[WildFly](https://wildfly.org), formerly known as JBoss, is an application server authored by JBoss, now developed by [Red Hat](https://www.redhat.com). Wildfly could be added to Maven's project thanks to the plugin `wildfly-maven-plugin`. Through its usage you could either interact with your local installed server or deploy one on the fly which is the option we are going to use.

To add it to our project, we are going now to edit our `pom.xml`. We add a new `<dependency/>` to our `<dependencies/>` and we add it as another `<plugin/>` too.

```xml
<dependency>
  <groupId>org.wildfly.plugins</groupId>
  <artifactId>wildfly-maven-plugin</artifactId>
  <version>2.0.1.Final</version>
  <type>maven-plugin</type>
</dependency>

<plugin>
    <groupId>org.wildfly.plugins</groupId>
    <artifactId>wildfly-maven-plugin</artifactId>
    <version>2.0.1.Final</version>
</plugin>
```

Once the configuration saved, we could build and install our project and run the application to test our setup with our browser respectively [http://localhost:8080/](http://localhost:8080/) should gives us access to its administration console and [http://localhost:8080/jsf-demo](http://localhost:8080/jsf-demo) to a default "Hello World" page. 

```bash
mvn clean install && mvn wildfly:run
```

![](https://cdn-images-1.medium.com/max/1600/1*Bj1lhJuKOuWch0DICh7npA.png)

*Administration console*

![](https://cdn-images-1.medium.com/max/1600/1*nWVepJkORKK6_wp4w2EB3Q.png)

*"Hello World" page*

#### Note

This Wildfly plugin doesn't work, out of the box, offline. Even if I fetched everything and already ran my project before taking the plane, I was unable to run it during the flight.

### 3. Load and configure JSF

There are different implementations of the JavaServer Faces API (JSF). For the purpose of this tutorial we are going to use the one from [Oracle](https://www.oracle.com/technetwork/java/index.html) which we are going to add as a new `<dependency/>` to our `pom.xml`.

```xml
<dependency>
    <groupId>com.sun.faces</groupId>
    <artifactId>jsf-api</artifactId>
    <version>2.2.20</version>
</dependency>
```  

Beside the dependency, we also have to configure our application server to make it able to resolve `jsf` and `xhtml` target pages and to make these able to communicate with our beans. This configuration find place and in `src/main/webapp/WEB-INF/web.xml`:

```xml
<!DOCTYPE web-app PUBLIC
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
 "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>

  <context-param>
    <param-name>javax.faces.PROJECT_STAGE</param-name>
    <param-value>Development</param-value>
  </context-param>

  <servlet>
    <servlet-name>Faces Servlet</servlet-name>
    <servlet-class>javax.faces.webapp.FacesServlet</servlet-class>
  </servlet>

  <servlet-mapping>
    <servlet-name>Faces Servlet</servlet-name>
    <url-pattern>*.jsf</url-pattern>
  </servlet-mapping>

  <servlet-mapping>
    <servlet-name>Faces Servlet</servlet-name>
    <url-pattern>*.xhtml</url-pattern>
  </servlet-mapping>
</web-app>
```

Our application being configured, we could created our first Java bean, `HelloWorldBean.java`, in `src/main/java`. This class will be a simple backed bean which exposes a method to say hello to the world from Fuerteventura.

```java
import javax.faces.bean.ManagedBean;

@ManagedBean(name = "helloworld", eager = true)
public class HelloWorldBean {

	public String getMessage() {
		return "Hello World from Fuertefentura";
	}

}
```

Finally, to present this message, we add a new servlet, `hello.xhtml`, in `src/main/webapp` which uses our above bean.

```xhtml
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>#{helloworld.message}</title>
</head>
<body>
#{helloworld.message}
</body>
</html>
```

As before, to try out our code, we build our project and run the server again.

```bash
mvn clean install && mvn wildfly:run
```

If we access [http://localhost:8080/jsf-demo/hello.xhtml](http://localhost:8080/jsf-demo/hello.xhtml) with our browser, we should now see the friendly message as title and content of the page.  

![](https://cdn-images-1.medium.com/max/1600/1*c6cxLyLRRScp0nTWgya9zQ.png)

*"Hello World form Fuerteventura"*

###  4. Implement Primefaces

[Primefaces](https://www.primefaces.org) is an UI toolkit build at the top of JSF. It add multiple components like table, panel, dialog, etc. You might not need it but I do need it for my next blog post, therefore, let's add it to our project too 😇

We proceed as the pasts steps by adding a new `<dependency/>` to our `pom.xml`:

```xml
<dependency>
    <groupId>org.primefaces</groupId>
    <artifactId>primefaces</artifactId>
    <version>7.0</version>
</dependency>
```

No special configuration is needed and out of the box we should already be able to use their components. We could for example extend our `hello.xhtml` with an horizontal panel.

```xhtml
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
	  xmlns:h="http://java.sun.com/jsf/html"
	  xmlns:p="http://primefaces.org/ui">

<h:head>
	<title>#{helloworld.message}</title>
</h:head>

<h:body>
	<p:panel id="horizontal" header="Horizontal Toggle" toggleable="true" toggleOrientation="horizontal">
		<h:panelGrid columns="2" cellpadding="10">
			<img src="https://images.unsplash.com/photo-1545289415-50dff9405935?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=250&amp;q=80"/>

			<h:outputText value="#{helloworld.message}" />
		</h:panelGrid>
	</p:panel>

</h:body>
</html>
```

We could again build and start our application server to try out our implementation.

```bash
mvn clean install && mvn wildfly:run
```

Finally we could check [http://localhost:8080/jsf-demo/hello.xhtml](http://localhost:8080/jsf-demo/hello.xhtml) in our browser to check if everything is correctly running.  

![](https://cdn-images-1.medium.com/max/1600/1*hBnP4yj5wIgn9fE-NJc-bA.png)
*“Hello World from Fuerteventura” presented in a Primefaces’ panel*

Voilà, we did it! We created a Primefaces JSF project with Maven and Widfly and are now able to make some testing 🎉 Moreover, when it comes to me, even if I'm not looking forward to going home (yet), I could use this blank new project as a support for my next article 😆

To infinity and beyond 🚀

David
