---
layout: post
title: Как работает Live Reload?
tags: [linux, fs]
tg_id: 400
---
Live Reload — это возможность обновления локально запущенного приложения "на лету" при изменении исходного кода вместо того, чтобы его останавливать, перекомпилировать и запускать заново. Эта функция есть много где — например, у фронтендеров в npm, у бэкендеров в Spring, в Jekyll, внезапно в gradle (там это называется continuous build) и т.д. Для реализации этого механизма нужно отслеживать изменения в коде и потом их собственно применять. 

Первый этап можно реализовать одним из трех способов: 
1. Запомнить состояние исходников (сделать снапшот) и периодически повторять эту процедуру, сравнивая новую версию со старой.
2. Получать и обрабатывать уведомления от файловой системы.
3. Перехватывать системные вызовы.

С первым вариантом все понятно — он проще реализуется, но и более затратен по ресурсам. Второй вариант поинтереснее — у каждой ОС есть [свой механизм для этого](https://habr.com/ru/articles/164775/), со своими приколами. Третий вариант — для [упоротых](https://habr.com/ru/articles/413241/), для решения проблемы это перебор.

В Linux для уведомлений от ФС (второй способ) есть подсистема inotify. [Использовать ее](https://lwn.net/Articles/604686/) довольно просто: создается файловый дескриптор, к нему привязываются подписки на конкретные файлы и/или папки, потом в бесконечном цикле читаем структуры-сообщения об изменениях из дескриптора (ожидание будет за счет блокирующего `read`).

Кстати, в большинстве случаев за счет уведомлений от ФС работают команды вроде `tail -f`. Совсем всегда — не получится, т.к. удаленные системы обычно не посылают такой информации.

Механизм применения изменений сильно зависит от инструмента, но обычно сводится наличию демона/лоадера/супервизора, которые ждут сигнала о наличии изменений и при его получении обрабатывают изменения и заменяют текущую версию (перезаписыванием статики, перезагрузкой страницы, перезагрузкой классов из класслоадера и т.п.).

