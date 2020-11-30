---
path: "/blog/trick-javaserver-faces-load-your-bean-data-from-the-client-side"
date: "2019-11-04"
title: "Trick JavaServer Faces, load your bean data from the clientside"
description: "How to trick JSF (JavaServer Faces) while loading your bean data from the clientside with the help of Primefaces"
tags: "#java #tutorial #webdev #primefaces"
image: "https://cdn-images-1.medium.com/max/1600/1*QSKH-4KVY9VB1ssOElKYhQ.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*QSKH-4KVY9VB1ssOElKYhQ.jpeg)

*Photo by [Shawn Pang](https://unsplash.com/@shawnpangg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Commonly we are using JavaServer Faces (JSF) to access to server-side data and logic but it might happen, that we would actually have to fetch data on the client side and would then have to inject these in our server managed beans.

For example, let’s imagine that your client absolutely want to display a random cute picture provided by the third party [Dog API](https://dog.ceo/dog-api/), which we are going to use in this article, in the application but that the server, where the Java application is running, have definitely no internet access despite trying to convince both company and server administrator, that it can’t be developed without internet access.

In such a special case and in a classical Swiss🇨🇭 way of resolving issue, you will probably then have to find a consensus and to implement a trick (or hack, depends if you see the glass half full or half empty 😉) as the one we are going to develop in this blog post.

### Before We Start

To follow this solution you will need a Java project where both JSF and [Primefaces](https://www.primefaces.org) are implemented. If you have none or if you would like to create a blank one, you could proceed as I displayed in my previous article “[Create a Primefaces JSF project with Maven and Widfly](https://medium.com/swlh/create-a-primefaces-jsf-project-with-maven-and-wildfly-bb695bed84c8)”.

### Getting Started

The first time I faced such a dead end as pictured above, I didn’t knew where to begin. After a bit of research I finally found out the cornerstone of the solution respectively the [Primefaces](https://www.primefaces.org/showcase/ui/ajax/remoteCommand.xhtml) `<p:remotecommand/>` which provides a simple way to execute backing bean methods with Javascript. Using it, we are able to send data from Javascript to the beans, decode these information and ultimately “convert” them in bean’s values.

#### Workflow

The workflow of the solution and the steps we are going to follow are the following:

1.  Fetch data from the 3rd party API using Javascript
1.  Pass the results from Javascript to the Java bean using `<p:remotecommand/>`
1.  Parse the information to actual bean object values
1.  Display the bean values on the client side
1.  Init the page with a data

Let’s get started 🚀

### 1. Fetch data from the 3rd party API using Javascript

To begin our implementation we are firstly creating a new page `src/main/webapp/dogs.xhtml` which contains a button, to trigger manually the start of our process, and the remote command. Both components have to be contained in a form.

Moreover we also add the actual implementation of the 3rd party API data fetching. For that purpose, we use the Javascript [Fetch API](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch).

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
     xmlns:h="http://java.sun.com/jsf/html"
     xmlns:p="http://primefaces.org/ui">
<h:head>
   <title>Random dog</title>
</h:head>
<h:body>

   <script type="text/javascript">
      const randomDog = async () => {
        const rawResponse =
          await fetch('https://dog.ceo/api/breeds/image/random');
        if (!rawResponse || !rawResponse.ok) {
           console.error(rawResponse);
          return;
        }
        const result = await rawResponse.text();
      };
  </script>

  <h:form>
     <p:remoteCommand name="loadResult"/>

     <p:commandButton value="Load a random dog"
                      onclick="randomDog();">
         <f:ajax execute="@form" render="@none" />
     </p:commandButton>
  </h:form>

</h:body>

</html>
```

### 2. Pass the results to the bean

You may have noticed that the above `<p:button/>` doesn’t classically call a bean action or listener but rather call immediately the Javascript function `randomDog();` . It means that first of all, we are fetching the data from the client side. Therefore we should now to pass the results to the bean. For that purpose we create a new bean `src/main/java/DogsBean.java` which exposes a method `load()` in order to, guess what, load later one our data 😁.

```java
import java.io.Serializable;
import javax.faces.view.ViewScoped;
import javax.inject.Named;

@Named("dogs")
@ViewScoped
public class DogsBean implements Serializable {
   public void load() {
      // TODO load the data to object values
   }
}
```

Our bean being ready, we could now improve our servlet respectively we link the `<p:remotecommand/>` with the bean `load()` method.

```html
<h:form>
     <p:remoteCommand name="loadResult"
                      action="#{dogs.load()}"
                      process="@this" update="@form"/>
</h:form>
```

We complete the chain by calling the remote command with the result of the Javascript `fetch` 🤓 . For that purpose, we use the function created by the Primefaces remote command, identified with the name `loadResult` we provided, and we pass the information as a new JSON array containing an identifier, a `name` , and a `value` , the result of the fetch respectively the data as text.

```html
<script type="text/javascript">
      // same code as above

      const result = await rawResponse.text();

      loadResult([{
        name: 'dog',
        value: result
      }]);
    };
</script>
```

This call will submit a new request to the server. We could therefore access the parameters of the request in our bean to find out the data we are interested in. These are identified with the identifier, the `name` we provided above respectively `'dog'` .

```java
public void load() {
   final String jsonData = FacesContext.getCurrentInstance()
                           .getExternalContext()
                           .getRequestParameterMap()
                           .get("dog");
}
```

### 3. Parse the information to bean object values

The data delivered by the Dog API are provided as JSON data, for example:

```
{
    "message": "https://images.dog.ceo/breeds/coonhound/n02089078_2794.jpg",
    "status": "success"
}
```

Therefore, in order to parse these to Java object values, we create a new corresponding data transfer object (DTO).

```java
import java.io.Serializable;

public class DogDTO implements Serializable {

   private String message;
   private String status;

   public String getMessage() {
      return message;
   }
   public void setMessage(String message) {
      this.message = message;
   }
   public String getStatus() {
      return status;
   }
   public void setStatus(String status) {
      this.status = status;
   }
}
```

Having both data and Java object, we could now deserialize the information using the Google [gson](https://github.com/google/gson) library which we add as a new dependency in our `pom.xml` .

```xml
<dependency>
  <groupId>com.google.code.gson</groupId>
  <artifactId>gson</artifactId>
  <version>2.8.6</version>
</dependency>
```

We declare declare the above DTO as a member of the bean class and we effectively process the parsing of the data in our `load()` method.

```java
import java.io.Serializable;
import javax.faces.context.FacesContext;
import javax.faces.view.ViewScoped;
import javax.inject.Named;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Named("dogs")
@ViewScoped
public class DogsBean implements Serializable {
   
   private DogDTO dog;

   public void load() {
      final String jsonData = FacesContext.getCurrentInstance()
                           .getExternalContext()
                           .getRequestParameterMap()
                           .get("dog");
      final Gson gson = new GsonBuilder().create();
      dog = gson.fromJson(jsonData, DogDTO.class);
   }

   public DogDTO getDog() {
      return dog;
   }
}
```

### 4. Display the bean values on the client side

We have now fetched data on the client side, sent these to the server but the user still don’t notice any results. For that reason we add a new image to our page which uses our DTO `message` variable as source.

```html
<h:form>
     <p:outputPanel layout="block" rendered="#{dogs.dog != null}">
        <img src="#{dogs.dog.message}" alt="A random dog"/>
     </p:outputPanel>
</h:form>
```

That’s it, our implementation is ready. We could start our application server in a terminal to try out the solution.

```bash
mvn clean install && mvn wildfly:run
```

If everything goes according plan, we could open  our application in our favorite browser at the address [http://localhost:8080/jsf-dogs/dogs.xhtml](http://localhost:8080/jsf-dogs/dogs.xhtml) and should now be able to fetch a random dog each time we call our action 😊

![](https://cdn-images-1.medium.com/max/1600/1*lolMm4r-XdSiapWohK4pLg.gif)

*So much doggy 😍*

### 5. Init the page with a data

This step isn’t mandatory but I think it’s interesting to notice that it is also possible to load data from the client side when the page is accessed. Basically, from the sever side, in our bean, we execute  a Javascript function on the client side, once everything is loaded from the lifecycle `PostContruct` .

```java
@PostConstruct
public void init() {
   PrimeFaces.current().executeScript("randomDog();");
}
```

That’s it, we dit it! We could restart our server and test our final implementation 🎉

![](https://cdn-images-1.medium.com/max/1600/1*jjw6lTngEY7xlODjsbKYjQ.gif)

*An initial doggy and so much other doggy 😍*

### Cherry on the cake 🍒🎂

If you want to avoid the hassle of creating your own project and copying/pasting the above code, I have published the source code and project online on [GitHub](https://github.com/peterpeterparker/jsf-dogs), be my guest and as always, I would be really happy to hear your feedback 😃

To infinity and beyond 🚀

David
