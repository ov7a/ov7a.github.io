---
layout: post
title: Паттерны обработки ошибок в микросервисной архитектуре
tags: [архитектура, timeout]
tg_id: 251
---
Узнал пару недель назад, что почти все стандартные операции [обозваны](https://blog.codecentric.de/en/2019/06/resilience-design-patterns-retry-fallback-timeout-circuit-breaker/) [паттернами](https://medium.com/aspnetrun/microservices-resilience-and-fault-tolerance-with-applying-retry-and-circuit-breaker-patterns-c32e518db990):
1. Timeout: не надо ждать ответа бесконечно.
2. Deadline: вместо относительного таймаута делать абсолютный, чтобы цепочка вызовов работала адекватно. См. также [про токены отмены](/2020/11/17/timeout-handling.html).
3. Retry: можно тупо попробовать еще раз.
4. [Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html): вставляем прокси перед целевым сервисом, считаем ошибочные запросы. Если их много, то даем ошибку сразу, не спрашивая целевой, в течение какого-то периода.
5. Fallback: если не получили ответ, придумываем его сами.

А если копнуть глубже, то паттернов устойчивости [гораздо больше](https://www.slideshare.net/ufried/patterns-of-resilience).
![](/assets/images/resilience_patterns.png)

