---
layout: post
title: Визуализация кода
tags: [архитектура, graphics, compiler, bpmn]
tg_id: 535
---
В продолжении [темы](/2024/07/23/future-of-programming-1973.html) про визуальное/интерактивное программирование — неплохая [статья](https://blog.sbensu.com/posts/demand-for-visual-programming/) про полезность визуального представления кода.

Вкратце — никому особо не нужны графические свистелки-перделки для написания кода: текст достаточно выразителен, куча инструментов уже готово, рутину убирает IDE. Однако очень полезны всякие штуки, чтобы показывать верхнеуровневые вещи: связь модулей/сервисов между собой, расположение кода в памяти, последовательность обмена сообщениями и т.п. Перекликается с [докладом про интерактивное программирование](/2023/04/27/interactive-programming.html).

От себя добавлю, что в каком-то роде BPMN в связке с чем-то вроде Camunda можно считать визуальным программированием: нарисованная схема бизнес-процесса соответствует тому, как он исполняется и способствует прозрачности. Однако при этом детали реализации будут все равно написаны с помощью "обычного" программирования. Аналогично можно сказать и про конечные автоматы — я не знаком с хорошими готовыми библиотеками, но было несколько раз, когда состояние системы легко было описать конечным автоматом, но по коду это было тяжело отследить (и никакой картинки с состояниями и переходами разумеется не было).

А касательно интерактивного программирования — тут лидируют Excel и питоновские ноутбуки, где обновления будут практически мгновенными; ну и на фронте можно большую часть вещей делать в WYSIWYG режиме (особенно если включен live-reload).