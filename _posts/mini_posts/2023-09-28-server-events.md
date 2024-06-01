---
layout: post
title: Уведомления от сервера клиенту
tags: [events, web, api]
tg_id: 441
---
На прошлой работе, когда надо было выбрать технологию для отправки уведомлений клиентам, остановились на [Centrifugo](https://centrifugal.dev/) — довольно классный сервер для отправки сообщений по веб-сокетам (там были свои приколы, но зато было прикольно писать разработчику прямо в личную телегу).

До этого N работ назад использовали [Crossbar.io](https://github.com/crossbario/crossbar), но когда я писал этот пост, обнаружил, что он уже [при смерти](https://github.com/crossbario/crossbar/issues/2085).

А еще когда я смотрел альтернативы Centrifugo, то наткнулся на [Server-sent Events](https://jvns.ca/blog/2021/01/12/day-36--server-sent-events-are-cool--and-a-fun-bug/) (aka [SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), aka [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)). Это [стандарт](https://html.spec.whatwg.org/multipage/server-sent-events.html) для веба, который позволяет в одностороннем порядке слать уведомления. Рандомную демку можно посмотреть [тут](https://www.easydevguide.com/posts/flask_sse), работает даже с curl из коробки. В общем, жду светлые времена, когда в web-стандарте начнут поддерживать докер-контейнеры, чтобы там кубер свой запустить... 

