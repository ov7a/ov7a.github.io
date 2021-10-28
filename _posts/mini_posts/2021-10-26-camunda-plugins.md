---
layout: post
title: Плагины Camunda Modeler
tags: [camunda, bpmn]
---
Два самых полезных [плагина](https://github.com/camunda/camunda-modeler-plugins), на мой взгляд — это [отображение границ транзакций](https://github.com/camunda/camunda-modeler-plugins/tree/master/camunda-transaction-boundaries-plugin) и [линтер](https://github.com/camunda/camunda-modeler-linter-plugin). Ставятся они тупо копированием в папку `plugins` в корне моделера.

Поскольку плагин — это код на javascript, то его можно легко изменить под свои нужны. Например, в плагине с транзакциями можно залезть в стили и сделать его поприятнее. А для линтера можно настроить правила или написать свои, даже [заготовка для этого есть](https://github.com/camunda/camunda-modeler-custom-linter-rules-plugin).

С написанием своих правил может возникнуть проблема, что документация к [линтеру](https://github.com/bpmn-io/bpmnlint) и [библиотеке работы с BPMN](https://github.com/bpmn-io/bpmn-js) оставляет желать лучшего, и у элемента есть ссылка на родителя, но не на детей. Но что-нибудь мелкое реализовать довольно легко, а создать дистрибутив можно через [Github action](https://github.com/ov7a/camunda-modeler-custom-linter-rules-plugin/blob/master/.github/workflows/release.yml).

Линтер BPMN можно даже встроить как проверку в maven, но это [то еще извращение](https://gist.github.com/ov7a/49bdc723f24e08a308aa70009476f860).

