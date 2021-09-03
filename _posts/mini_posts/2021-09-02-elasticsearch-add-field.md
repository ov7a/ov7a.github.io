---
layout: post
title: Индексирование нового поля в ElasticSearch
tags: [elasticsearch]
---
Чтобы добавить новое поле в существующий индекс, новый индекс создавать не нужно, достаточно [обновления маппинга](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-put-mapping.html). Но старые данные не будут переиндексированы, даже если это поле было в документах раньше. Чтобы индексировать их, можно выполнить [update by query](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update-by-query.html) с пустым скриптом. В запросе имеет смысл указать новое поле как отсутствующее и, возможно, какое-нибудь старое поле как маркер необходимости обновления документа в индексе (чтобы не индексировать все подряд).
```
POST your-index/_update_by_query?conflicts=proceed&wait_for_completion=false
{
  "query": {
    "bool": {
      "must_not": [{
        "exists": {
          "field": "new.field"
        }
      }],
      "must": [{
        "exists": {
          "field": "exisiting.field.as.flag"
        }
      }]
    }
  }
}

```

