---
layout: post
title: Отличие команд и событий
tags: [архитектура, rabbitmq, kafka, events]
tg_id: 331
---
Во всяких DDD и CQRS очень часто возникают команды и события. Объединяет их обычно то, что они обычно пересекают границы домена или контекстов, обрабатываются асинхронно и представляют собой (возможно устаревшие) ошметки информации о системе. На ранних стадиях проекта очень легко попасть в ловушку и реализовать их практически одинаково с технической точки зрения (а то и вовсе не разделять). Однако между ними на самом деле довольно много различий.

Семантическое. Команда и событие выражают разные сущности. Событие — это бизнес сущность, "что-то произошло", обычно существительно + краткое причастие (например, "заказ создан"). Команда — это приказ, "надо что-то сделать", и чаще это техническая сущность (например, "отправь e-mail").

Количество потребителей и производителей. У команды "потребитель" ровно один — исполнитель команды, а у события — от 0 до бесконечности, причем они могу быть из разных доменов. Команду может дать кто угодно, а произвести событие о том, что "что-то случилось" — только одна сущность.

Срок жизни. Команду сделал и забыл (удалил), а событие обычно стоит сохранить для истории. 

Порядок обработки. Обычно для команд не важен порядок обработки, потому что заранее команду создавать — это как-то тупо. А вот события лучше обрабатывать последовательно: вряд ли будет логично обработать сначала доставку заказа, а потом его создание (особенно если при этом клиенту шлется уведомление). 

Как следствие, и технологии для потока команд и потока событий обычно стоит выбирать соответствующие: для команд лучше подойдут решения типа RabbitMQ, а для событий — Kafka.
