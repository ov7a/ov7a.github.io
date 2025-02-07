---
layout: post
title: Недостатки закона Постела
tags: [web, api, bestpractices]
tg_id: 573
---
Сам [принцип](https://en.wikipedia.org/wiki/Robustness_principle) звучит примерно так:

> Будьте либеральны в том, что вы принимаете, и консервативны в том, что вы отправляете.

На поверхности звучит логично, и, пожалуй, он неплохо применим к [пользовательскому вводу](https://www.lawsofux.ru/postels-law.html), однако в долгосрочной перспективе этот принцип скорее вредит. Даже в самой википедии есть критика, но подробнее и с примерами можно почитать в [этой заметке](https://datatracker.ietf.org/doc/html/draft-thomson-postel-was-wrong-03), размещенной на сайте интернет-стандартов, в контексте которых и зародился принцип. А еще недавно появилась [статья](https://grayduck.mn/2024/11/21/handling-cookies-is-a-minefield/) с еще одним наглядным примером про куки: сочная дичь, которая получилась как раз из-за недостаточной строгости.

Если вкратце обобщить источники выше:
* Если что-то "почти правильное" принималось без проблем, то оно может стать де-факто стандартом. Потом будут сюрпризы при использовании альтернативных реализаций, особенно если у них разный уровень толерантности к вводу. Похожая фигня [случилась](/2024/10/24/uri-url-urn.html) с URI/URL. Из-за этого возможно придется делать [совместимость на уровне багов](https://en.wikipedia.org/wiki/Bug_compatibility).
* Нечеткая интерпретация спецификации может привести [к уязвимостям](https://petsymposium.org/2018/files/papers/issue2/popets-2018-0011.pdf) и другим проблемам безопасности.
* Толератность приводит к усложнению реализации: будут разные модели для ввода и вывода, ну и в целом надо будет поддерживать дополнительный код для исправления неточностей, количество которого потенциально может расти со временем для обеспечения взаимодействия с новыми реализациями.
* Многие упускают аспект, что этот принцип нужен для исправления недостатков спецификации, но часто есть возможность улучшить саму спецификацию.
* Если не глотать ошибки/недочеты, то их будет проще обнаружить, и будет обратная связь для протокола/спецификации.
* Работать обычно проще с меньшей вариативностью, KISS и все такое.

