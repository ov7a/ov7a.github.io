---
layout: post
title: Зачем мне твои неизменяемые коллекции? Они же медленные
tags: [habr, kotlin, scala, jmh, benchmark]
hidden: true
repost: https://habr.com/ru/post/332460/
---
_Читая эту статью почти три года спустя, понимаю, что исследование весьма поверхностное, поэтому стоит воспринимать ее скептически._

Бывает так, что когда человек начинает писать на Kotlin, Scala или <code>%language_name%</code>, он делает  манипуляции с коллекциями так, как привык, как “удобно”, как “понятнее” или даже “как быстрее”. При этом, разумеется, используются циклы и изменяемые коллекции вместо функций высшего порядка (таких как <code>filter</code>, <code>map</code>, <code>fold</code> и др.) и неизменяемых коллекций.
 
Эта статья - попытка убедить ортодоксов, что использование “этой вашей функциональщины” не влияет существенно на производительность. В качестве примеров использованы куски кода на Java, Scala и Kotlin, а для измерения скорости был выбран фреймворк для микробенчмаркинга JMH.

<img src="/assets/images/cat_immutable_collections.jpg"/>

 Для тех, кто не в курсе, JMH (<a href="http://openjdk.java.net/projects/code-tools/jmh/">Java Microbenchmark Harness</a>) - это сравнительно молодой фреймворк, в котором разработчики постарались учесть все нюасы JVM. Подробнее о нем можно узнать из докладов Алексея Шипилева (например, <a href="https://shipilev.net/talks/devoxx-Nov2013-benchmarking.pdf">из этого</a>). На мой взгляд, проще всего с ним познакомится <a href="http://hg.openjdk.java.net/code-tools/jmh/file/tip/jmh-samples/src/main/java/org/openjdk/jmh/samples/">на примерах</a>, где вся необходимая информация есть в javadoc. 
 
Самая интересная часть в написании бенчмарков заключалась в том, чтобы заставить JVM реально что-то делать. Эта умная зараза заранее знала ответ на все и выдавала ответы за мизерное время. Именно поэтому в их исходном коде фигурирует <code>prepare</code>, чтобы обхитрить JVM. Кстати, Java Streams с предвычисленным результатом работали на порядок медленнее других способов.
 
<i><b>Dicslaimer:</b></i> все прекрасно знают, что написать бенчмарк правильно - невозможно, но предложения по тому, как написать его менее неправильно приветствуются. Если вам кажется, что обязательно надо рассмотреть пример с X, не стесняйтесь писать в комментариях, что еще надо потестить.
Кроме того, несмотря на то, что на одном графике будут и Kotlin, и Scala, и Java, считать это сравнением скорости кода на этих языках не стоит. Как минимум, в примерах на Scala есть накладные расходы на конвертацию <code>scala.Int</code>&hArr;<code>java.lang.Integer</code> и используются не Java-коллекции, а свои.
 
Исходный код примеров можно посмотреть <a href="https://github.com/ov7a/jmh-collections"> на гитхабе</a>, а все результаты в CSV - <a href="https://pastebin.com/sMsNDDm4">здесь</a>. В качестве размера коллекций использовались значения от 10 до 100 000. Тестировать для бОльших размеров я особо не вижу смысла - для этого есть СУБД и другие способы работы с большими объемами данных. Все графики выполнены в логарифмической шкале и показывают среднее время выполнения операции в наносекундах.
 
<h2>Простой map</h2>
 Начнем с самых простых примеров, которые есть в почти каждой статье про элементы функционального программирования: <code>map</code>, <code>filter</code>, <code>fold</code> и <code>flatMap</code>.
<img align="center" src="/assets/images/habr_immutable_collections_graph_map.png"/>
В Java циклом преобразовывать коллекции немного быстрее, чем с использованием Streams API. Очевидно, что дело в накладных расходах на преобразование в <code>stream</code>, которые здесь себя не оправдывают. В Kotlin преобразование с использованием <code>map</code> будет быстрее, чем цикл, причем даже быстрее, чем цикл на Java. Почему же это происходит? Смотрим исходный код <code>map</code>:

```kotlin
@PublishedApi
internal fun <T> Iterable<T>.collectionSizeOrDefault(default: Int): Int = 
      if (this is Collection<*>) this.size else default
...
public inline fun <T, R, C : MutableCollection<in R>> Iterable<T>.mapTo(
    destination: C, 
    transform: (T) -> R
): C {
   for (item in this)
       destination.add(transform(item))
   return destination
}
...
public inline fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R> {
   return mapTo(ArrayList<R>(collectionSizeOrDefault(10)), transform)
}
```
Получаем выигрыш за счет того, что заранее известен конечный размер коллекции. Конечно можно и в Java так сделать, но часто ли вы такое встречали?
 
В Scala разница между циклом и <code>map</code> уже ощутима. Если в Kotlin <code>map</code> довольно прямолинейно конвертируется в цикл, то в Scala уже не все так просто: если неявный <code>CanBuildFrom</code> - переиспользуемый <code>ReusableCBFInstance</code> из списка, то применяется хитрый <code>while</code> (заинтересованные могут посмотреть исходный код скаловского <code>map</code> для списка <a href="https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/immutable/List.scala#L280">здесь</a>).
 
