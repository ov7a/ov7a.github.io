---
layout: post
title: Java Script
tags: [java]
tg_id: 677
---
На java можно писать скрипты. Во-первых, [аж с 11 версии](https://openjdk.org/jeps/330) можно было тупо исполнить код из `*.java` файла. Во-вторых, если убрать расширение и использовать последнюю версию (25), то можно даже сделать так:
```java
#!/usr/bin/env -S java --source 25

void main() {
   IO.println("Hello, world!");
}
```
Без класса и `public static void` всяких! [\*brain_expodes.gif\*](/gags/#2025-07-14-cpp-println.gif).

А еще с помощью [jbang](https://www.jbang.dev/) можно и зависимости в скрипт запихать... [\*троллебус.jpeg\*](/assets/images/trolleybus.jpeg).

Еще одно доказательство, что JVM — [это интерпретатор](/2023/09/05/compiled-vs-interpreted.html) :)

