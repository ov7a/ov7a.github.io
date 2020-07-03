---
layout: post
title: Backreference в регулярках
tags: [regex]
---
Иногда нужно найти текст, где что-то должно повторяться. Например, найти и заменить повторяющийся паттерн в коде на вызов функции:
```
someFun(ololo)
anotherFun(ololo)
yetAnotherFun(rrr, ololo)
```
Если тупо использовать 4 группы, то такой кусочек тоже попадет в результаты:
```
someFun(alala)
anotherFun(ololo)
yetAnotherFun(qqq, qyqyqy)
```
А это мы вряд ли хотим. Чтобы указать, что подстроки именно одинаковые, нужно использовать [backreference](https://www.regular-expressions.info/backref.html):
```
someFun\((.*)\)\s*anotherFun\(\1\)\s*yetAnotherFun\([^,]*,\s*\1\)
```

P.S. Да, я правлю код регулярками и считаю это приемлемым, когда код в таком состоянии, что только так и имеет смысл делать.

