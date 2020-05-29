---
layout: post
title: Импорт вложенных структур
tags: [bestpractices, intellij]
---
Если надо импортировать значение из enum, то <kbd>Alt</kbd>+<kbd>Enter</kbd> в Intellij по умолчанию вам любезно добавит имя enum спереди, превратив
```kotlin
val color = RED
```
в
```kotlin
import my.package.Colors
...
val color = Colors.RED
```
По моему опыту, это чаще всего не нужно: обычно по контексту и значению enum очевидно, какому перечислению оно принадлежит. Чтобы изменить это поведение, [есть настройка](https://stackoverflow.com/questions/8085231/intellij-auto-import-for-inner-classes) "insert imports for inner classes". При ее изменении будет добавляться полный импорт:
```kotlin
import my.package.Colors.RED
...
val color = RED
```
Но до фанатизма доводить не стоит: бывают случаи, когда лучше все-таки использовать квалифицированное значение (т.е. с именем enum спереди). Например, когда в области видимости есть enum со схожими по смыслу и/или написанию значениями.

