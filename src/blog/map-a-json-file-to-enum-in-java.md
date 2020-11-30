---
path: "/blog/map-a-json-file-to-enum-in-java"
date: "2019-08-16"
title: "Map a JSON file to ENUM inJava"
description: "Map a JSON file to ENUM inJava"
tags: "#java #tutorial #webdev #maven"
image: "https://cdn-images-1.medium.com/max/1600/1*qSYqGVlUNNhJgsYDxenv9A.jpeg"
---

![](https://cdn-images-1.medium.com/max/1600/1*qSYqGVlUNNhJgsYDxenv9A.jpeg)
*More about Le Gruyère AOP on [MySwitzerland.com](https://www.myswitzerland.com/en-ch/experiences/food-wine/le-gruyere-aop/)*

I recently began a new good old JAVA friend  project for a returning client. One of my first task was to implement a new feature which had, notably, for goal to make the application globally configurable using a JSON property file.

I found the outcome of the solution relatively handy and therefore I thought that I would share it in a new blog post. Moreover, as I never wrote any Java blog post so far,  I found it quite challenging and interesting 😉

### Introduction

In this article we are going to:

1.  Create a new project
1.  Read a JSON file and property
1.  Create an ENUM
1.  Map the properties to a generic  ENUM

*Note: If you already have a project, you could obviously skip the first chapter which has for goal to create a project. Likewise, if you would not like to use Maven, skip it too and include the library we are going to use as requested by your setup.*

### Create a new project

To get started, we are going to create a new project using the [Maven](https://maven.apache.org) starter kit. For that purpose run the following command in a terminal:

```
$ mvn archetype:generate -DgroupId=com.jsontoenum.app -DartifactId=json-to-enum -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

If everything went well, you should now be able to jump into the directory in order to compile the project without errors:

```
$ cd json-to-enum/ && mvn package
```

### Read a JSON file and property

At first I implemented a quick custom solution but I wasn’t, at all, enough happy with the outcome. That’s why I tried to find online a ready-to-go solution and found out the incredible open source library [com.typesafe.config](https://github.com/lightbend/config). It leverages all the work to read JSON files and access their properties, has no dependencies and is even compatible with Java 8 🚀

For once at least, googling a solution was an excellent idea 😉

![](https://cdn-images-1.medium.com/max/1600/1*Q2m7fr30xL1yj3gNZIunNQ.jpeg)

To use the library, let’s add this library has a new dependency to our `pom.xml`:

```
<dependency>
    <groupId>com.typesafe</groupId>
    <artifactId>config</artifactId>
    <version>1.3.4</version>
</dependency>
```

Moreover we should also add the following `<resources/>` and `<plugins/>` goals to our `<build/>` in order to be able to load the JSON file (we are about to create) and to package the dependency we just referenced within our JAR file.

```
<resources>
  <resource>
    <directory>src/resources</directory>
  </resource>
</resources>
<plugins>
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.2.0</version>
    <executions>
      <execution>
        <phase>package</phase>
        <goals>
          <goal>shade</goal>
        </goals>
      </execution>
    </executions>
  </plugin>
</plugins>
```

Our build is finally set up. We could now move on to the next step and create our JSON property file. Per default, the configuration library will try to load a file called `application.json` as source for the properties. Therefore, let’s keep it simple and use that predefined name to create this new file, in a new folder `src/resources/` , with the following JSON content:

```
{
  "swiss": {
    "cheese": "gruyere"
  }
}
```

Everything is set, finally time to code 😇 We could modify our application (`App.java` in folder `src/main/java/com/jsontoenum/app)` in order to init and load the properties from the JSON file and print out the name of our favorite type of cheese 🧀

```
package com.jsontoenum.app;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

public class App {
    public static void main(String[] args) {
        // Load and init the configuration library
        final Config conf = ConfigFactory.load();
        
        // Get the value of the JSON property
        final String cheese = conf.getString("swiss.cheese");
        
        System.out.println(String.format("I like %s 🧀", cheese));
    }
}
```

Let’s compile everything and run our project using the following command line in a terminal to try out our implementation:

```
$ mvn package && java -cp target/json-to-enum-1.0-SNAPSHOT.jar com.jsontoenum.app.App
```

If everything went find, your console output should display the following at the end of the stacktrace:

```
[INFO] -------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] -------------------------------------------------------------
[INFO] Total time:  2.179 s
[INFO] Finished at: 2019-08-16T15:04:35+02:00
[INFO] -------------------------------------------------------------
I like gruyere 🧀
```

### Create an ENUM

Even if it was already cool to be able to read JSON properties, I quickly realized, while developing my assigned feature, that being able to map the properties to ENUM would kind of be mandatory if the application is supposed to behave differently according these. Moreover, Switzerland produces more than one kind of cheese 😉

As next step we could therefore create an ENUM in folder `src/main/java/com/jsontoenum/app/` which could list a couple of cheese from the French-speaking part of the country:

```
package com.jsontoenum.app;

public enum Cheese {

   GRUYERE,
   TETE_DE_MOINE,
   CHAUX_DABEL,
   RACLETTE,
   VACHERIN,
   TOMME

}
```

### Map the properties to a generic ENUM

In this article we are using cheese for demo purpose but obviously, Switzerland exports many other products like chocolates or watches. Likewise, the application I’m working on doesn’t contains only a single ENUM. That’s why we are not just going to add a method to parse the properties to a single type of ENUM but rather declare it as generic in our application (`App.java` ):

```
private static <E extends Enum<E>> E getEnumProperty(final Config conf, final String key, final Class<E> myClass) {
    // If no config loaded
    if (conf == null) {
        return null;
    }

    // If the config doesn't contains the key
    if (!conf.hasPath(key)) {
        return null;
    }

    // As previously, load the key value
    final String keyValue = conf.getString(key);

    // Does the property has a value
    if (keyValue == null || keyValue.isEmpty()) {
        return null;
    }

    // Map the property to the ENUM
    return Enum.valueOf(myClass, keyValue.toUpperCase());
}
```

Finally, for the final test, let’s enhance our `main` method by loading the ENUM and testing it to display if the cheese is our favorite one or not:

```
public static void main(String[] args) {
    // Load and init the configuration library
   final Config conf = ConfigFactory.load();

   // Get the value of the JSON property
   final Cheese cheese =
                getEnumProperty(conf, "swiss.cheese", Cheese.class);

   if (Cheese.GRUYERE.equals(cheese)) {
       System.out.println(String.format("I really like %s 🧀", cheese));
   } else {
       System.out.println(String.format("%s is ok", cheese));
   }
}
```

Voilà, that’s it, nothing more, nothing less 🎉 

You could try to run our project using the previous command line and if everything goes according plan, the output should looks like the following:

```
[INFO] -------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] -------------------------------------------------------------
[INFO] Total time:  2.437 s
[INFO] Finished at: 2019-08-16T15:43:42+02:00
[INFO] -------------------------------------------------------------
I really like GRUYERE 🧀
```

### Cherry on the cake 🍒🎂

If you want to spare the hassle of creating your own project and copying the above code, I have published the project online, be my guest 😇

```
$ git clone https://github.com/peterpeterparker/json-to-enum.git
```

To infinity and beyond 🚀

David
