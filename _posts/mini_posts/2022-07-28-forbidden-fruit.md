---
layout: post
title: Запретный плод
tags: [python]
---
```
>>> (666).boo()
I'm just a 666, but boo!
>>> "I can be JS too! " + 2
'I can be JS too! 2'
```

Одна из фишек питона — возможность monkey-patching. Но многие считают, что у него есть предел, и нельзя патчить стандартную библиотеку. Но на самом деле [можно](https://github.com/clarete/forbiddenfruit):
```
>>> from forbiddenfruit import curse
>>> curse(int, "boo", lambda x: print(f"I'm just a {x}, but boo!"))
>>> (666).boo()
I'm just a 666, but boo!
>>> curse(str, "__add__", lambda x,y: x + str(y))
>>> "I can be JS too! " + 2
'I can be JS too! 2'
```
Это знание позволит вам поиздеваться над коллегами и еще меньше доверять написанному на питоне. Ходят слухи, что библиотека была сделана для тестов, но благими намерениями...

