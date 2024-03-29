---
layout: post
title: Уровни языков программирования
tags: [фп]
---
Был в Академгородке на выставке "Наука Сибири", там попалась книжка 2015 года про парадигмы программирования. В оглавлении встретились "языки низкого уровня", "языки высокого уровня" и ... "языки сверхвысокого уровня". "О таком я еще не слышал, — подумал я, — наверно, это про какой-нибудь Haskell или Prolog, которые сильно абстрагированы от железа. Или про DSL?"

Но оказалось, что сибирские ученые таким языком считают Sisal — [еще один](https://parallel.ru/tech/tech_dev/par_lang.html) достаточно специфичный язык для параллельных вычислений, который позволяет не заботится о синхронизации и разбивке на отдельные процессоры/компьютеры. Он является "функциональным потоковым языком, ориентированным на написание больших научных программ", "одним из самых известных потоковых языков промышленного уровня", "позиционируется как замена языка Fortran для научных применений" и позволяет "предоставить широкому кругу прикладных программистов, не имеющих достаточного доступа к параллельным вычислительным системам, но являющихся специалистами в своих прикладных областях, возможность быстрой разработки высококачественных переносимых параллельных алгоритмов на своем рабочем месте". Создан язык в 1983 году, вторая версия вышла в 1991, а в ИСИ СО РАН [развивают](https://www.iis.nsk.su/files/preprints/132.pdf) этот язык после третьей версии, уже даже [cloud-версия есть](https://www.elibrary.ru/item.asp?id=26612083). По синтаксису напоминает Pascal.

Что такое язык сверхвысокого уровня, я в итоге и не понял (но можете попробовать вы, начать можно [отсюда](https://www.computer-museum.ru/histsoft/program_paradigma.htm), осторожно, опасно для мозга), но по идее Erlang, любой язык с акторами, Spark DSL — это все языки сверхвысокого уровня в данной терминологии.

Любопытно, что Википедия языками сверхвысокого уровня [считает](https://en.wikipedia.org/wiki/Very_high-level_programming_language) Python и Visual Basic. Правда, это термин из 90х, когда Си был языком высокого уровня (а сегодняшний программист скорее выделит для него "средний" уровень). А еще можно почитать про [поколения языков программирования](https://en.wikipedia.org/wiki/Programming_language_generations), где первое поколение — машинные коды, третье — С++, Java и т.п., а пример четвертого — 1C. Такие дела :)

