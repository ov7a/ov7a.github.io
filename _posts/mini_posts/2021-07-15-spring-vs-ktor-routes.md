---
layout: post
title: DSL для роутинга
tags: [spring, kotlin, ktor]
---
В Spring 5.2 можно писать в функциональном стиле не только для WebFlux, но и для [обычного MVC](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#webmvc-fn). Т.е. вместо анноташек над контроллерами можно писать что-то вроде
```kotlin
fun routes() = router {
    accept(ALL).nest {
        GET("/hello/{name}") {
            val name = it.pathVariable("name")
            ok().body("Hello, $name!")
        }
    }
}
```
где лямбды принимают `ServerRequest` и возвращают `ServerResponse`. Такой подход можно использовать для генерации эндпоинтов из конфига.

Подобный подход очень напоминает Ktor:
```kotlin
    routing {
        get("/hello/{name}") {
            val name = call.parameters["name"]
            call.respondText("Hello $name!")
        }
    }
```

