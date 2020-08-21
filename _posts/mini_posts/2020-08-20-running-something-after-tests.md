---
layout: post
title: Как запустить что-то после всех тестов
tags: [testing, java, kotlin, junit]
---
Например, проверку покрытия или отправку отчета куда-нибудь.

Очевидный вариант — сделать кастомную задачу в gradle/sbt/maven, которая оборачивает или перезаписывает старую задачу `test`.
Но если писать таск неохота, то есть и другой вариант, если у вас JUnit5.

Можно сделать кастомный [TestExecutionListener](https://junit.org/junit5/docs/current/user-guide/#launcher-api-execution), переопределив `testPlanExecutionFinished`. Чтобы его обнаружил JUnit, добавить полное имя класса в `src/test/resources/META-INF/services/org.junit.platform.launcher.TestExecutionListener`. Такая штука полезна для составления отчета по покрытию, например.

Но, как всегда, есть нюанс: ассерты работать не будут, потому что в движке все вызовы листенеров обернуты в try-catch. Но если нельзя, но очень хочется, то можно пойти на совсем грязный трюк: запустить движок тестов внутри движка тестов:
```kotlin
val launcherConfig = LauncherConfig.builder().enableTestExecutionListenerAutoRegistration(false).build()
val launcher = LauncherFactory.create(launcherConfig)

val request = LauncherDiscoveryRequestBuilder.request()
        .selectors(selectClass(CoverageTest::class.java))
        .build()

launcher.execute(request)
```
Тут еще отключается обнаружение листенеров, чтобы это не превратилось в бесконечную матрешку.
Звучит как извращение, но чего только не сделаешь, лишь бы не писать кастомный таск для maven...

