---
layout: post
title: "Задачи: делить или не делить? (или \"У меня бомбит от скрама\")"
tags: [teamlead, мысли]
hidden: true
---
Disclaimer: многие вещи намеренно гиперболизированы. Структура заметки стремная и похожа на поток токсичного сознания.

## Плюсы

В последнее время есть тренд на деление задач на максимально мелкие подзадачки. См., например, [доклад](https://teamleadconf.ru/moscow/2020/abstracts/6240).
С одной стороны, выглядит довольно логично: слона-то надо есть по частям. Плюсов довольно много, мелкую задачку:
- проще сформулировать
- проще ревьюить
- проще мержить
- проще оценить
- проще понять
- можно кинуть на новенького
- легче параллелить между разными людьми
- да и вообще, конвеер получается, проще менять шестеренки!

С другой стороны, сейчас разработчик во многих компаниях снова становится кодером (или просто продолжает?). В типичном скраме задачка рождается в недрах разума "подставок для бифштекстов", фильтруется "продуктом", жуется аналитиком и выплевывается в Jira-таск: накодь-ка мне, пожалуйста.

![](/assets/gags/2021-05-19-feeding-tasks.png)

Потом другой разраб посмотрит (при хорошем раскладе), и дальше поедет через "леди баг" на "шило". Все, что не касается собственно кодирования — в топку, [делай, что говорят](http://adamard.com/little_tasks.html), но потом спросят на "смотре выступлений": "а как ты повлиял на наши бизнес-OKR и KPI года по выручке". Чтобы сильно не вякали, можно дать щедрых 20% времени, незанятого встречами, на "техдолг" (но только если не будет задач поважнее, и "техдолг" может быть таким, что это фича).

## Минусы

Если разбить обычную задачу на мелкие, ее очень **легко сделать не до конца**: 20% усилий ради 80% результата, остальное лежит гнить в бэклоге, который может никто и не разгребать (да и зачем, когда продакт знает, где горит сейчас у бизнеса и что ему нужно). А еще когда бэклог из мелких задачек — отличный повод сказать "ой, там так много задач, давайте сфокусируемся на тех, что в приоритете, я их и так знаю".

![](/assets/gags/2021-06-23-refactoring.jpg)
(картинка немного [баян](https://t.me/dev_meme/3115), но осознал я это слишком поздно, shame on me)

Так одну задачку можно три раза заводить — потому что про предыдущие две копии никто уже не помнит. **Нет видения цельной картины**, исполнитель не всегда понимает, [*зачем*](/2020/02/17/smartrhino-delegating-tasks.html) он ее делает, от этого **страдает качество**. Причем это может возникнуть как и в случае, когда над одной большой задачей работают несколько человек (в т.ч. потому что каждый делает немного по-другому), так и один (по частям задача выглядит хорошо, целиком — зависит от того, кто разбивал на тикеты, обычно это не исполнитель).

![](/assets/images/bike-path.jpeg)

Кстати, про цельную картинку: **где архитектура** в Скраме? Ответ в рифму, и она ["появляется сама"](https://dzone.com/articles/what-is-software-architecture-in-scrum), с учетом того, что скрам это про то, как быстро сделать как-нибудь, чтобы потом переделать нормально (когда-нибудь через никогда). Можно, конечно, завести отдельную задачку "на архитектуру", но, во-первых, это "не настоящий Скрам", во-вторых, маловероятно, что будут достаточно проработаны все требования (это же не водопад, чтобы заранее знать стратегический план, "вижена" вперед на одну-две итерации хватит).

Разбиение задачи на кучу мелких **не защитит от рисков**. Во-первых, о чем-то можно тупо забыть. Во-вторых, многое возникает на середине пути (если это не совсем спинно-мозговые задачи). Поэтому да, сами мелкие задачи проще оценить, но это не значит, что большая задача будет оценена точнее.

При частом переключении между мелкими задачами теряется не только общее видение, но и **фокус**. Сегодня мелкая задача в одном микросервисе, через полдня (час?) в другом, переключение контекста — это не бесплатно. Тут сам с собой поспорю, потому что делать задачи в одной области кода может легко надоесть, поэтому важно найти золотую середину. По моему опыту она лежит ближе к большим задачам. Признаю также, что как руководитель, мог бы и получше следить за этим балансом в своей команде на старой работе :( Фокус теряется и в формулировках: приходится копипастить описание или заглядывать в эпик.

Мелкие задачи приводят к тому, что **разработчик разучивается мыслить**. В задаче все уже максимально разжевано — зачем напрягаться? Вот только когда попадается задача на исследование, в которой надо делать что-то необычное или просто высокая степень неопределенности, то она превращается в Большую и Страшную Задачу на Много Сторипоинтов, Которую Надо Поделить (даже если это бессмысленно). И делать ее после кучи мелких действительно тяжело, тяжко говорить на дейли "занимался своей Задачей". Хочется закончить с ней побыстрее, а не покачественнее. А поскольку обычно не разработчик делает тикет, то и навыки декомпозиции тоже страдают. В том числе нормальное разбиение на коммиты. Тяжело ревьюить не большие задачи, а большие коммиты-свалки.

Следствие проблемы большой задачи среди маленьких и отсутствие видения полной картины — **тяжело вносить что-то новое**. Просто потому, что это "большая" задача, а надо быстро, некогда экспериментировать, вагон задач ждет своей очереди. В итоге **тяжело развиваться**, потому что негде думать и нет ничего нового.

Если несколько человек работает над большой задачей, разбитой на мелкие кусочки, это **не обязательно означает, что будет больше бас-фактор** или что больше человек будут понимать весь код, связанный с задачей, целиком. Повысить бас-фактор, вообще говоря, можно нормальной документацией, код-ревью и пометками в тикетах.

Кстати, мелкие задачи **не мотивируют отписываться в тикетах**. В большинстве мелких задач это не нужно. Но вот в более-менее крупных задачах имеет смысл писать о неудачных решениях, возникших проблемах и т.п. Это поможет в будущем понять, почему было сделано "именно так", а не "иначе". Обычно эта информация передается из уст в уста на дейли (разумеется, завтра это уже никто не вспомнит).

Разбиение на мелкие таски в пределе — это создание тикетов, которые **дольше писать, чем делать**. Чтобы он полежал в бэклоге, чтобы его прогрумили (если есть такой процесс, конечно), приоритезировали, оценили "вэлью", оценили в "сторипоинтах" планнинг-покером... Хотя это мог бы быть просто коммит.

Наконец, от мелких задач **нет чувства достижения**. Работать в команде — это хорошо, но хочется и самостоятельно что-то из себя представлять. Что говорить на итогах года? Сделал 100500 тикетов, которые попались по очереди? Писал код? Как следствие — легче "забить" на некоторые шероховатости: код-то общий, даже если ты его вылижешь, мало кто это оценит.

Может, в скраме отказались от инженерного проектирования ПО и вся индустрия это [просто "авантюра с кодом"](https://garba.org/posts/2021/uml/)?

![](/assets/images/we_dont_need_programmers.jpg)

## И чо?

Безусловно, можно делать хорошую работу и в скраме с мелкими задачами, особенно если команда классная (хотя скорее вопреки, да и процесс надо модифицировать под свои обстоятельства).

Но я бы смотрел на вопрос по-другому. Основная цель разработки — это все-таки получение работающего (надеюсь, что слово "качественно" здесь подразумевается) решения. Фокус, соответственно, должен быть на достижении результата, а не на том, *как* его достичь.

Для меня тикеты — это способ повышения прозрачности проекта и управления разработкой. Это история разработки, средство отчетности и банально средство записи того, что надо еще сделать. Декомпозировать задачи нужно, но считаю, что разбивать задачи на подзадачи — зона ответственности разработчика-исполнителя (начинающим помогут старшие товарищи). Как он делает (отдельными тикетами, комментариями в тикете, чек-листами и т.п.) — не так важно, лишь бы это было в трекере и читабельно (потому что он делает это не только для себя), а не на словах на дейли или вообще непонятно где. Но при этом не надо возводить владение кодом совсем в абсолют, и делать его [сильным](https://martinfowler.com/bliki/CodeOwnership.html): да, экспертиза будет бешеной, но может надоесть.

Может, это я уже старый дед и не хочу учиться новым трюкам, но все-таки хочется делать цельные задачки, а не кусочки...
