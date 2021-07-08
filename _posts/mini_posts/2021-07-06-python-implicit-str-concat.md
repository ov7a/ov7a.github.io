---
layout: post
title: Неявная конкатенация строк в Python
tags: [python]
---
В питоне есть ~баг~ фича, что строковые литералы, написаные рядом, автоматически соединяются в один:
```python
>>> print("ololo" "alala")
ololoalala

>>> ["1" "2", "3"]
['12', '3']
```

Иногда это может очень бесить (и не только меня, но [PEP](https://legacy.python.org/dev/peps/pep-3126/) с предложением выпилить это наследие Си отклонили). Теоретически, помочь могут линтеры: [pylint](http://pylint.pycqa.org/en/stable/whatsnew/2.2.html) или [flake8](https://pypi.org/project/flake8-implicit-str-concat/). А [тут](https://stackoverflow.com/questions/2504536/why-allow-concatenation-of-string-literals) можно посмотреть примеры, почему такое поведение может быть полезным.

