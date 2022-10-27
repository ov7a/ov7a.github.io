---
layout: post
title: Получение Dockerfile по образу
tags: [docker]
---
Если кто-то один Dockerfile сломал, а другой потерял, то можно его почти полностью [восстановить](https://hub.docker.com/r/alpine/dfimage) из готового образа:
```
docker run -v /var/run/docker.sock:/var/run/docker.sock --rm alpine/dfimage yourimage:tag
```
