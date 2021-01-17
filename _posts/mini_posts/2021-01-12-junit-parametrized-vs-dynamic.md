---
layout: post
title: Динамические тесты в JUnit и Before/AfterEach
tags: [junit, testing]
---
Вляпался недавно с динамическими тестами в ограничение JUnit: динамические тесты — [неполноценные участники жизненного цикла](https://github.com/junit-team/junit5/issues/378), и, как следствие, для них не вызываются методы `@BeforeEach` и `@AfterEach`. Точнее запускаются, но перед фабрикой динамических тестов:
```kotlin
@BeforeEach
fun init() {
    println("init stage")
}

@AfterEach
fun cleanup() {
    println("clean up stage")
}

@TestFactory
fun dynamicTests() = listOf("dynamic1", "dynamic2").map { name ->
    dynamicTest("dynamic $name") {
        println("dynamic $name test")
        assert(true)
    }
}
```
Выведет:
```
init stage
dynamic dynamic1 test
dynamic dynamic2 test
clean up stage
```
Приходится в таких случаях использовать параметризованные тесты, хоть они и выглядят менее пристойно.

