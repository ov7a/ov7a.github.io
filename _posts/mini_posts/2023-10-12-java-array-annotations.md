---
layout: post
title: Аннотации массивов в java
tags: [java]
---
Психолог: заковыристые типы в Java не существуют, они не могут причинить тебе вреда.

Тем временем [java](https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html#jls-9.7.4): `@Nullable List<? extends @Nullable Object> @NotNull [] @Nullable [] someVar`.

Вьетнамские флешбеки от [сишных указателей](https://cdecl.org/).

Если серьезно, то массивы всегда были "особенными": вроде [и не примитивы, но и не классы](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.3.1). Еще и куча исключений, настолько, что это в Kotlin [просочилось](https://kotlinlang.org/docs/java-interop.html#java-arrays).
