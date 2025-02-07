---
layout: post
title: "\"Кроссплатформенность\" bash"
tags: [cli, mac, linux]
tg_id: 581
---
Годами сидя на линуксе, особо не задумываешься об версиях баша и стандартных утилит: по умолчанию ожидаешь, что `cp` и в Африке `cp`, и думать тут много не надо.

Но как только надо написать какой-нибудь не очень тривиальный однострочник, чтобы добавить его в документацию и/или репозиторий, чтобы "работало" везде, сразу возникают проблемы. Например, у какого-нибудь `sed` есть как минимум две версии: BSD (во фряхе и маках) и GNU (в большинстве линуксов), и они серьезно отличаются.

Казалось бы, есть [POSIX-команды](https://en.wikipedia.org/wiki/List_of_POSIX_commands), можно врубить какой-нибудь режим совместимости и все будет пусть и безобразно, но единообразно, да? \*падме.жпг\*
Реальность, разумеется, полна разочарований: так с большинством команд сделать не получится.

Например, GNU `date -Is -ud @249499969321` — это BSD `date -Iseconds -ur 249499969321`, и если `seconds` тоже можно использовать в первом случае, то остальное уже не поменять. 

Другой пример: в BSD `sed` "на месте" должен быть явным, `-i ""`, а в GNU должно быть именно `-i`, без явной пустой строки. Обо всяких `\b` тоже можно забыть.

Наконец, некоторые вещи можно обнаружить только методом проб и ошибок, например, `strftime` в `awk`.

Вишенка на торте: по умолчанию на маках стоит баш версии 3.2 аж от 2007 года (пусть даже ее постоянно патчат, функционально она застыла во времени). 

В качестве обходного решения на маке можно... тупо [поставить GNU-версии](https://unix.stackexchange.com/a/729136/44278) через `brew`. В среднем по больнице они все равно лучше. Но если это невозможно, то очевидный вариант — обмазать скрипт `if/else` с проверками на систему или переписать на питон. Еще один обходной путь: вызывать два варианта команды через `||` с учетом того, что неподходящий вариант отвалится с ошибкой. 
