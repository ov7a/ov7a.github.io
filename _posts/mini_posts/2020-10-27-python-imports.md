---
layout: post
title: Импорты в питоне
tags: [python]
---
Python весьма неплох для стряпанья скриптиков. Однако если однотипных скриптиков становится много и появляется общий код, то тем или иным образом возникнет проблема с организацией папочек так, чтобы импорты работали нормально. Классический пример — [импорт из "соседней" папки](https://stackoverflow.com/questions/6323860/sibling-package-imports).

Проблема связана в основном с тем, что питон может быть запущен в непонятно каком окружении, в котором может даже не быть иерархической структуры модулей. Поэтому импортировать можно только из sys.path, в котором не всегда будет путь к нужному модулю. Основные способы решения проблемы сводятся к следующим вариантам:
1. Вы все делаете неправильно, так писать код нельзя, срочно поменяйте свою структуру папок. Гвидо [проклинает](https://www.python.org/dev/peps/pep-3122/) таких, как вы.
2. Вы должны правильно настроить virtualenv, сделать одну из ваших папок пакетом и установить ее (как и любой пользователь ваших скриптов).
3. Вы можете запускать свои скрипты как модули с флагом `-m`. Успехов вам в добавлении этого в мутные инструкции по запуску и в слежении за тем, чтобы при автоимпорте всех скриптов из папки ничего не сломалось.
4. Вы можете грязным хаком добавить нужный путь в sys.path, например, так:
   ```python
   sys.path.append(str(pathlib.Path(__file__).resolve().parent.parent))
   ```
   Это самый простой и прямолинейный способ, но за него вы, разумеется, будете гореть в питоновском аду.

Подробнее про импорты можно прочитать [тут](https://chrisyeh96.github.io/2017/08/08/definitive-guide-python-imports.html) и [тут](https://alex.dzyoba.com/blog/python-import/).

Я знаю, что среди немногочисленных читателей канала есть сеньор-питонисты — напишите пожалуйста в ЛС, как решаются подобные проблемы у вас.

