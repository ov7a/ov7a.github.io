---
layout: post
title: Ограничения и предохранители
tags: [мысли, compiler, java, kotlin]
hidden: true
tg_id: 525
---
Зацепились языками с одним из коллег на тему удобства языка для разработки без IDE. Он заявил, что код на Kotlin невозможно читать без IDE. Вполне органично дискуссия перешла в плоскость того, полезны ли ограничения языка или нет.

Началось все с тезиса про то, что структура файлов в Java (1 файл на 1 класс, 1 папка часть пакета) это полезно и позволяет находить нужный класс быстрее. А вот в Kotlin можно как угодно делать. Поэтому ограничения — это хорошо, они приводят к порядку и простоте. В качестве дополнительных примеров были модификаторы видимости (C против Java), владение (C vs Rust) и т.п. Да и вообще, ограничения формируют/способствуют культуре разработки.

Когда я пытался аргументировать, что ограничение на структуру файлов — весьма дурацкое и особо не помогает, мой оппонент подумал, что я его троллю:) Так-то класс может быть в разных модулях, может быть вложенным и т.п., т.е. это не просто "иди по этому пути", и хоть какой-то поиск придется рано или поздно использовать. 

Весь спор пересказывать не буду, а перейду сразу к выводам.

Я понял, что есть 2 принципиально разных аспекта в языке: ограничения и предохранители. Предохранители — это обычно просто замечательно, они позволяют избегать тупых ошибок. Например, явная проверка на null в Kotlin или владение памятью в Rust — это предохранители. Ограничения — это противоположность выразительности, т.е. что-то, что мешает сделать программисту то, что он хочет. "Я ограничен технологиями своего времени".

Соответственно, ограничение и предохранитель легко спутать друг с другом (или дебатировать, что хорошо и что плохо). И вот тут-то и зарыт корень наших разногласий: мой коллега искренне считал, что структура папок в Java — это предохранитель и это хорошо, а для меня это еще одно ограничение. В этом плане мне гораздо [важнее](/2024/06/25/cognitive-load.html) разложить код по модулям, по ролям и/или по шаблону какой-нибудь трехбуквенной архитектуры. Обычно языку на это плевать, но в Java будет привет от `com.company.name.package.folder`.

Мне нравятся выразительные языки. На мой взгляд, хреново и непонятно можно написать на любом языке. Да, в более выразительном языке возможностей может быть больше, но человеческая тупость вообще бесконечна. В свою очередь, выразительный язык предоставляет больше возможностей написать код хорошо. А предохранители должны этому способствовать.

И разумеется, опыт в более выразительных языках [влияет](/2024/04/03/thoughts-on-c.html) на то, как разработчик пишет код. Однако говорить о том, что язык формирует культуру разработки — очень странно. Это как сказать, что ножницы формируют культуру парикмахерской, или молоток формирует культуру стройки. Если у вас инструмент формирует процессы и/или подходы — у меня для вас плохие новости...