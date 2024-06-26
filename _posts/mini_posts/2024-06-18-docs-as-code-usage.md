---
layout: post
title: Документация как средство повышения качества
tags: [docs, мысли]
tg_id: 522
---
Часто тесты называют первым использованием вашей программы. А вот вторым использованием программы можно назвать... документацию. 

На старой работе с проектным подходом мы, как правило, описывали все основные алгоритмы. И уже тогда иногда всплывали некоторые косяки (тупо за счет смены точки зрения): документация еще раз способствует размышлениям об общей картине и о крайних случаях. А замечательная техписатель, когда писала руководство пользователя, находила нам баги:) Как выяснилось, такое работает и при разработке инструментов (и библиотек): соседняя команда нашла баг, когда писала документацию.

А вот в продуктовом подходе вторым использованием программы скорее всего будет UAT или демо. Конечно, базовая дока [все равно нужна](/2020/08/21/docs.html), но все подробности уже аналитик на пару с продактом [прожевали](/gags/#2021-05-19-feeding-tasks.png), пусть даже [не идеально](/2021/07/20/dividing-subtasks.html), но "поправим в следующей итерации". И тут документация — это скорее детальное описание фичи, которое появляется до ее создания и уточняется после реализации.
