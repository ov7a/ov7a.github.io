---
layout: post
title: Подготовка проекта для вайб-кодинга
tags: [ai, teamlead, мысли]
tg_id: 616
---
Если ИИ-агент — это [гиперактивный, но тупой джун](/2025/03/25/cursor-ai.html), то и работать с ним надо соответствующим образом:
- Жестко декомпозировать ТЗ до [микрозадач](/2021/07/20/dividing-subtasks.html) — ИИ пофиг, что он "разучится мыслить" и не будет "видеть полной картины" (он и так толком это не умеет).
- Разбить проект на модули, которые помещаются в контекст — скорее всего, это будут микросервисы в отдельных репозиториях (и пофиг, что это [не самое адеватное решение](/2023/04/18/microservices-vs-modules.html)).
- Снизить [когнитивную нагрузку](/2024/06/25/cognitive-load.html) в коде (чтобы вам ее добавил ИИ, кек).
- Использовать тупой язык (т.е., не Haskell), в котором мало лишних токенов (т.е. не Java), меньше ["лишних" выборов](/2024/06/27/safeguards-vs-expressivenes.html), и вообще все квадратно-гнездовое — например, Go. Кто-то так себе инфраструктуру для управления облаком [навайбил](https://habr.com/ru/companies/h3llo_cloud/articles/900612/).
- Все ревьюить и тестить.

Кажется, что при всем этом написание непосредственно кода инкрементального улучшения — малая доля потраченного времени.

В целом, если в вашем проекте не может быстро разобраться крепкий джун с небольшой помощью, то джун потупее (ИИ-агент) не сможет и подавно. Еще есть проблема: джун учится на своих ошибках, а агент — нет (хотя скоро наверно технологии дойдут и до этого). Ну и непонятно, откуда браться новым сеньорам, которые умеют все вышеперечисленное, если всех джунов на рынке поменяют на ИИ.

Аналогично работает и с точки зрения пользователя: если интерфейс/API сложные/непонятные, и чуть что, надо RTFM, то и у чат-ботов будут трудности с использованием вашего ПО. Лучшие продукты — это те, которые в которых [сложные задачи решаются просто](/2024/12/03/complexity.html).
