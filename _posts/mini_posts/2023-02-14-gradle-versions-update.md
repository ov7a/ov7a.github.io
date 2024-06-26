---
layout: post
title: Обновление версий библиотек в Gradle
tags: [gradle]
tg_id: 377
---
Попадаются задачи, когда надо обновить все версии библиотек в проекте. Руками такое делать в наш век очень уныло.

В Gradle для этого есть несколько плагинов. [Основной](https://github.com/ben-manes/gradle-versions-plugin) просто покажет отчет с последними версиями для всех библиотек. Там же есть и ссылки на плагины для автоматического обновления в скрипте билда. 

Небольшая проблема в том, что указать версию библиотеки можно кучей разных способов. Простейший — в `build.gradle` или `build.kts`. При этом там же ее можно вынести в переменную или в какую-нибудь функцию. Другой способ — [каталоги версий](https://docs.gradle.org/current/userguide/platforms.html), когда версии хранятся в отдельном файле `settings.kts` или вообще в `toml`. Разные плагины для автоматического обновления поддерживают разные варианты описания версий — [один](https://github.com/patrikerdes/gradle-use-latest-versions-plugin) только в основном скрипте, [второй](https://jmfayard.github.io/refreshVersions/) — только в каталогах версий. Первый я попробовал на своем [древнем поделии](https://github.com/ov7a/github-pr-stats/blob/main/build.gradle.kts), и там все нормально обновилось (кроме `npm`, конечно). 

Автоматическое обновление имеет минусы. Во-первых, подсовываются иногда beta и RC версии. Во-вторых, breaking changes и вообще списки изменений надо читать самому. Но так-то в проекте все хорошо покрыто тестами и можно не париться, правда же? :)

В Gradle еще есть возможность указать [диапазоны версий](https://docs.gradle.org/current/userguide/single_versions.html), например, `1.7.+` — почти как в `npm`. Но тут я не могу придумать вариант, когда привязка к последней версии лучше, чем воспроизводимая сборка с фиксированными версиями.

