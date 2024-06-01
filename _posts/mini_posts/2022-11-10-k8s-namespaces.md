---
layout: post
title: Неймспейсы в k8s
tags: [k8s]
tg_id: 350
---
В [документации](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) читаем:
```
In Kubernetes, namespaces provides a mechanism for isolating groups of resources within a single cluster. 
[...]
Namespaces are intended for use in environments with many users spread across multiple teams, or projects.
```
Однако эта "изоляция" очень условна, и я бы поостерегся ее использовать в мультитенантном смысле. Хотя бы потому, что, например, все сервисы имеют полное имя вида `<service-name>.<namespace-name>.svc.cluster.local` и с настройками по умолчанию ничто не мешает из неймспейса `user1ns` обратиться к сервису `someService` в неймспейсе `user2ns` просто используя `someService.user2ns` в качестве хоста. Это может иметь смысл в тестовых окружениях, но на проде — страшно. 

Еще можно распихать по разным неймспейсам микросервисы, но когда команды разрастутся до "доменов" (групп команд), то это разделение потеряет смысл, т.к. скорее всего у каждого домена будет свой изолированый кластер.

А вот вполне классный вариант применения — отделить в служебные неймспейсы всякие логгеры, операторы, метрики, телеметрию, CI и т.п., чтобы в основном неймспейсе остались только сами сервисы с "полезной" логикой.
