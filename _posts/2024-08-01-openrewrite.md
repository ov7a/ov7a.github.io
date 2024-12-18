---
layout: post
title: Автоматический рефакторинг кода с помощью OpenRewrite
tags: [java, legacy]
category: blog
tg_id: 536
---
Попробовал применить [OpenRewrite](https://docs.openrewrite.org/) к репозиторию Gradle и если вкратце, то все очень плохо.

В официальной документации очень солидные заявления — утилита позволяет делать автоматический рефакторинг на основе рецептов, при этом код преобразуется в семантические деревья, к ним применяются трансформации и результат "минимально инвазивно" записывается обратно. 
Основная фишка инструмента, как я понял, заключается в том, что вы пишете правила для рефакторинга (или используете готовые), а потом применяете скопом к своей большой кодовой базе (возможно из нескольких репозиториев), экономя время на ручной труд.

Но реальность полна разочарований.

## Подключение к проекту и запуск

Довольно быстро обнаружилось, что плагин для Gradle не поддерживает современные фишки: кэш настроек, параллельное выполнение (с весьма странным [багом](https://github.com/openrewrite/rewrite-gradle-plugin/issues/212)) и т.п.
Вдобавок к этому, парсер давился на Groovy файлах (у нас большинство тестов написаны на нем), что довольно странно, ведь вроде инструмент поддерживает Groovy.
Но это еще цветочки, эта приблуда еще пыталась обработать `jsp` из ресурсов! 
Т.е. она даже не понимает, где исходники и на каком языке, и видимо молотит все текстовые файлы подряд.

Через час (sic!) после запуска я получил... OOM. 
Возможно где-то есть утечка памяти, либо в самом Gradle, либо в плагине. 
Я в итоге плюнул и написал скрипт, который применяет утилиту к одному подпроекту за раз. 
Память пришлось поднять только для одного большого подпроекта. 

Работает утилита, мягко говоря, не быстро: чтобы весь код прошерстить, ей понадобилось больше 2 часов (и это на топовом маке). 
Впрочем, насчет производительности разработчики вряд ли парятся — платный вариант как раз обещает ускорение за счет своей БД, чтобы не перестраивать семантические деревья каждый раз с нуля.

## Сами изменения

Сначала я попробовал применить рецепт по миграции на Java 8 — первая версия Gradle была написана аж 2008, кода довольно много, и что-то могло остаться в "старом стиле".
Но этот рецепт никаких изменений не внес.

Далее я попробовал миграцию на Java 17 — там уже была куча правок, но не стал углубляться, т.к. ее обновление пока только запланировано.

Пока я ждал первого прогона, почитал документацию в целом и поискал, какие есть интересные готовые рецепты.
Инструмент очень сильно сфокусирован на Java (даже не JVM). 
Кроме обновления версии Java я нашел только 2 интересных рецепта: `CodeCleanup` и `CommonStaticAnalysis`.
Там были и другие, например для обновления билд-скриптов, миграции на новую версию Hibernate и т.п., но большинство из них были довольно узко применимыми. 

Сами изменения были не без ошибок:
* добавлялся `final` к свойствам, которые потом изменялись, и к классам, у которых были наследники;
* удалялись/добавлялись параметры типов там где не надо;
* была добавлена куча пустых конструкторов (видимо, чтобы сузить область видимости), но ценности я в этом не увидел;
* пока не добавил исключения, Groovy файлы были обновлены по непонятным правилам: например, `as SomeClass` превратилось в `asSomeClass`.

Отдельно отмечу упрощение условий: оно было настолько тупое, что заменило
```java
!(methodName != null ? !methodName.equals(that.methodName) : that.methodName != null);
```
на
```java
methodName == null ? !methodName.equals(that.methodName) : that.methodName != null;
```
что буквально вызовет NPE.
Тут у меня начались вьетнамские флешбеки от кривых `#define` в Си, где надо было огораживать все скобками, иначе получится шляпа.
При этом IntelliJ через пару <kbd>Alt</kbd>+<kbd>Enter</kbd> заменит этот код на человеческий
```java
Objects.equals(methodName, that.methodName)
```

Другой показательный пример:
```java
public boolean isEmpty() {
  return size() == 0;
}
```  
был заменен на
```java
public boolean isEmpty() {
  return isEmpty();
}
```   
Да-да, это классическая реализация `StackOverflowError`. 

Все вышеперечисленное приводило к ошибкам компиляции и к ошибкам от существующих средств проверки качества кода (`-Werror`, ErrorProne, CodeNarc и т.п.).
Из-за этого я переписал скрипт, чтобы после применения рецептов к подпроекту запускалась компиляция. 
Разумеется, это еще больше замедлило и без того небыстрый процесс.
И ошибки компиляции править приходилось вручную, так что продуктивность полетела прямиком в помойку.

Самое отстойное, что некоторые рецепты проще всего было бы отключить совсем, но такой опции у инструмента [нет](https://github.com/openrewrite/rewrite/discussions/4211).
\*звуки грустного тромбона\*

## Вывод

Я был довольно упертым и все-таки применил рецепты ко всем проектам. 
В итоге было обновлено 1700+ файлов.
Было ли там что-то такое, ради чего стоило проходить через эти пляски?
Если кратко, то нет.

Были изменения в форматировании (местами сомнительные, типа Йода-условий или порядка модификаторов), манипуляции с импортами, упрощение условий (см. пример выше), везде была добавлена куча `final` (даже там где не надо), лямбды были заменены на ссылки на методы, убраны ненужные параметры типов, мелкие изменения типа замены `.size == 0` на `.isEmpty()` или страшной восьмеричной системы с `0777` на понятную десятеричную с `511`. 

Если ваша кодовая база маленькая, то вы вряд ли будете будете писать новые рецепты — проще руками через IDE все мигрировать.
Если кодовая база большая, и есть платформенная команда, то скорее всего код и так уже будет довольно однородный и кучу вещей можно будет решить скриптом/простыми текстовыми преобразованиями.
Кажется, рецепты имеет смысл писать только для чего-то специфичного.
Самая потенциально полезная часть инструмента — общеприменимые рецепты (типа миграции Java), но их не очень много и покрывают они на удивление мало.

Но все это просто уничтожается качеством инструмента.
От чего-то, основанного на семантическом представлении, которое строится тыщу лет, я ожидаю, что итоговый код будет хотя бы компилироваться и не содержать очевидных ошибок.
А по факту все это не сильно лучше текстовых замен или `#define` в Си со всеми их недостатками.
IntelliJ гораздо лучше понимает код и его контекст.
И такое ощущение, что с ней сделать те же операции было бы быстрее.

В общем, great idea, does not work.

P.S. Затеял я это все для того, чтобы посмотреть, какие есть инструменты для миграции кодовой базы с одного языка на другой.
ChatGPT и прочие AI штуки сразу отмел, т.к. хотя с маленькими кусочками он и хорошо справлялся, но я думал, что недостаточно надежно будет его применять для большого количества кода.
Но кажется для этой задачи он явно лучше этого изделия.
Еще находил [Txl](https://www.txl.ca/txl-abouttxl.html), но он показался слишком сложным.
Планирую попробовать его в будущем.

