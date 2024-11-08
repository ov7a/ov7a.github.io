---
layout: post
title: Список предупреждений компилятора Kotlin и Java
tags: [kotlin, java]
tg_id: 565
---
Изредка случается, что в Java или Kotlin коде нужно отключить предупреждение, а IntelliJ автоматически по той или иной причине не может добавить нужную аннотацию. Все что есть — текст предупреждения, и если искать по нему что-то в интернете, то [выдается](/2024/04/23/dead-search.html) всякий мусор, и ответам ChatGPT доверять нельзя:

> Q: How can I suppress "Incompatible types" warning in Kotlin?
>
> A: ... Using `@Suppress("UNCHECKED_CAST")`...

(правильный ответ `INCOMPATIBLE_TYPES` если что)

Для Kotlin источником правды будут [исходники](https://github.com/JetBrains/kotlin/blob/master/compiler/frontend/src/org/jetbrains/kotlin/diagnostics/rendering/DefaultErrorMessages.java) (иронично, что они на Java, и там используется `@SuppressWarnings`). Для Java список возможных опций можно найти в [документации](https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html#option-Xlint-custom) к аргументам запуска. Там нет точных сообщений, но сам список вариантов короткий, можно подобрать по смыслу.
