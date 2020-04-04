---
layout: post
title: Моржовый оператор в питоне
tags: [python]
---
В октябре релизнулся Python 3.8. Среди нововведений - моржовый оператор, который позволяет делать присваивание внутри другого выражения:
```python
# So instead of
a = some_func()
if a:
    print(a)

# Now you can concisely write
if a := some_func():
        print(a)
```
и, разумеется, можно сделать так:
```python
a = 5
d = [b := a+1, a := b-1, a := a*2]
```
потенциальный undefined behavior, добро пожаловать в питон!

Если интересна тема, как можно плохо что-то делать в питоне или нужен источник паззлеров для него, то можно почитать https://github.com/satwikkansal/wtfpython
