---
layout: post
title: DTO в python
tags: [python]
---
Еще в древнем 2.6 были `namedtuple`:
```python
from collections import namedtuple

Person = namedtuple("Person", "name age")
p = Person("Jeshua", 33)
print(p.name)
```
Они позволяли обращаться к полям по имени и были иммутабельными. Однако создание было не очень красивым.

Потом в 3.5 появились типы:
```python
from typing import NamedTuple

class Person(NamedTuple):
  name: str
  age: int
p = Person("Jeshua", 33)
print(p.name)
```
Все то же самое, только запись поадекватнее, но это как-то пролетело мимо меня.

Наконец, в 3.7 появились dataclasses:
```python
from dataclasses import dataclass

@dataclass(frozen = True)
class Person:
  name: str
  age: int
```
Казалось бы, то же самое, но есть [нюансы](https://www.python.org/dev/peps/pep-0557/#why-not-just-use-namedtuple): можно сделать мутабельными, можно организовать наследование, значения по умолчанию, сравнение более безопасное и еще пара фич. В общем, чтобы не запоминать 3 штуки, проще запомнить dataclasses и использовать везде их.

