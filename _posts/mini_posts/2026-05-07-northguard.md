---
layout: post
title: Northguard
tags: [kafka]
tg_id: 731
---
Как-то совсем мимо меня прошло, что LinkedIn вырос из им же созданной Kafka и сделал новый брокер сообщений/логов — [Northguard](https://www.linkedin.com/blog/engineering/infrastructure/introducing-northguard-and-xinfra).

Причина довольно прозаична: контроллер хранил довольно большое состояние централизованно на 1 узле и это в масштабах LinkedIn стало бутылочным горлышком. И это с учетом того, что от Zookeeper отказались [еще в 2021](https://cwiki.apache.org/confluence/display/KAFKA/KIP-500%3A+Replace+ZooKeeper+with+a+Self-Managed+Metadata+Quorum). А еще были проблемы с балансировкой и обслуживанием тьмы кластеров. Продумали и миграцию, за это отвечает Xinfra — по сути, адаптер, поддерживающий оба брокера.

