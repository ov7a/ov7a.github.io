---
layout: post
title: Объединение stderr и stdout в конвейере
tags: [linux, cli]
tg_id: 353
---
В bash 4.0+ для перенаправления обоих потоков в конвейер вместо 
```sh
somecommand 2>&1 | nextcommand
```
можно использовать
```sh
somecommand |& nextcommand
```
Может пригодиться для `grep`.
