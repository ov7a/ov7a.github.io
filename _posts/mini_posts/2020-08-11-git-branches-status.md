---
layout: post
title: Поиск неактуальных веток git
tags: [git, jira, intellij]
---
Продолжаю прибираться в проекте. На этот раз цель — избавиться от никому не нужных веток, которые были уже вмержены или забыты.

Главный помощник в этом деле —  команда `git ls-remote --heads [repoUrl]`, которая позволяет получить список веток репозитория без его клонирования. Удобно, когда тебе нужно 5+ реп обработать.

Со списком веток на руках можно сделать запрос к баг-трекеру, чтобы получить статус соответствующего тикета (если ветка содержит его идентификатор, разумеется). Мне не повезло и у меня Jira, хорошо хоть к ней есть подобие клиента. А дальше — закрываем ручками то, что в финальном статусе (можно автоматизировать и удаление, но как-то стремно). Полностью скрипт можно посмотреть в [gist](https://gist.github.com/ov7a/a70e821c01ad491e33ca3c273c5d926c).

Если надо почистить локальные ветки, которые уже были удалены в удаленном репозитории — есть [плагин](https://plugins.jetbrains.com/plugin/10059-git-branch-cleaner), который это делает в пару кликов (VCS → Git → Delete old branches...). Правда он скорее всего будет одноразовый: вы же будете держать репу в чистоте после генеральной уборки?
