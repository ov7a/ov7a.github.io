---
layout: post
title: Context receivers
tags: [kotlin]
tg_id: 317
---
В рабочем проекте попробовал добавленные недавно [context receivers](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md). Вкратце, это очередной сахар, который позволяет требовать, чтобы функция вызывалась в контексте, содержащем какой-то класс как `this`:
```kotlin
context(Logger, DBConnection, Request)
fun someFunc() {
  log(select(request.param))
}
```
Под капотом компилятор генерирует дополнительные параметры для вызова функции.

В текущей версии (1.6.21) все очень сыро — я споткнулся об пару багов компилятора и пару ошибок во время исполнения в довольно простых случаях. Для прода это точно не готово (я использовал в тестах). Могут получиться уродские лямбды:
```kotlin
suspend fun someFun(
  block: suspend context(Logger, DBConnection) Request.(Param) -> Unit
)
```
Компилятор не всегда понимает, из какого контекста метод (и я натыкался на случаи, когда ему не удавалось это объяснить). Как и с `suspend`, функции приобретают ["цвет"](http://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/). У `this` непонятный тип — вроде объединение, но явно это не получить. Наконец, форматирование съезжает:) Больше критики можно почитать [тут](https://github.com/Kotlin/KEEP/issues/259), похвалу — [тут](https://www.youtube.com/watch?v=GISPalIVdQY), а больше вариантов применения — [тут](https://techblog.doctarigroup.com/kotlin/2022/05/18/kotlin-context-receivers.html).

Без сахара подобные задачи можно решать созданием одного класса `Context` и вызова функций с дополнительным параметром(ами) или через receiver: `fun Context.someFunc()`. Была бы поддержка типов-объединений, то тогда это было бы гораздо более читаемо (особенно с `typealias`). Ну а так вообще это все ради того, чтобы неявно передавать аргумент в функцию. И подобную проблему уже давно решили с помощью [имплиситов](https://docs.scala-lang.org/scala3/reference/contextual/) в Scala. В общем, мне кажется, что начинается излишнее переусложнение, которое еще и хреново реализовано.