<h2>Простой filter</h2>
<img align="center" src="/assets/images/habr_immutable_collections_graph_filter.png"/>
В Java для коллекций очень маленького размера Stream API немного медленнее, чем цикл, но, опять же, несущественно. Если коллекции нормального размера - разницы вообще нет.

В Kotlin разницы практически нет (прозрачная компиляция в цикл), но при больших объемах цикл чуть медленнее.

В Scala ситуация аналогична Java: на маленьких коллекциях функциональный подход немного проигрывает, на больших - нет разницы.
 
<h2>Простой <code>fold</code></h2>
Не совсем подходящий пример (потому что на выходе число), но все равно довольно интересный. 
<img align="center" src="/assets/images/habr_immutable_collections_graph_fold.png"/> 
Во всех трех языках различия между итеративной формой и функциональной несущественны, хотя <code>fold</code> в Scala работает медленнее, чем хотелось бы.

<h2>Простой flatMap</h2>
<img align="center" src="/assets/images/habr_immutable_collections_graph_flatmap.png"/> 
Снова разница между подходами практически неразличима.

<h2>Цепочка преобразований</h2>
Давайте рассмотрим еще пару примеров, в которых выполняются сложные преобразования. Отмечу, что очень много задач можно решить комбинацией <code>filter</code> и <code>map</code> и очень длинные цепочки встречаются редко. 
 
При этом если у вас все-таки получилась длинная цепочка преобразований, то имеет смысл перейти на ленивые вычисления (т.е. применять преобразования только тогда, когда необходимо). В Kotlin это преобразование к <code>Sequence</code>, в Scala - <code>iterator</code>. Streams в Java всегда выполняются лениво. 
 
Рассмотрим цепочку <code>flatMap</code>&rArr;<code>filter</code>&rArr;<code>fold</code>:

```kotlin
someList
       .flatMap(this::generate)
       .filter(this::filter)
       .fold(initialValue(), this::doFold)
```
<img align="center" src="/assets/images/habr_immutable_collections_graph_chain.png"/> 
Разница по скорости между императивным подходом и функциональным снова весьма мала. Исключение составляет Scala, в которой функциональный подход медленнее цикла, но с <code>iterator</code> разница сводится к нулю.

<h2>Цепочка со вложенными преобразованиями</h2>
Рассмотрим последовательность преобразований, где элементами промежуточной коллекции тоже являются коллекции, и над которыми тоже надо выполнять действия. Например топ-10 чего-то по какой-нибудь хитрой метрике:

```kotlin
someList
    .groupBy(this::grouping)
    .mapValues {
        it.value
            .filter(this::filter)
            .map(this::transform)
            .sum()
    }
    .entries
    .sortedByDescending { it.value }
    .take(10)
    .map { it.key }
```
Честно говоря, мне такое уже тяжело было написать в императивном стиле (к хорошему быстро привыкаешь; я сделал две тупых ошибки и в одном месте перепутал переменную).
<img align="center" src="/assets/images/habr_immutable_collections_graph_complex_chain.png"/> 
Здесь результаты уже немного интереснее. На коллекциях размером до сотни разница между итеративным и функциональным подходом стала заметна. Однако на коллекциях большего размера разницей можно уже пренебречь. Стоит ли вам экономить 10 микросекунд процессорного времени? Особенно если при этом надо поддерживать код вроде такого: 

```java
Map<Integer, Integer> sums = new HashMap<>();
for (Integer element : someList) {
   Integer key = grouping(element);
   if (filter(element)) {
       Integer current = sums.get(key);
       if (current == null) {
           sums.put(key, transform(element));
       } else {
           sums.put(key, current + transform(element));
       }
   }
}
List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(sums.entrySet());
entries.sort(Comparator.comparingInt((x) -> -x.getValue()));
ArrayList<Integer> result = new ArrayList<>();
for (int i = 0; i < 10; i++) {
   if (entries.size() <= i){
       break;
   }
   result.add(entries.get(i).getKey());
}
return result;
```
<h2>Заключение</h2>
В целом получилось, что для всех случаев у функционального подхода если и есть проигрыш, то, на мой взгляд, он несущественный. При этом код, на мой взгляд, становится чище и читабельнее (если говорить про Kotlin, Scala и другие языки, изначально поддерживающие ФП), а под капотом могут быть полезные оптимизации. 

Не экономьте на спичках: вы же не пишете на ассемблере, потому что “так быстрее”? Действительно, может получиться быстрее, а может и нет. Компиляторы сейчас умнее одного программиста. Доверьте оптимизации им, это их работа.

Если вы все еще используете какой-нибудь <code>mutableListOf</code>, задумайтесь. Во-первых, это больше строк кода и бОльшая вероятность сделать ошибку. Во-вторых, вы можете потерять оптимизации, которые появятся в будущих версиях языка (или уже есть там). В-третьих, при функциональном подходе лучше инкапсуляция: разделить <code>filter</code> и <code>map</code> проще, чем разбить цикл на два. В-четвертых, если вы уж пишете на языке, в котором есть элементы ФП и пишете “циклами”, то стоит следовать рекомендациям и стилю (например, Intellij Idea вам будет настоятельно рекомендовать заменить <code>for</code> на соответствующее преобразование).