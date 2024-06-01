---
layout: post
title: Suspend функции в Scala
tags: [scala, kotlin]
tg_id: 318
---
В продолжение темы об излишних переусложнениях — на форуме Scala [обсуждают](https://contributors.scala-lang.org/t/pre-sip-suspended-functions-and-continuations/5801) предложение о добавлении корутин в стиле Kotlin. Со всеми недостатками двухцветных функций. Рекомендую почитать критику от [де Гуза](https://contributors.scala-lang.org/t/pre-sip-suspended-functions-and-continuations/5801/20) (автора ZIO) и сдержанный ответ [Одерски](https://contributors.scala-lang.org/t/pre-sip-suspended-functions-and-continuations/5801/24) (автора языка). Вкратце, `suspend` не нужОн, если зеленые потоки есть из коробки, и они планируются в рамках проекта Loom. А в Scala Одерски видит перспективы в более мощной типизации и в [capabilities](https://www.slideshare.net/Odersky/capabilities-for-resources-and-effects-252161040).

