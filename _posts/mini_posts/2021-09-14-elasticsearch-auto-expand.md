---
layout: post
title: Автоматическая репликация на все узлы Elasticsearch
tags: [elasticsearch]
---
Как-то совсем мимо меня прошла полезная настройка, которая была даже в первой версии эластика. [index.auto_expand_replicas](https://www.elastic.co/guide/en/elasticsearch/reference/master/index-modules.html#dynamic-index-settings) со значением `1-all` позволит иметь по реплике индекса на всех узлах кластера, что очень удобно для небольших вспомогательных индексов (настройки, пользователи и т.п.).

