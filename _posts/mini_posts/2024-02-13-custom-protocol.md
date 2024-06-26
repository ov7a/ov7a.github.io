---
layout: post
title: Региcтрация собственного протокола для ссылок
tags: [linux, mac, web]
tg_id: 483
---
В продолжение темы про [маршутизатор для браузеров](/2024/02/01/zig.html).

Вот допустим я хочу из браузера открывать ссылки во внешнем приложении. Как это сделать? Нужно расширение. Но есть проблемка: нельзя просто так взять и запустить какое-то там приложение из браузера. Даже по команде 300 раз одобренного расширения. Нужно использовать [обмен сообщениями](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging), и специальное приложение-клиент, которое принимает эти самые сообщения в простом формате (бинарная длина + само сообщение) через стандартный поток данных. Регистрация всего этого — гемор, вдобавок, для Firefox и Chrome есть отличия.  

Есть обходной путь: использовать протоколы типа `tg://` или `zoommtg://`, которые открывают ссылку в другом приложении. Например, если на маке набрать в Chrome `firefox:https://example.com`, то откроется Firefox с указанным адресом. Chrome так уже не умеет, но не очень-то и хотелось: можно зарегистрировать протокол для своей утилитки.

Как зарегистрировать протокол в Linux? [Добавить](https://github.com/ov7a/browserRouter/commit/c85139b49ca5aecdf8282062871ab65197226101) немного метаданных в ярлык и добавить 2 команды. Увы, браузеры отслеживают этот список отдельно, и чтобы ссылка работала еще и в браузере, надо хоть раз по ней внутри браузера кликнуть (иначе будет перенаправление в поиск). Ну еще и утилиту надо обновить парой строчек, чтобы отрезала "лишний" префикс.

Как зарегистрировать протокол на маке? Тоже добавить пару строчек метаданных в ярлык и... страдать, потому что передача ссылки опять идет через Apple Events, а не через аргументы командной строки.

