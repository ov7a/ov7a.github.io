---
layout: post
title: Сброс кэша памяти в линуксе
tags: [linux]
---
Если на линукс-серваке возникает вопрос - "кто же пожрал всю память?", а в `top` все скромно жрут по полмегабайта, то виновник - кэш. Его можно сбросить командой `sync; echo 1 > /proc/sys/vm/drop_caches`
Подробнее - [тут](https://www.tecmint.com/clear-ram-memory-cache-buffer-and-swap-space-on-linux/).
