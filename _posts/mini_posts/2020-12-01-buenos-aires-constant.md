---
layout: post
title: Константа Буэнос-Айреса
tags: [math]
---
В четверг посмотрел очередной [видос](https://youtube.com/watch?v=_gCKX6VMvmU) с Numberphile и руки зачесались кое-что проверить.
Суть видео вкратце: если взять `f_1 = 2.920050977316134...`, и вычислять `n`-ный элемент по формуле
```
f_n+1 = ⌊f_n⌋  * (f_n - ⌊f_n⌋  + 1)
```
то последовательность из целых частей `⌊f_1⌋, ⌊f_2⌋, ⌊f_3⌋ ...`  будет совпадать с последовательностью простых чисел.

Звучит очень круто, но конечно есть подвох с тем, что первый элемент (константу Буэнос-Айреса) можно вычислить, только зная простые числа. Но даже если так, то в коде-то это будет смотреться хорошо!

Вот только точность может внести коррективы, поэтому стоит проверить: а сколько простых чисел можно сгенерировать точно? 100? 1000?

Простенький [скрипт](https://gist.github.com/ov7a/04a4780b4eff276597d637c42c48ec67) дает ответ, что все грустно: с 15 десятичными знаками в константе получится всего лишь 12 чисел: 13-ое простое число — 43, а новый метод выдаст 42. Может, если использовать [decimal](https://docs.python.org/3/library/decimal.html) с сумасшедшей точностью, и предвычислить константу по формуле [из оригинальной статьи](https://www.researchgate.net/publication/330746181_A_Prime-Representing_Constant), то все будет лучше? [Увы](https://gist.github.com/ov7a/04a4780b4eff276597d637c42c48ec67), но нет: с 1000 знаками точности можно сгенерировать правильно всего лишь 166 простых чисел.

Однако все равно радует, что остались еще люди, которые вдохновляются наукой, а не всякими блоггерами и певцами ртом: оригинальная статья — от группы студентов из Аргентины, которые вдохновились другим видео с этого канала.

