---
layout: post
title: Связи в проекте и GitHub Action
tags: [github, teamlead, typescript, devops, jira, redmine]
tg_id: 281
---
Очевидно, что связи между артефактами в проекте очень полезны. Код привязан к коммиту, коммит — к тикету и код-ревью/пулл-реквесту, тикет к ТЗ/эпику/истории и/или документации. Причем хорошо, когда эти связи еще и двусторонние: например, чтобы по коду можно посмотреть тикет и зачем он был написан, а по тикету — написанный код. Иначе при смене процесса придется искать эти связи вручную или не напрямую. Кажется, это одна из "продающих" фишек Gitlab или Space.

Мне не хватало связи пулл-реквеста GitHub с тикетом, существующие варианты action'ов показались унылыми, поэтому я написал [свой](https://github.com/ov7a/link-issue-action), старался сделать его максимально универсальным.

К сожалению, для написания action'ов есть только [два варианта](https://docs.github.com/en/actions/creating-actions/about-custom-actions#types-of-actions): nodejs или docker-образ. Я по глупости выбрал первый вариант, потому что большинство action'ов были написаны на нем, да и [библиотека](https://github.com/actions/toolkit) для работы с GitHub была только для JS. В очередной раз вляпался в экосистему nodejs: обновление npm через него самого сделало его непригодным для использования. Куча пулл-реквестов от Dependabot — это мрак, группировки обновлений [нет годами](https://github.com/dependabot/dependabot-core/issues/1190).

TypeScript вроде мощный и классный, можно [выражения в шаблонах считать](https://habr.com/ru/post/655705/), но нет каких-то банальных вещей вроде [безопасного enum](https://stackoverflow.com/questions/17380845/how-do-i-convert-a-string-to-enum-in-typescript) или [filterNotNull](https://github.com/microsoft/TypeScript/issues/16069). Но мне понравились линтеры и форматтеры — благодаря им исправилась половина моих ошибок.

Сама библиотека для работы с GitHub сильно разочаровала. Хочешь получить текст коммита в пулл-реквесте? [Запрашивай через API](https://github.community/t/accessing-commit-message-in-pull-request-event/17158). Хочешь имя ветки? Используй [окружение](https://github.com/ov7a/link-issue-action/blob/91a71c5ea4d45bc72d64f3655ebcce8ded973852/src/extractor.ts#L13) или [костыли](https://github.community/t/how-to-get-pr-branch-name-in-github-actions/16598). Конфигурация в yaml, [но параметры только строчные](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs). Наконец, добила [возможность гонок](https://github.community/t/race-condition-possible-from-rapidly-executed-concurrent-github-actions/137411): все работы из action'ов запускаются параллельно, а контекст запуска статичный, поэтому [пришлось менять](https://github.com/ov7a/link-issue-action/commit/f1dab50f8f7129719b323293fa7e2c5186bad826) получение тела из контекста на запрос к API.


