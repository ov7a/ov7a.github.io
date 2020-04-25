---
layout: post
title: Права и символические ссылки
tags: [linux, cli]
---
Если вы хотите сменить права на символическую ссылку, то надо использовать флаг `-h` для `chown`:
```bash
$ mkdir target
$ ln -s target symlink
$ stat -c "%U %F %N" *
ov7a symbolic link 'symlink' -> 'target'
ov7a directory 'target'
$ chown nobody symlink
$ stat -c "%U %F %N" *
ov7a symbolic link 'symlink' -> 'target'
nobody directory 'target'
$ chown ov7a symlink # ops, lets rollback
$ chown -h nobody symlink # retry with -h flag
$ stat -c "%U %F %N" * 
nobody symbolic link 'symlink' -> 'target'
ov7a directory 'target'
```
