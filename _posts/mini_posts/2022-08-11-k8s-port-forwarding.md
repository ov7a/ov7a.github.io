---
layout: post
title: Форвардинг портов k8s
tags: [k8s]
---
Продолжаю "ломать" изоляцию сетей:) Давным давно писал про [перенаправление портов](/2020/04/17/port-forwarding.html), там среди прочих указан `port-forward`
```sh
kubectl port-forward some_service 5672:5672
```
это прекрасно работает, когда сам сервис развернут в кластере k8s. Но что делать, если он виден, но находится в другом кластере/сети? Форварднуть порты еще раз с помощью временного контейнера :)
```sh
kubectl run tmp-port-tunnel --rm --image=alpine/socat -it --expose=true --port=5672 tcp-listen:5672,fork,reuseaddr tcp-connect:some_host:5672
```

