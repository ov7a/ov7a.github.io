---
layout: post
title: Значение по умолчанию minimum_should_match
tags: [elasticsearch]
---
Какой будет `minimum_should_match` в `bool_query`, если его не указать?
Вроде как 1, но на самом деле - фигушки, если рядом есть `must`, то это 0:

В документации к версии 6.8 пишут:
> If the bool query is a filter context or has neither `must` or `filter` then at least one of the `should` queries must match a document for it to match the bool query. This behavior may be explicitly controlled by settings the `minimum_should_match` parameter.

В версиях 7.0 - 7.4 про это не было сказано. Вообще. Хорошо хоть в 7.5 сделали отдельный раздел про этот параметр, где написано короче, но яснее:
> If the bool query includes at least one `should` clause and no `must` or `filter` clauses, the default value is 1. Otherwise, the default value is 0.

Благо elasticsearch - опенсорс и можно посмотреть, [почему](https://github.com/elastic/elasticsearch/commits/master/docs/reference/query-dsl/bool-query.asciidoc) такое безобразие произошло с документацией: [вот ее удалили](https://github.com/elastic/elasticsearch/commit/74aca756b80ff5ad5e633ab54f184cc3ec1ba7a0#diff-9c4608a721d62585e5687bd2bfa2a272), и только через год [вернули](https://github.com/elastic/elasticsearch/commit/72dd49ddccddb3f47ada6451c59eead8a76abc79#diff-9c4608a721d62585e5687bd2bfa2a272).

