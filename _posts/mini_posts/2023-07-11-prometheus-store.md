---
layout: post
title: Как запихнуть данные в Prometheus
tags: [мониторинг]
tg_id: 419
---
Классический способ: приложение выставляет URL `/metrics`, prometheus забирает оттуда их в [простом текстовом формате](https://github.com/prometheus/docs/blob/main/content/docs/instrumenting/exposition_formats.md#text-format-example).

Однако не все сервисы — это HTTP-серверы, да и не все живут достаточно долго. Поэтому второй способ — сделать прокси, [PushGateway](https://prometheus.io/docs/practices/pushing/). Приложение запихивает метрики в PushGateway, а он уже отдает классическим способом.

Но, увы, этот PushGateway надо разворачивать, и если Grafana облачная, то там его нет. Чтобы запихать метрики в ее Prometheus, необходимо зайти через [Mimir](https://grafana.com/oss/mimir/) — это распределенный Prometheus такой. И вот тут уже [нельзя простой формат](https://grafana.com/docs/mimir/latest/references/http-api/#remote-write), а обязательно [Protobuf](https://github.com/grafana/mimir/blob/main/pkg/mimirpb/mimir.proto), который использует [устаревшие зависимости](https://github.com/gogo/protobuf/blob/master/gogoproto/gogo.proto), да еще при этом завернутый в Snappy и с особым заголовком :harold:

