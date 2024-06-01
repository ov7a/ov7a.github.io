---
layout: post
title: Вызов C++ из питона
tags: [python, c]
tg_id: 436
---
Оказывается, кроме [ctypes](https://docs.python.org/3/library/ctypes.html) и [Cython](https://cython.readthedocs.io/en/latest/src/tutorial/cython_tutorial.html) с тех пор как я смотрел появился еще один способ, [pybind11](https://pybind11.readthedocs.io/en/stable/basics.html#creating-bindings-for-a-simple-function) (если не считать всякие граали).

Но во всех трех подходах надо че-то думать: в ctypes надо код в динамическую библиотеку запихнуть, а потом ее еще и загрузить; в Cython надо немного поприседать с изменением исходников и типизацией; в pybind11 — писать экспорты. 

Отрыл [cppyy](https://cppyy.readthedocs.io/en/latest/starting.html). В нем чтобы импортировать C++ класс достаточно написать
```python
cppyy.include("someClass.cpp")

instance = cppyy.gbl.SomeClass()
```
... и все. Методы и классы легко грузятся по имени. Работает это все за счет [cling](https://root.cern/cling/) — интерпретатора для C++. Можно ~~грабить корованы~~ создавать экземпляры стандартных классов, например, [vector](https://cppyy.readthedocs.io/en/latest/stl.html#std-vector).

Разумеется, цена этому — производительность, но питон же, да и то, не все [так просто](https://cppyy.readthedocs.io/en/latest/philosophy.html).
