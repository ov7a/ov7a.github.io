---
layout: post
title: Сериализация DTO python в JSON
tags: [python]
---
В продолжение предыдущего поста. Чтобы иметь возможность сериализовать dataclass в JSON, можно сделать что-то вроде трейта и примешать его к датаклассам.
```python
from dataclasses import dataclass, asdict

class Serializable:
    def _asdict(self):
        return asdict(self)

@dataclass(frozen=True)
class Person(Serializable):
  name: str
  age: int

p = Person("Jeshua", 33)

requests.get("http://httpbin.org/anything", json=p).json()
```
Эта штука вам вернет...
```
TypeError: Object of type Person is not JSON serializable
```
Но если поставить модуль `simplejson`, который можно считать девелоперской версией встроенного `json`, то ответ будет нормальным:
```
{... 'json': {'age': 33, 'name': 'Jeshua'}, ...}
```
Как же это работает?
Во-первых, в модуле `requests` есть развилочка:
```python
try:
    import simplejson as json
except ImportError:
    import json
```
Во-вторых, в модуле `simplejson` есть встроенная поддержка `namedtuple`: если у класса есть метод `_asdict`, то он будет вызван для получения словаря, из которого потом будет сделан JSON. Т.е. с `simplejson` `namedtuple` можно просто передавать как параметр в `dumps` без лишних телодвижений. А благодаря `Serializable` датакласс маскируется под `namedtuple`.

