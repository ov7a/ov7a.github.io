---
layout: post
title: Включение любого файла в сишный код
tags: [linux, c]
---
Если надо "вкомпилить" какой-нибудь бинарник в сишный файл. Для этого можно использовать команду `xxd`:
```
xxd --include filename
```
Выведет что-то вроде:
```
unsigned char filename[]={ 0x48, ...}; 
unsigned int filename_len = 123;
```
