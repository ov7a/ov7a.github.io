---
layout: post
title: Закрытие старых ревью в Upsource
tags: [upsource]
---
К сожалению, [теорию разбитых окон](https://lurkmo.re/%D0%A2%D0%B5%D0%BE%D1%80%D0%B8%D1%8F_%D1%80%D0%B0%D0%B7%D0%B1%D0%B8%D1%82%D1%8B%D1%85_%D0%BE%D0%BA%D0%BE%D0%BD) можно наблюдать и в разработке. Поэтому периодически стоит наводить чистоту в коде, трекерах задач (можно называть это модной фразой "груминг бэклога") и прочих штуках.

Недавно дошли руки до того, чтобы почистить незакрытые ревью в Upsource. Поскольку в проекте их было более 400 штук, а из коробки такой фичи [нет](https://youtrack.jetbrains.com/issue/UP-10349), то в мою коллекцию добавился еще один скрипт для автоматизации всякой дичи.

Внезапно, у Upsource есть [API](https://upsource.jetbrains.com/~api_doc/index.html), но есть нюанс: названия методов придется угадывать самостоятельно по названию DTO.
В остальном все относительно просто: берем [список ревью](https://upsource.jetbrains.com/~api_doc/reference/Projects.html#messages.ReviewsRequestDTO) по подобранному методом тыка запросу, и [закрываем по одному](https://upsource.jetbrains.com/~api_doc/reference/Projects.html#messages.CloseReviewRequestDTO). Все вместе можно посмотреть в [gist](https://gist.github.com/ov7a/617498c2a738476c84ee5b434041c55c).

