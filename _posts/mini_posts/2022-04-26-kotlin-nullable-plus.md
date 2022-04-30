---
layout: post
title: Статическая типизация — не панацея
tags: [kotlin]
---
Что выведет этот кусочек кода на Kotlin?
```
fun main() {
    data class SomeClass(val someValue: Int)
    val someNull = null

    println(someNull + SomeClass(12))
}
```

{% capture spoiler_content %}
Выведет `nullSomeClass(someValue=12)`. Почти как в JS:) 

Все благодаря выводу типов: компилятор находит расширение `operator fun String?.plus(other: Any?)`, вызывает у обоих аргументов `toString()` и склеивает их. 

Хорошо хоть, узнал это не из продакшен-кода, а из познавательного [видео](https://www.youtube.com/watch?v=x2bZJv8i0vw), в котором мужик рассказывает про "переопределение" оператора сложения для nullable типов.
{% endcapture %}
{% include spoiler.html title="Ответ" content=spoiler_content %}
