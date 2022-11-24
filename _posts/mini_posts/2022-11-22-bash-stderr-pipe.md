---
layout: post
title: Объединение stderr и stdout в конвеере
tags: [linux, cli]
---
В bash 4.0+ для перенаправления обоих потоков в конвеер вместо 
```sh
somecommand 2>&1 | nextcommand
```
можно использовать
```sh
somecommand |& nextcommand
```
Может пригодится для `grep`.
