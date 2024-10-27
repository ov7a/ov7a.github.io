---
layout: post
title: Читаете ли вы Scaladoc для «очевидных» методов коллекций? Или почему лениться не всегда хорошо
tags: [habr, scala]
category: blog
repost: https://habr.com/ru/post/430538/
---
Если вы не знаете, чем отличаются 
```scala
someMap.map{ case (k, v) => k -> foo(v)}
```
и
```scala
someMap.mapValues(foo)
```
кроме синтаксиса или сомневаетесь/не знаете, к каким плохим последствиям это отличие может привести и причем тут `identity`, то это статья для вас. 

В противном случае - поучаствуйте в опросе, расположенном в конце статьи.

<cut text="Я заинтригован"/>

## Начнем с простого
Попробуем втупую взять пример, расположенный до ката и посмотреть, что получится:
```scala
val someMap = Map("key1" -> "value1", "key2" -> "value2")

def foo(value: String): String = value + "_changed"

val resultMap = someMap.map{case (k,v) => k -> foo(v)}
val resultMapValues = someMap.mapValues(foo)

println(s"resultMap:       $resultMap")
println(s"resultMapValues: $resultMapValues")
println(s"equality: ${resultMap == resultMapValues}")
```
Этот код вполне ожидаемо выведет 
```
resultMap:       Map(key1 -> value1_changed, key2 -> value2_changed)
resultMapValues: Map(key1 -> value1_changed, key2 -> value2_changed)
equality: true
```
И примерно на таком уровне откладывается понимание метода `mapValues` на ранних стадиях изучения Scala: ну да, есть такой метод, удобно изменять значения в `Map`, когда ключи не меняются. И правда, чего тут еще думать? По названию метода все очевидно, поведение понятно.

## Примеры посложнее

Давайте немного модифицируем наш пример (я буду явно писать типы, чтобы вы не думали, что тут какой-то мухлеж с имплиситами):
```scala
case class ValueHolder(value: String)

val someMap: Map[String, String] = Map("key1" -> "value1", "key2" -> "value2")

def foo(value: String): ValueHolder = ValueHolder(value)

val resultMap: Map[String, ValueHolder] = someMap.map{case (k,v) => k -> foo(v)}
val resultMapValues: Map[String, ValueHolder] = someMap.mapValues(foo)

println(s"resultMap:       $resultMap")
println(s"resultMapValues: $resultMapValues")
println(s"equality: ${resultMap == resultMapValues}")
```
И такой код после запуска выдаст
```
resultMap:       Map(key1 -> ValueHolder(value1), key2 -> ValueHolder(value2))
resultMapValues: Map(key1 -> ValueHolder(value1), key2 -> ValueHolder(value2))
equality: true
```
Вполне логично и очевидно. "Чувак, пора бы уже переходить к сути статьи!"  - скажет читатель. Давайте сделаем создание нашего класса зависимым от внешних условий и добавим пару простых проверок на идиотизм:
```scala
case class ValueHolder(value: String, seed: Int)

def foo(value: String): ValueHolder = ValueHolder(value, Random.nextInt())
...
println(s"simple assert for resultMap:       ${resultMap.head == resultMap.head}")
println(s"simple assert for resultMapValues: ${resultMapValues.head == resultMapValues.head}")
```
На выходе мы получим: 
```
resultMap:       Map(key1 -> ValueHolder(value1,1189482436), key2 -> ValueHolder(value2,-702760039))
resultMapValues: Map(key1 -> ValueHolder(value1,-1354493526), key2 -> ValueHolder(value2,-379389312))
equality: false
simple assert for resultMap:       true
simple assert for resultMapValues: false
```
Вполне логично, что результаты теперь не равны, рандом же. Однако постойте, почему второй ассерт дал `false`? Неужели значения в `resultMapValues` изменились, мы же с ними ничего не делали? Давайте проверим, все ли там внутри также, как было:
```scala
println(s"resultMapValues: $resultMapValues")
println(s"resultMapValues: $resultMapValues")
```
И на выходе получаем:
```
resultMapValues: Map(key1 -> ValueHolder(value1,1771067356), key2 -> ValueHolder(value2,2034115276))
resultMapValues: Map(key1 -> ValueHolder(value1,-625731649), key2 -> ValueHolder(value2,-1815306407))
```
![image](/assets/images/habr_wat.jpeg)
## Почему это произошло?

