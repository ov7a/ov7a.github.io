---
layout: post
title: Контексты Painless
tags: [elasticsearch]
---
В районе версии 6.5 ребята из Elasticsearch что-то сообразили и сделали [документацию по контекстам Painless](https://www.elastic.co/guide/en/elasticsearch/painless/master/painless-contexts.html). В ней можно посмотреть, какие переменные доступны в скриптах Painless в зависимости от того, какая операция выполняется — reindex, update by query, скриптованный поиск и т.д. Очень не хватало этого, когда работали с 2-5 версиями и писали всякие миграции на этом "замечательном" языке.

