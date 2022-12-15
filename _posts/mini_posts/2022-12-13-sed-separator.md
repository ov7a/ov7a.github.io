---
layout: post
title: Sed и разделитель
tags: [linux, cli]
---
Оказывается, в `sed` можно использовать почти любой разделитель, т.е. эти варианты
```sh
sed -i 's/Hello/Goodbye/g' input
sed -i 's%Hello%Goodbye%g' input
sed -i 's Hello Goodbye g' input
sed -i 'ssHellosGoodbyesg' input
```
будут работать одинаково. В качестве разделителя используется первый символ после `s`. Увы, прокатит только однобайтный символ, `Ы` не подойдет.

Спонсор это минутки — Ярослав:)