Почему `println` меняет значение `Map`?
Пора бы уже и залезть в документацию к методу `mapValues`:
```scala
 /** Transforms this map by applying a function to every retrieved value.
 *  @param  f   the function used to transform values of this map.
 *  @return a map view which maps every key of this map
 *          to `f(this(key))`. The resulting map wraps the original map without copying any elements.
 */
```
Первая строчка говорит нам то, что мы и думали - изменяет `Map`, применяя к каждому значению переданную в аргументах функцию. Но если прочесть очень внимательно и до конца, то выяснится, что возвращается не `Map`, а "map view" (представление). Причем это не нормальное представление (`View`), которое вы можете получить с помощью метода `view` и у которого есть метод `force` для явного вычисления. А особый класс (код из Scala версии 2.12.7, но для 2.11 там практически то же самое):
```scala
protected class MappedValues[W](f: V => W) extends AbstractMap[K, W] with DefaultMap[K, W] {
  override def foreach[U](g: ((K, W)) => U): Unit = for ((k, v) <- self) g((k, f(v)))
  def iterator = for ((k, v) <- self.iterator) yield (k, f(v))
  override def size = self.size
  override def contains(key: K) = self.contains(key)
  def get(key: K) = self.get(key).map(f)
}
```
Если вы вчитаетесь в этот код, то увидите, что ничего не кэшируется, и при каждом обращении к значениям они будут высчитываться заново.  Что мы и наблюдаем в нашем примере.

Если вы работаете с чистыми функциями и у вас все иммутабельно - то вы не заметите никакой разницы. Ну, может, производительность просядет. Но, к сожалению, не все в нашем мире чисто и идеально, и используя эти методы, можно наступить на грабли (что и случилось в одном из наших проектов, иначе бы не было этой статьи).

