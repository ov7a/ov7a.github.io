---
layout: post
title: Service mesh
tags: [архитектура]
---
Типичная микросервисная архитектура тащит за собой много обвязки для обнаружения сервисов, распределенной отладки (трейсинг, метрики), решения проблем надежной и безопасной отправки запросов, балансировки нагрузки и т.п. И для поддержки всего этого надо пихать библиотеки в микросервис, да еще и настраивать их. Даже если это единая экосистема (Spring Boot, Finagle, Akka, ...), то она не решит всех проблем, особенно для гетерогенного стека.

Основная идея service mesh — вынести всю "служебную" мишуру из библиотек за пределы микросервиса, а в нем оставить только бизнес-логику. Это позволит многое стандартизировать, а разработчикам — сфокусироваться на основной функциональности. Основной вариант реализации — поставить перед каждым сервисом прокси и все служебные операции выполнять на нем, возможно с помощью управляющего сервера.

Разумеется, за все нужно платить: дополнительные абстракции жрут ресурсы, появляются дополнительные точки отказа, все это все равно нужно настраивать и отлаживать. Да и технология пока не очень зрелая, со всеми вытекающими.
Подобно тому, что кубер-кластер не надо разворачивать ради полутора микросервисов, service mesh вряд ли оправдан в рамках одной команды: он скорее для больших организаций, которые в том числе могут себе позволить платформенную команду для его поддержки.

Чуть подробнее можно посмотреть в [презенташке](/assets/talks/2021-11-17-service_mesh.pdf).

