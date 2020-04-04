---
layout: post
title: Java становится похожа на Kotlin
tags: [java]
---
Java с каждой версией все больше и больше похожа на Kotlin/Scala/C#. И если раньше была вполне очевидная ниша для enterprise-языка с низким порогом вхождения, то сейчас это уже получается весьма странный зверь. 

В 8 java завезли функциональные методы работы с коллекциями, лямбды и Optional.

В 10 java добавили var.

С 12 java `switch` может быть выражением.

В 13 java добавили тройные кавычки для строковых литералов.

В грядущей 14 версии добавят: 
* записи (как data-классы Kotlin)
* паттерн матчинг в стиле C#
```java
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.toUpperCase());
}
```

Но есть и довольно клевая фича, которая выгодно отличает от других: хорошее описание для NPE, которое говорит, в каком именно методе цепочки была ошибка, а не тупо строчку:
```
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because the return value of "Address.getStreet()" is null
  at Program.getStreetFromRequest(Program.java:10)
  at Program.main(Program.java:6)
```

В 15 java обещают sealed типы. Движение в сторону здорового паттерн-матчинга. 

См. также [википедию](https://en.wikipedia.org/wiki/Java_version_history) и [статью на хабре](https://habr.com/ru/company/dins/blog/488302/).
