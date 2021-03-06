---
layout: post
title: Грабли генерации id в Hibernate
tags: [бд, sql]
---
За использование фреймворков приходится платить. Пусть есть Entity с простым полем
```kotlin
@Id
val id: UUID = UUID.randomUUID()
```
Вроде все просто: при создании сущности ей сгенерируется `id`, потом запишем его в базу одним запросом. Однако добрый EntityManager сделает тут один дополнительный запрос — а вдруг это не новая сущность? Поэтому приходится писать так:
```kotlin
@Id
@GeneratedValue
@Column(name = "id", updatable = false, nullable = false)
val id: UUID? = null
```
Тут мы информируем EntityManager, что это поле он должен сгенерировать сам (по умолчанию генерируется UUID), и что лезть в базу не надо, если `id` отсутствует. А потом защищаемся от самих себя — запрещаем писать в базу сущность с отсутствующим `id`, ведь компилятор это уже проверить не может. Зато он не знает ничего про генерацию этого поля и вполне справедливо считает, что раз оно может отсутствовать, то  изволь переписать почти весь код его использующий, как минимум `equals` и `hashCode`.

(Скоро у меня кончатся идеи для постов и канал превратится в нытье про то, как я не люблю Spring и стандартный стек вокруг него).

