---
layout: post
title: Запретный плод для Java
tags: [java, kotlin, testing]
---
Один из популярных вопросов начального уровня на Java-собесе — "можно ли переопределить статический метод?". И правильный ответ — нельзя.

Однако, если очень надо, то это [возможно](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#48):
```java
public class Foo {
  public static void bar(){
    System.out.println("Foo");
  }
}
```
```kotlin
Foo.bar()

Mockito.mockStatic(Foo::class.java)
whenever(Foo.bar()).then { println("not foo") }
Foo.bar()
```
выведет:
```
Foo
not foo
```

Разумеется, если вам это вдруг нужно, то с большой вероятностью вы делаете что-то не то (мало того, что у вас рак в виде java, так еще и со статическими методами, которые требуют переопределения). Однако мне это пригодилось, когда понадобилось протестировать работу с переменными окружения, которые как раз засунуты в статический метод `System.getenv()` (для этого я использовал [system stubs](https://github.com/webcompere/system-stubs)).

