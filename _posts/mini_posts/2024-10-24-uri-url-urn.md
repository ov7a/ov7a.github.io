---
layout: post
title: URI vs URL vs URN
tags: [web]
tg_id: 561
---
Если попытаться загуглить отличие этих концептов, то поисковик выплюнет вам тонны статей и ответов, которые противоречат друг другу. Например, может ли URI быть одновременно и URL, и URN? Иногда будет картинка с пересечением, иногда без (без картинок статьи можно не читать). А если углубляться в вопрос относительности/абсолютности, то там вообще черт ногу сломит.

Попробуем обратиться к первоисточнику — RFC. Проблема в том, что это довольно [длинный список документов](https://www.w3.org/Addressing/#background) (ain't nobody got time for that). Ладно, может найдется какая-нибудь неплохая выжимка? Вот [этот ответ](https://stackoverflow.com/a/28865728) на StackOverflow выглядит неплохо, но если почитать соседние комментарии, то не все так однозначно. В Википедии неплохие картинки с синтаксическими диаграммами ([URI](https://en.m.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax), [URN](https://en.m.wikipedia.org/wiki/Uniform_Resource_Name#Syntax)), но они тоже не очень стыкуются с ответами и тексты статей содержат довольно пространные рассуждения о связи сущностей между собой.

Если начать читать [последний RFC по URI](https://datatracker.ietf.org/doc/html/rfc3986#section-1.1.3), то ощущение ясности тоже не появится: RFC не очень четкий и может быть интерпретирован так, как будто он противоречит сам себе. Под конец исследования я нашел [эту статью](https://danielmiessler.com/p/difference-between-uri-url/), в которой кратко описано практически все вышесказанное. Не на 100% с ней согласен, но главный вывод это

> The best thing I can possibly tell you about this debate is not to over-index on it. I’ve not once in 20 years seen a situation where the confusion between URI or URL actually mattered. 


