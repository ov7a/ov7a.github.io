---
layout: post
title: Как тестировать работу с реляционной БД
tags: [бд, sql, testing]
---
Самые банальные варианты включают в себя:
1. Тестирование на тестовом стенде (для особых извращенцев — на общем стенде, для супер-извращенцев — резервирование ресурса путем устных переговоров с коллегами, ну а у темных властелинов тестовый стенд — это прод).
2. Тестирование с БД, которая разворачивается локально (возможно даже сама, возможно в докер-контейнере).
3. Тестирование с in-memory аналогом.

С первым пунктом все понятно, а вот между другими двумя надо думать.

С одной стороны, завязываться на реализацию БД как-то странно, особенно с учетом того, что вряд ли к базе идет обращение напрямую, а не через ORM и/или DSL, и может еще и через liquibase. С другой — эти абстракции дырявые, и тот же liquibase поле с типом TEXT создаст как TEXT (он же VARCHAR) в Postgresql, но как CLOB в H2. Вдобавок, у различных СУБД есть свои "особенности", от которых не всегда получится абстрагироваться — помню как года 4 назад во времена импортозамещения у меня пригорело от того, что Oracle не различает пустую строку и null. Вдобавок всякие статьи говорят о том, что не-не, нельзя делать unit-тесты c in-memory H2, если у вас на проде Postgresql, у вас прод сгорит и вообще мы все умрем.

В моем идеальном мире все СУБД и прослойки для общения с ними написаны нормально и такие проблемы не должны возникать. В чуть менее идеальном — эти отличия несущественные и легко проверяются интеграционными тестами, если надо поддерживать несколько СУБД, или влияют только на производительность, но не на интерфейсы/поведение.

Но этой заметки не было бы, если бы не потекшие абстракции: при обновлении H2 столкнулся с проблемой, что они решили кидать исключение про то, что не поддерживают индексы на CLOB поля (хотя раньше просто ничего не делали). И вот сошлись звезды в лице связки liquibase + H2, и несмотря на то, что никакие нестандартные вещи не использовались, все поломалось. Конкретно в этом кейсе удалось извернуться, но ситуация насторожила: получается, что SQL не такой уж и стандарт...
