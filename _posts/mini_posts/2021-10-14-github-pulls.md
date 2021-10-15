---
layout: post
title: Поиск всех пулл-реквестов пользователя в GitHub
tags: [github]
---
Чтобы посмотреть вклад в Open Source, можно зайти на [https://github.com/pulls](https://github.com/pulls) и убрать фильтр открытых:
```
is:pr author:ov7a
```
Однако может потребоваться фильтр по владельцу репозитория/организации, чтобы [отсеять](https://github.com/pulls?q=is%3Apr+author%3Audalov+-user%3AJetBrains+-user%3AKotlin) коммиты, за которые платят зарплату:
```
is:pr author:udalov -user:JetBrains -user:Kotlin
```