Разумеется, мы не первые, кто столкнулся с этим. Аж в 2011 году был открыт [мажорный баг](https://issues.scala-lang.org/browse/SI-4776) по этому поводу (и на момент написания статьи он помечен как открытый). Там еще упоминается метод `filterKeys`, у которого точно такие же проблемы, потому что он реализован по такому же принципу. 

Кроме того, c 2015 года висит [тикет](https://youtrack.jetbrains.com/issue/SCL-8451) на добавление инспекции в IntelliJ Idea.

## Что делать?

Самое простое решение - тупо не использовать эти методы, т.к. по названию их поведение, на мой взгляд, весьма неочевидно. 

Вариант чуть получше - вызвать `map(identity)`. 
`identity`, если кто не знает - это функция из стандартной библиотеки, которая просто возвращает свой входной аргумент.  В данном случае основную работу делает метод `map`, который явно создает нормальный `Map`. Проверим на всякий случай:
```scala
val resultMapValues: Map[String, ValueHolder] = someMap.mapValues(foo).map(identity)
println(s"resultMapValues: $resultMapValues")
println(s"simple assert for resultMapValues: ${resultMapValues.head == resultMapValues.head}")
println(s"resultMapValues: $resultMapValues")
println(s"resultMapValues: $resultMapValues")
```
На выходе получим
```
resultMapValues: Map(key1 -> ValueHolder(value1,333546604), key2 -> ValueHolder(value2,228749608))
simple assert for resultMapValues: true
resultMapValues: Map(key1 -> ValueHolder(value1,333546604), key2 -> ValueHolder(value2,228749608))
resultMapValues: Map(key1 -> ValueHolder(value1,333546604), key2 -> ValueHolder(value2,228749608))
```
Все хорошо :)

Если вам все-таки хочется оставить ленивость, то лучше изменить код так, чтобы она была очевидна. Можно сделать implicit class с методом-оберткой для `mapValues` и `filterKeys`, который дает новое, понятное для них имя. Либо использовать явно `.view` и работать с итератором пар.

Кроме того, стоит добавить инспекцию в среду разработки/правило в статический анализатор/куда-нибудь еще, которое предупреждает об использовании этих методов. Потому что лучше потратить немного времени на это сейчас, чем наступить на грабли и долго разгребать последствия потом.

## Как вы еще можете наступить на грабли и как наступили на них мы

Кроме случая с зависимостью от внешних условий, который мы наблюдали в примерах выше, есть и другие варианты. 

Например, изменяемое значение (заметьте, тут на поверхностный взгляд все "иммутабельно"):
```scala
val someMap1 = Map("key1" -> new AtomicInteger(0), "key2" -> new AtomicInteger(0))
val someMap2 = Map("key1" -> new AtomicInteger(0), "key2" -> new AtomicInteger(0))

def increment(value: AtomicInteger): Int = value.incrementAndGet()

val resultMap: Map[String, Int] = someMap1.map { case (k, v) => k -> increment(v) }
val resultMapValues: Map[String, Int] = someMap2.mapValues(increment)

println(s"resultMap (1):       $resultMap")
println(s"resultMapValues (1): $resultMapValues")
println(s"resultMap (2):       $resultMap")
println(s"resultMapValues (2): $resultMapValues")
```
Этот код выдаст такой результат:
```
resultMap (1):       Map(key1 -> 1, key2 -> 1)
resultMapValues (1): Map(key1 -> 1, key2 -> 1)
resultMap (2):       Map(key1 -> 1, key2 -> 1)
resultMapValues (2): Map(key1 -> 2, key2 -> 2)
```
При повторном обращении к `someMap2` получили веселый результат.

К проблемам, которые могут возникнуть при необдуманном использовании `mapValues` и `filterKeys` можно добавить снижение производительности, повышение расхода памяти и/или повышение нагрузки на GC, но это уже больше зависит от конкретных случаев и может быть не так критично.

В копилку похожих граблей стоит также добавить метод `toSeq` у итератора, который возвращает ленивый `Stream`.

Мы на грабли с `mapValues` наступили случайно. Он использовался в методе, который с помощью рефлексии создавал набор обработчиков из конфига: ключами были идентификаторы обработчиков, а значением - их настройки, которые потом преобразовывались в сами обработчики (создавался инстанс класса). Поскольку обработчики состояли только из чистых функций, все работало без проблем, даже на производительности заметно не сказывалось (уже после наступания на грабли сделали замеры). 

Но как-то раз пришлось сделать в одном из обработчиков семафор для того, чтобы только один обработчик выполнял тяжелую функцию, результат которой кешируется и используется другими обработчиками. И тут на тестовой среде начались проблемы - валидный код, который нормально работал локально, начал валиться из-за проблем с семафором. Разумеется, первая мысль при неработоспособности новой функциональности - это то, что проблемы связаны с ней самой. Долго ковырялись с этим, пока не пришли к выводу "какая-то дичь, почему разные инстансы обработчиков используются?" и только по стектрейсу обнаружили, что подгадил нам оказывается `mapValues`. 

Если вы работаете с Apache Spark, то на похожую проблему можно наткнуться, когда внезапно обнаружится, что для какого-то элементарного кусочка кода с `.mapValues` можно словить 
```
java.io.NotSerializableException: scala.collection.immutable.MapLike$$anon$2
```
[https://stackoverflow.com/questions/32900862/map-can-not-be-serializable-in-scala](https://stackoverflow.com/questions/32900862/map-can-not-be-serializable-in-scala)<br>
[https://issues.scala-lang.org/browse/SI-7005](https://issues.scala-lang.org/browse/SI-7005)<br>
Но `map(identity)` решает проблему, а глубже копать обычно нет мотивации/времени.

## Заключение

Ошибки могут таиться в самых неожиданных местах - даже в тех методах, которые кажутся на 100% очевидными. Конкретно эта проблема, на мой взгляд, связана с плохим названием метода и недостаточно строгим типом возврата.

Конечно, важно изучать документацию на все используемые методы стандартной библиотеки, но не всегда она очевидна и, если говорить откровенно, не всегда хватает мотивации читать про "очевидные вещи".

Сами по себе ленивые вычисления - клевая шутка, и статья ни в коем случае не призывает от них отказаться. Однако когда ленивость неочевидна - это может привести к проблемам.

Справедливости ради, проблема с `mapValues` [уже фигурировала на Хабре](https://habr.com/post/333362/) в переводе, но лично у меня та статья очень плохо отложилась в голове, т.к. там было много уже известных/базовых вещей и не до конца было ясно, чем может быть опасно использование этих функций:
> Метод filterKeys обертывает исходную таблицу без копирования каких-либо элементов. В этом нет ничего плохого, однако вы вряд ли ожидаете от filterKeys подобного поведения

То есть ремарка про неожиданное поведение есть, а что при этом можно еще и на грабли немного наступить, видимо, считается маловероятным.

→ Весь код из статьи есть в этом [gist](https://gist.github.com/ov7a/3f9b282f1f3b47e8a98299e20df2ea2f)

Скрин опроса:
![](/assets/images/habr_poll_scaladoc.png)
