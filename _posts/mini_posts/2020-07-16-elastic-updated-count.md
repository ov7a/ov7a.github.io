---
layout: post
title: Что означает поле update в результатах update by query в Elasticsearch?
tags: [elasticsearch]
---

Смотрим в [документацию](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update-by-query.html#docs-update-by-query-api-response-body):
```
updated
  The number of documents that were successfully updated.
```
Внимание, вопрос: учитываются все затронутные документы или все измененные? Вроде как все затронутые, да и обновления могут быть без изменений документа (для того, чтобы обновить документ в индексе, например). Но хочется побольше уверенности.

Роемся в исходниках, недолгий поиск по ключевому слову `updated` приводит сначала к [WorkerBulkByScrollTaskState](https://github.com/elastic/elasticsearch/blob/2a67bee874f2469fae477f3b7471fbdf3a548b71/server/src/main/java/org/elasticsearch/index/reindex/WorkerBulkByScrollTaskState.java#L65), а потом к [AbstractAsyncBulkByScrollAction](https://github.com/elastic/elasticsearch/blob/2a67bee874f2469fae477f3b7471fbdf3a548b71/modules/reindex/src/main/java/org/elasticsearch/index/reindex/AbstractAsyncBulkByScrollAction.java#L367):
```java
switch (item.getOpType()) {
    case CREATE:
    case INDEX:
        if (item.getResponse().getResult() == DocWriteResponse.Result.CREATED) {
            worker.countCreated();
        } else {
            worker.countUpdated();
        }
        break;
    case UPDATE:
        worker.countUpdated();
        break;
    case DELETE:
        worker.countDeleted();
        break;
}
```
Тут видно, что в подсчете вообще не учитывается, был ли изменен документ — интересен только тип операции. Соответственно в поле `updated` ответа будет число всех затронутых документов, даже если они не менялись. Отличаться от `total` оно будет только тогда, когда создаются или удаляются документы. Т.е. `total = updated + deleted + created`.

Люблю Open Source продукты за то, что можно при желании разобраться почти в любой проблеме.

