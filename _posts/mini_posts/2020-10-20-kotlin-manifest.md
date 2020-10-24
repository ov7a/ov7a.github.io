---
layout: post
title: Главный метод в Kotlin jar
tags: [kotlin]
---
Если написать такую программу
```kotlin
fun main(args: Array<String>) {
    println("Hello, dudes!")
}
```
и скомпилировать ее через `kotlinc 1.kt -include-runtime -d hello1.jar`, то при запуске через `java -jar hello1.jar` получим приветствие.
Однако если то же самое сделаем с эквивалентным кодом
```kotlin
object Main {
  @JvmStatic
  fun main(args: Array<String>) {
    println("Hello, dudes!")
  }
}
```
то результат будет уныл:
```
no main manifest attribute, in ./hello2.jar
```
Почему не генерируется манифест можно посмотреть в [исходниках компилятора](https://github.com/JetBrains/kotlin/blob/master/compiler/cli/src/org/jetbrains/kotlin/cli/jvm/compiler/CompileEnvironmentUtil.java#L62). Через пару прыжков выходим на [MainFunctionDetector](https://github.com/JetBrains/kotlin/blob/master/compiler/frontend/src/org/jetbrains/kotlin/idea/MainFunctionDetector.kt), где, продравшись через условия, можно понять, что главными считаются только top-level функции, и в манифест `Main-Class` добавляется только в первом случае. Хотя казалось бы, раз уж есть код для поиска главного метода, то ничто не мешает проставлять `Main-Class` во всех случаях. Звучит довольно низкоуровнево, ведь у всех есть система сборки или IntelliJ на худой конец, но это все-таки [баг](https://youtrack.jetbrains.com/issue/KT-32376).

