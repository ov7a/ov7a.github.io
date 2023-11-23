---
layout: post
title: Павлик internal
tags: [kotlin]
---
Продолжаю [делать Павликов](/2020/08/04/method-handle.html), потому что все нужное как всегда глубоко закопано и надо [выбирать стул](/gags/#2020-07-28-private-methods-in-library.png). На этот раз на очереди [internal](https://kotlinlang.org/docs/visibility-modifiers.html), который ограничивает видимость элемента модулем (т.е. если он в какой-то библиотеке, то только библиотека имеет к нему доступ). Его очень любят использовать сами Jetbrains в Ktor, корутинах, Exposed и т.п.

Но на самом деле это только ограничение компилятора самого Kotlin — на уровне java [нет никакой видимости "на уровне модуля"](https://youtrack.jetbrains.com/issue/KT-19053), и можно этот `internal` использовать как угодно. И на уровне Kotlin обойти его тоже элементарно: нужно всего лишь добавить `@file:Suppress("INVISIBLE_MEMBER", "INVISIBLE_REFERENCE")`.

При этом многострадальный package-private, который сообщество [хочет](https://youtrack.jetbrains.com/issue/KT-29227) чуть ли не [с релиза](https://discuss.kotlinlang.org/t/kotlin-to-support-package-protected-visibility/1544), в язык не добавляют. И очень смешно, что один из основных аргументов это "ну, все равно особо ни от чего не защищает, используйте `internal`".

В общем, типичная позиция JetBrains — если хочется, то совместимость с java — священная корова, а если очень надо — то и плевать на нее.
