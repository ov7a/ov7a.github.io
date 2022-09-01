---
layout: post
title: alias при sudo
tags: [linux, cli]
---
[Оказывается](https://askubuntu.com/questions/22037/aliases-not-available-when-using-sudo), alias работает только для первого слова.
Поэтому, если создать alias
```sh
alias ll='ls -lF'
```
то `ll` будет работать, а вот `sudo ll` — нет. Однако если текст alias заканчивается на пробел, то следующее за ним слово тоже будет проверено на alias.
Т.е. если добавить 
```sh
alias sudo='sudo '
```
то `sudo ll` будет работать.

