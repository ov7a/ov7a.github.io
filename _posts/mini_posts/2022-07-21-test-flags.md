---
layout: post
title: Тестовые флаги
tags: [bestpractices, testing, мысли]
tg_id: 319
---
Использование условий вида `if (test)` или `if (user in testUsers)` — это рак.

Во-первых, половина программирования, если не больше — про управление зависимостями. Если реально нужно отключить какую-то функциональность на тестовой среде (оплату какую-нибудь), то есть куча нормальных способов это сделать: например, подсунуть класс-заглушку или http-заглушку, если вы живете в микросервисной архитектуре.

Во-вторых, тестироваться будет не основной код, а костыли внутри условия. Причем подобные костыли часто просят добавить как раз тестировщики.

В-третьих, это источник багов (а иногда и дырок в безопасности). Сейчас не каждый понимает необходимость юнит-тестов, а уж если начнешь заикаться о тестировании *тестового* кода — сразу в дурку поведут. 

Иногда подобным образом переключают часть функциональности (хотя для этого есть feature-флаги). Иногда так еще "упрощают" жизнь для нагрузочных тестов (т.е. тестируют не настоящую работу) или "для отладки" (хотя для этого есть ленивые логи с уровнями логгирования или внешняя инструментация). 

Мне тяжело придумать нормальные обстоятельства, когда использование подобных условий будет оправдано. А поддерживать их накладно, они осложняют рефакторинг и засоряют код.

