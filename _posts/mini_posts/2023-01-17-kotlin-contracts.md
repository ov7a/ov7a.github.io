---
layout: post
title: Контракты в Kotlin
tags: [kotlin]
tg_id: 367
---
Недавно наткнулся на случай, когда они пригодились. Рассмотрим пример:
```kotlin
data class OptionalResult(val data: Payload?, val someFlag: Boolean)

fun OptionalResult?.getData(): Payload {
	this ?: throw NoResultException()
	return this.data ?: throw NoPayloadException()
}

fun someFun(){
	val payload: Payload = getResult().getData()
	doStuffWithPayload(payload)
	if (payload.someFlag){ //oopsie
		// do more stuff 
	}
	...
}
```
По сути имеем дважды опциональный результат, и в ФП-парадигме это красиво легло бы в ~~мона..~~ Option, но у нас Kotlin с исключениями. 
Однако строка с `oopsie` вызовет ошибку компиляции, т.к. компилятор не понимает, что payload уже был проверен на `null`. 
Причем если тело функции подставить вместо вызова, то все будет ок (ссылочная прозрачность плачет в уголочке).
Чтобы решить проблему, можно использовать [контракты](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md) и явно сказать компилятору, что если функция что-то вернула, то ее аргумент — не `null`:
```kotlin
fun OptionalResult?.getData(): Payload {
	contract {
		returns() implies (this@getData != null)
	}
	this ?: throw NoResultException()
	return this.data ?: throw NoPayloadException()
}
```

В общем, фича интересная, но, кажется, компилятору стоит быть поумнее.

