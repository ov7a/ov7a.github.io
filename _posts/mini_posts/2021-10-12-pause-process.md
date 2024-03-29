---
layout: post
title: Приостановка процесса
tags: [linux, cli]
---
Чтобы [приостановить работу](https://unix.stackexchange.com/questions/2107/how-to-suspend-and-resume-processes) какого-нибудь долгого процесса, можно отправить ему сигнал `TSTP`:
```bash
kill -TSTP [pid]
```
или, если он был проигнорирован — `STOP`:
```bash
kill -STOP [pid]
```
Продолжить процесс потом можно будет через сигнал `CONT`:
```bash
kill -CONT [pid]
```

Мне эти команды пригодились для временной остановки питонячего скрипта миграции данных, который "долго запрягает, но быстро едет". Перезапуск потребовал бы ручной перенастройки (чтобы не повторять уже выполненные операции). Скрипт проигнорировал `TSTP`, а вот после `STOP` успешно приостановил свою работу.

