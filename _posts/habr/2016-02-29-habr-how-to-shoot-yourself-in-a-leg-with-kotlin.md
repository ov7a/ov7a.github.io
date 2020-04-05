---
layout: post
title: Как себе выстрелить в ногу в Kotlin
tags: [habr, kotlin, scala, ноги, стрельба]
hidden: true
repost: https://habr.com/ru/post/278169/
---
Совсем недавно вышел <a href="http://blog.jetbrains.com/kotlin/2016/02/kotlin-1-0-released-pragmatic-language-for-jvm-and-android/">релиз</a> Kotlin, а его команда разработчиков предлагала <a href="https://habrahabr.ru/company/JetBrains/blog/277573/">задавать вопросы</a> про язык. Он сейчас на слуху и, возможно, многим хочется его попробовать. 
Пару недель назад тимлид сделал для компании презентацию о том, что в Котлине хорошо. Одним из самых интересных вопросов был "А как в Котлине выстрелить себе в ногу?" Так получилось, что ответил на этот вопрос я.

**Disclaimer**:
Не стоит воспринимать эту статью как "Kotlin - отстой". Хотя я отношусь скорее к категории тех, кому и со Scala хорошо, я считаю, что язык неплохой. 
Все пункты спорные, но раз в год и палка стреляет. Когда-то вы себе прострелите заодно и башку, а когда-то у вас получится выстрелить только в полночь полнолуния, если вы предварительно совершите черный ритуал создания плохого кода.

Наша команда недавно закончила большой проект на Scala, сейчас делаем проект помельче на Kotlin, поэтому в спойлерах будет сравнение со Scala. Я буду считать, что Nullable в Kotlin - это эквивалент Option, хотя это совсем не так, но, скорее всего, большинство из тех, кто работал с Option, будут вместо него использовать Nullable.

# 1. Пост-инкремент и преинкремент как выражения 
Цитирую вопрошавшего: "Фу, это ж баян, скучно". Столько копий сломано, миллион вопросов на собеседованиях C++... Если есть привычка, то можно было его оставить инструкцией (statement'ом). Справедливости ради, другие операторы, вроде +=, являются инструкциями. 
<a href="https://habrahabr.ru/company/JetBrains/blog/277573/#comment_8784811">Цитирую</a> одного из разработчиков, @abreslav:
<blockquote>
Смотрели на юзкейсы, увидели, что поломается, решили оставить.

Замечу, что у нас тут не С++, и на собеседовании про инкремент спросить особо нечего. Разве что разницу между префиксным и постфиксным.</blockquote>На нет и суда нет. Разумеется, в здравом уме никто так делать не будет, но случайно - может быть.
```kotlin
    var i = 5
    i = i++ + i++
    println(i)
```
{% include spoiler.html title="Никакого undefined behaviour, результат, очевидно, 12" content="11" %}
<br>

```kotlin
    var a = 5
    a = ++a + ++a
    println(a)
```
{% include spoiler.html title="Тут все проще, конечно, 14" content="13" %}
<br>
{% capture spoiler_content %}
```kotlin
    var b = 5
    b = ++b + b++
    println(b)
```
{% include spoiler.html title="Банальная логика говорит, что ответ должен быть между 11 и 13" content="да, 12" %}
<br>

```kotlin
    var c = 5
    c = c++ + ++c
    println(c)
```
{% include spoiler.html title="От перестановки мест слагаемых сумма не меняется" content="разумеется, 12" %}
<br>

```kotlin
    var d = 5
    d = d + d++ + ++d + ++d
    println(d)

    var e = 5
    e = ++e + ++e + e++ + e
    println(e)
```
{% capture inner_spoiler_content %}
Разумеется:
```
25
28
```
{% endcapture %}
{% include spoiler.html title="От перестановки мест слагаемых сумма не меняется!" content=inner_spoiler_content%}
{% endcapture %}
{% include spoiler.html title="Больше примеров" content=spoiler_content %}
<br>
{% include spoiler.html title="Чё там в Scala?" content="Ничего интересного, в Scala инкрементов нет. Компилятор скажет, что нет метода ++ для Int. Но если очень захотеть, его, конечно, можно определить." %}

# 2. Одобренный способ
```kotlin
    val foo: Int? = null
    val bar = foo!! + 5
```
{% capture spoiler_content %}
```
Exception in thread "main" kotlin.KotlinNullPointerException
```
{% endcapture %}
{% include spoiler.html title="Что хотели, то и получили" content=spoiler_content %}
В документации говорится, что так делать стоит только если вы очень хотите получить NullPointerException. Это хороший метод выстрелить себе в ногу: <tt>!!</tt> режет глаз и при первом взгляде на код все понятно. Разумеется, использование <tt>!!</tt> предполагается тогда, когда до этого вы проверили значение на null и smart cast по какой-нибудь причине не сработал. Или когда вы почему-то уверены, что там не может быть null.

{% capture spoiler_content %}
 ```scala 
    val foo: Option[Int] = None
    val bar = foo.get + 5
```
{% capture inner_spoiler_content %}
```
Exception in thread "main" java.util.NoSuchElementException: None.get
```
{% endcapture %}
{% include spoiler.html title="Что хотели, то и получили" content=inner_spoiler_content %}
{% endcapture %}
{% include spoiler.html title="Чё там в Scala?" content=spoiler_content %}

# 3. Переопределение invoke()
Начнем с простого: что делает этот кусок кода и какой тип у a? 
```kotlin
    class A(){...}
    val a = A()
```
{% include spoiler.html title="На глупый вопрос - глупый ответ" content="Правильно, создает новый объект типа A, вызывая конструктор по умолчанию." %}
<br>
А здесь что будет?

```kotlin
    class В private constructor(){...}
    val b = B()
```
{% capture spoiler_content %}
А вот и нет!  

 ```kotlin 
class B private constructor(){
    var param = 6

    constructor(a: Int): this(){
        param = a
    }

    companion object{
        operator fun invoke() = B(7)
    }
}
```
Для класса может быть определена фабрика. А если бы она была в классе A, то там все равно вызывался бы конструктор.
{% endcapture %}
{% include spoiler.html title="Ну, наверно, ошибка компиляции будет..." content=spoiler_content %}
<br>
Теперь вы ко всему готовы:

```kotlin
    class С private constructor(){...}
    val c = C()
```
{% capture spoiler_content %}
Конечно же нет!
```kotlin
class C private constructor(){
   ...
    companion object{
        operator fun invoke() = A(9)
    }
}
```
У переменной c будет тип A. Заметьте, что A и С не связаны родственными узами.
{% endcapture %}
{% include spoiler.html title="Тут создается объект класса С через фабрику, определенную в объекте-компаньоне класса С." content=spoiler_content %} 
{% capture spoiler_content %}
```kotlin
class A(){
    var param = 5

    constructor(a: Int): this(){
        param = a
    }

    companion object{
        operator fun invoke()= A(10)
    }
}

class B private constructor(){
    var param = 6

    constructor(a: Int): this(){
        param = a
    }

    companion object{
        operator fun invoke() = B(7)
    }
}

class C private constructor(){
    var param = 8

    constructor(a: Int): this(){
        param = a
    }

    companion object{
        operator fun invoke() = A(9)
    }
}

class D(){
    var param = 10

    private constructor(a: Int): this(){
        param = a
    }

    companion object{
        operator fun invoke(a: Int = 25) = D(a)
    }
}

fun main(args: Array<String>) {
    val a = A()
    val b = B()
    val c = C()
    val d = D()
    println("${a.javaClass}, ${a.param}")
    println("${b.javaClass}, ${b.param}")
    println("${c.javaClass}, ${c.param}")
    println("${d.javaClass}, ${d.param}")
}
```
Результат выполнения:
```
class A, 5
class B, 7
class A, 9
class D, 10
```
{% endcapture %}
{% include spoiler.html title="Полный код" content=spoiler_content %}

К сожалению, придумать короткий пример, где у вас реально все поломается, я не смог. Но пофантазировать немного можно. Если вы вернете левый класс, как в примере с классом C, то скорее всего, компилятор вас остановит. Но если вы никуда не передаете объект, то можно сымитировать утиную типизацию, как в примере. Ничего криминального, но человек, читающий код, может сойти с ума и застрелиться, если у него не будет исходника класса.
Если у вас есть наследование и функции для работы с базовым классом (Animal), а invoke() от одного наследника (Dog) вернет вам другого наследника (Duck), то тогда при проверке типов (Animal as Dog) вы можете накрякать себе беду.

{% capture spoiler_content %}
В Scala проще - есть new, который всегда вызывает конструктор. Если не будет `new`, то всегда вызывается метод `apply` у компаньона (который тоже может вернуть левый тип). Разумеется, если что-то вам не доступно из-за `private`, то компилятор ругнется. Все то же самое, только очевиднее. 
{% endcapture %}
{% include spoiler.html title="Чё там в Scala?" content=spoiler_content %}

# 4. lateinit

```kotlin
class SlowPoke(){
    lateinit var value: String

    fun test(){
        if (value == null){ //компилятор здесь говорит, что проверка не нужна (и правильно делает)
            println("null")
            return
        }
        if (value == "ololo")
            println("ololo!")
        else
            println("alala!")
    }
}
SlowPoke().test()
```
{% capture spoiler_content %}
```
Exception in thread "main" kotlin.UninitializedPropertyAccessException: lateinit property value has not been initialized
```
{% endcapture %}
{% include spoiler.html title="Результат предсказуем" content=spoiler_content %}

{% capture spoiler_content %}
```kotlin
class SlowBro(){
    val value: String? = null

    fun test(){
        if (value == null) {
            println("null")
            return
        }
        if (value == "ololo")
            println("ololo!")
        else
            println("alala!")
    }
}
SlowBro().test()
```
{% capture spoiler_content_inner %}
```
null
```
{% endcapture %}
{% include spoiler.html title="Результат" content=spoiler_content_inner%}
{% endcapture %}
{% include spoiler.html title="А как правильно?" content=spoiler_content %}

Я бы сказал, что это тоже одобренный способ, но при чтении кода это неочевидно, в отличие от <tt>!!</tt>. В документации немного завуалированно говорится, что, мол, проверять не надо, если что, мы кинем тебе Exception. По идее, этот модификатор используется тогда, когда вы точно уверены, что поле будет инициализированно кем-то другим. То есть никогда. По моему опыту, все поля, которые были `lateinit`, рано или поздно стали Nullable. Неплохо это поле вписалось в контроллер JavaFX приложения, где GUI грузится из FXML, но даже это "железобетонное" решение было свергнуто после того, как появился альтернативный вариант без пары кнопок. Один раз так получилось, что в SceneBuilder изменил `fx:id`, а в коде забыл. В первые дни кодинга на Kotlin немного взбесило, что нельзя сделать `lateinit` Int. Я могу придумать, почему так сделали, но сомневаюсь, что совсем нет способа обойти эти причины (читай: сделать костыль).

{% capture spoiler_content %}
А там аналога `lateinit` как такового и нет. По крайней мере, я не обнаружил.
{% endcapture %}
{% include spoiler.html title="Чё там в Scala?" content=spoiler_content %}

# 5. Конструктор

```kotlin
class IAmInHurry(){
    val param = initSecondParam()
    /*tons of code*/
    val twentySecondParam = 10
    /*tons of code*/
    fun initSecondParam(): Int{
        println("Initializing by default with $twentySecondParam")
        return twentySecondParam
    }

}
class IAmInHurryWithStrings(){
    val param = initSecondParam()
    /*tons of code*/
    val twentySecondParam = "Default value of param"
    /*tons of code*/
    fun initSecondParam(): String{
        println("Initializing by default with $twentySecondParam")
        return twentySecondParam
    }
}
fun main(args: Array<String>){
    IAmInHurry()
    IAmInHurryWithStrings()
}
```
{% capture spoiler_content %}
```
Initializing by default with 0
Initializing by default with null
```
{% endcapture %}
{% include spoiler.html title="Результат" content=spoiler_content%}
Все просто - к полю идет обращение до того, как оно было инициализировано. Видимо, тут стоит немного доработать компилятор. По идее, если вы пишете код хорошо, такая проблема у вас не должна возникнуть, но всякое бывает, не с потолка же я взял этот пример (коллега себе так выстрелил в ногу, случайно через цепочку методов в редко срабатывающем коде вызвал поле, которое было не инициализировано).

{% capture spoiler_content %}
Все то же самое.
```scala
object Initializer extends App{
  class IAmInHurry(){
    val param = initSecondParam()
    /*tons of code*/
    val twentySecondParam = 10
    /*tons of code*/
    def initSecondParam(): Int = {
      println(s"Initializing by default with $twentySecondParam")
      twentySecondParam
    }

  }

  class IAmInHurryWithStrings(){
    val param = initSecondParam()
    /*tons of code*/
    val twentySecondParam = "Default value of param"
    /*tons of code*/
    def initSecondParam(): String = {
      println(s"Initializing by default with $twentySecondParam")
      twentySecondParam
    }

  }

  override def main(args: Array[String]){
    new IAmInHurry()
    new IAmInHurryWithStrings()
  }
}
```
{% capture spoiler_content_inner %}
```
Initializing by default with 0
Initializing by default with null
```
{% endcapture %}
{% include spoiler.html title="Результат" content=spoiler_content_inner %}
{% endcapture %}
{% include spoiler.html title="Чё там в Scala?" content=spoiler_content %}

# 6. Взаимодействие с Java
Для выстрела тут простор достаточно большой. Очевидное решение - считать все, что пришло из Java, Nullable. Но тут есть долгая и поучительная <a href=" http://blog.jetbrains.com/kotlin/2015/04/upcoming-change-more-null-safety-for-java/">история</a>. Как я понял, она связана в основном с шаблонами, наследованием, и цепочкой Java-Kotlin-Java. И при таких сценариях приходилось делать много костылей, чтобы заработало. Поэтому решили от идеи "все Nullable" отказаться. 
Но вроде как один из основных сценариев — свой код пишем на Kotlin, библиотели берем Java (как видится мне, простому крестьянину-кодеру). И при таком раскладе, лучше безопасность в большей части кода и явные костыли в небольшой части кода, которые видно, чем "красиво и удобно" + внезапные грабли в рантайме (или яма с кольями, как повезет). Но у разработчиков другое <a href="https://habrahabr.ru/company/JetBrains/blog/277573/#comment_8784731">мнение</a>:
<blockquote>Одна из основных причин была в том, что писать на таком языке было неудобно, а читать его — неприятно. Повсюду вопросительные и восклицательные знаки, которые не очень-то помогают из-за того, что расставляются в основном, чтобы удовлетворить компилятор, а не чтобы корректно обработать случаи, когда выражение вычисляется в null. Особенно больно в случае дженериков: например, Map<String?, String?>?.
</blockquote>
Сделаем небольшой класс на Java:

```java
public class JavaCopy {
    private String a = null;

    public JavaCopy(){};

    public JavaCopy(String s){
        a = s;
    }

    public String get(){
        return a;
    }
}
```
И попробуем его вызвать из Kotlin:

```kotlin
    fun printString(s: String) {
        println(s)
    }

    val j1 = JavaCopy()
    val j1Got = j1.get()
    printString(j1Got)
```
{% capture spoiler_content %}
```
Exception in thread "main" java.lang.IllegalStateException: j1Got must not be null
```
{% endcapture %}
{% include spoiler.html title="Результат" content=spoiler_content %}

Тип у j1 - `String!` и исключение мы получим только тогда, когда вызовем `printString`. Ок, давайте явно зададим тип:

```kotlin
    val j2 = JavaCopy("Test")
    val j3 = JavaCopy(null)

    val j2Got: String = j2.get()
    val j3Got: String = j3.get()

    printString(j2Got)
    printString(j3Got)
```
{% capture spoiler_content %}
```
Exception in thread "main" java.lang.IllegalStateException: j3.get() must not be null 
```
{% endcapture %}
{% include spoiler.html title="Результат" content=spoiler_content %}

Все логично. Когда мы явно указываем, что нам нужен NotNullable, тогда и ловим исключение. Казалось бы, указывай у всех переменных Nullable, и все будет хорошо. Но если делать так:
```kotlin
kotlinprintString(j2.get())
```
то ошибку вы можете обнаружить нескоро.

{% capture spoiler_content %}
Никаких гарантий, NPE словить можно элементарно. Решение - оборачивать все в `Option`, у которого, напомню, есть хорошее свойство, что `Option(null) = None`. С другой стороны, тут нет иллюзий, что java interop безопасен.
{% endcapture %}
{% include spoiler.html title="Чё там в Scala?" content=spoiler_content %}

# 7. infix нотация и лямбды
Сделаем цепочку из методов и вызовем ее:

```kotlin
fun<R> first(func: () -> R): R{
    println("calling first")
    return func()
}

infix fun<R, T> R.second(func: (R) -> T): T{
    println("calling second")
    return func(this)
}

first {
    println("calling first body")
}
second {
    println("calling second body")
}
```
{% capture spoiler_content %}
```
calling first
calling first body
Oops!
calling second body
```
{% endcapture %}
{% include spoiler.html title="Результат" content=spoiler_content %}

Подождите-ка... тут какая-то подстава! И правда, "забыл" один метод вставить:
```kotlin
fun<T> second(func: () -> T): T{
    println("Oops!")
    return func()
}
``` 
И чтобы заработало "как надо", нужно было написать так:

```kotlin
first {
    println("calling first body")
} second {
    println("calling second body")
}
```

{% capture spoiler_content %}
```
calling first
calling first body
calling second
calling second body
```
{% endcapture %}
{% include spoiler.html title="Результат" content=spoiler_content %}
Всего один перенос строки, который легко при переформатировании удалить/добавить переключает поведение. Основано на реальных событиях: была цепочка методов "сделай в background" и "потом сделай в ui треде". И был метод "сделай в ui" с таким же именем. 

{% capture spoiler_content %}
Синтаксис немного отличается, поэтому так просто тут себе не выстрелишь:

```scala
object Infix extends App{
  def first[R](func: () => R): R = {
    println("calling first")
    func()
  }

  implicit class Second[R](val value: R) extends AnyVal{
    def second[T](func: (R) => T): T = {
      println("calling second")
      func(value)
    }
  }

  def second[T](func: () => T): T = {
    println("Oops!")
    func()
  }

  override def main(args: Array[String]) {
    first { () =>
      println("calling first body")
    } second { () => //<--------type mismach
      println("calling second body")
    }
  }
}
```
Зато, пытаясь подогнать скаловский код хотя бы для неочевидности засчет implicit/underscore, я взорвал все вокруг.
{% capture spoiler_inner_content %}
```scala
object Infix2 extends App{
  def first(func: (Unit) => Unit): Unit = {
    println("calling first")
    func()
  }

  implicit class Second(val value: Unit) extends AnyVal{
    def second(func: (Unit) => Unit): Unit = {
      println("calling second")
      func(value)
    }
  }

  def second(func: (Unit) => Unit): Unit = {
    println("Oops!")
    func()
  }

  override def main(args: Array[String]) {
    first { _ =>
      println("calling first body")
    } second { _ =>
      println("calling second body")
    }
  }
}
```
И результат:
```
Exception in thread "main" java.lang.VerifyError: Operand stack underflow
Exception Details:
  Location:
    Infix2$Second$.equals$extension(Lscala/runtime/BoxedUnit;Ljava/lang/Object;)Z @40: pop
  Reason:
    Attempt to pop empty stack.
  Current Frame:
    bci: @40
    flags: { }
    locals: { 'Infix2$Second$', 'scala/runtime/BoxedUnit', 'java/lang/Object', 'java/lang/Object', integer }
    stack: { }
  Bytecode:
    0000000: 2c4e 2dc1 0033 9900 0904 3604 a700 0603
    0000010: 3604 1504 9900 4d2c c700 0901 5701 a700
    0000020: 102c c000 33b6 0036 57bb 0038 59bf 3a05
    0000030: b200 1f57 b200 1fb2 001f 57b2 001f 3a06
    0000040: 59c7 000c 5719 06c6 000e a700 0f19 06b6
    0000050: 003c 9900 0704 a700 0403 9900 0704 a700
    0000060: 0403 ac                                
  Stackmap Table:
    append_frame(@15,Object[#4])
    append_frame(@18,Integer)
    same_frame(@33)
    same_locals_1_stack_item_frame(@46,Null)
    full_frame(@77,{Object[#2],Object[#27],Object[#4],Object[#4],Integer,Null,Object[#27]},{Object[#27]})
    same_frame(@85)
    same_frame(@89)
    same_locals_1_stack_item_frame(@90,Integer)
    chop_frame(@97,2)
    same_locals_1_stack_item_frame(@98,Integer)

    at Infix2$.main(Infix.scala)
```
{% endcapture %}
{% include spoiler.html title="Осторожно! Кровь, кишки и расчлененка..." content=spoiler_inner_content %}
{% endcapture %}
{% include spoiler.html title="Чё там в Scala?" content=spoiler_content %}

# 8. Перегрузка методов и it
Это, скорее, метод подгадить другим. Представьте, что вы пишете библиотеку, и в ней есть функция
```kotlin
fun applier(x: String, func: (String) -> Unit){
    func(x)
}
```
Разумеется, народ ее использует довольно прозрачным способом:
```kotlin
    applier ("arg") {
        println(it)
    }
    applier ("no arg") { 
        println("ololo")
    }
```
Код компилируется, работает, все довольны. А потом вы добавляете метод
```kotlin
fun applier(x: String, func: () -> Unit){
    println("not applying $x")
    func()
}
```
И чтобы компилятор не ругался, пользователям придется везде отказаться от `it` (читай: переписать кучу кода):
```kotlin
    applier ("arg") { it -> //FIXED
        println(it)
    }
    applier ("no arg") { -> //yes, explicit!
        println("ololo")
    }
```
Хотя, теоретически, компилятор мог бы и угадать, что если есть `it`, то это лямбда с 1 входным аргументом. Думаю, что с развитием языка и компилятор поумнеет, и этот пункт — временный.

{% capture spoiler_content %}
Без аргументов придется явно указать, что это лямбда. А при добавлении нового метода поведение не изменится.
```scala
object Its extends App{
  def applier(x: String, func: (String) => Unit){
    func(x)
  }

  def applier(x: String, func: () => Unit){
    println("not applying $x")
    func()
  }

  override def main(args: Array[String]) {
    applier("arg", println(_))
    applier("no arg", _ => println("ololo"))
  }
}
```
{% endcapture %}
{% include spoiler.html title="Чё там в Scala?" content=spoiler_content %}

# 9. Почему не стоит думать о Nullable как об Option

Пусть у нас есть обертка для кэша:
```kotlin
class Cache<T>(){
    val elements: MutableMap<String, T> = HashMap()

    fun put(key: String, elem: T) = elements.put(key, elem)

    fun get(key: String) = elements[key]
}
```
И простой сценарий использования: 
```kotlin
    val cache = Cache<String>()
    cache.put("foo", "bar")

    fun getter(key: String) {
        cache.get(key)?.let {
            println("Got $key from cache: $it")
        } ?: println("$key is not in cache!")
    }

    getter("foo")
    getter("baz")
```
{% capture spoiler_content %}
```
Got foo from cache: bar
baz is not in cache!
```
{% endcapture %}
{% include spoiler.html title="Результат довольно предсказуем" content=spoiler_content %}
<br>
Но если мы вдруг захотим к кэше хранить Nullable...
```kotlin
    val cache = Cache<String?>()
    cache.put("foo", "bar")

    fun getter(key: String) {
        cache.get(key)?.let {
            println("Got $key from cache: $it")
        } ?: println("$key is not in cache!")
    }

    getter("foo")
    getter("baz")

    cache.put("IAmNull", null)
    getter("IAmNull")
```
{% capture spoiler_content %}
```
Got foo from cache: bar
baz is not in cache!
IAmNull is not in cache!
```
{% endcapture %}
{% include spoiler.html title="То получится не очень хорошо" content=spoiler_content %}
Зачем хранить `null`? Например, чтобы показать, что результат не вычислим. Конечно, тут было бы правильнее использовать `Option` или `Either`, но, к сожалению, ни того, ни другого в стандартной библиотеке нет (но есть, например, в <a href="https://github.com/MarioAriasC/funKTionale/wiki">funKTionale</a>). Более того, как раз при реализации `Either`, я наступил на грабли этого пункта и предыдущего. Решить эту проблему с "двойным Nullable" можно, например, возвратом `Pair` или специального `data class`.

{% capture spoiler_content %}
Никто не запретит сделать Option от Option. Надеюсь, понятно, что так все будет хорошо. Да и с `null` тоже:
```scala
object doubleNull extends App{
  class Cache[T]{
    val elements =  mutable.Map.empty[String, T]

    def put(key: String, elem: T) = elements.put(key, elem)

    def get(key: String) = elements.get(key)
  }

  override def main(args: Array[String]) {
    val cache = new Cache[String]()
    cache.put("foo", "bar")

    def getter(key: String) {
      cache.get(key) match {
        case Some(value) => println(s"Got $key from cache: $value")
        case None => println(s"$key is not in cache!")
      }
    }

    getter("foo")
    getter("baz")

    cache.put("IAmNull", null)
    getter("IAmNull")
  }
```
{% capture spoiler_inner_content %}
```
Got foo from cache: bar
baz is not in cache!
Got IAmNull from cache: null
```
{% endcapture %}
{% include spoiler.html title="Все хорошо" content=spoiler_inner_content %}
{% endcapture %}
{% include spoiler.html title="Чё там в Scala?" content=spoiler_content %}

# 10. Объявление методов
Бонус для тех, кто раньше писал на Scala. Спонсор данного пункта - @lgorSL.
<a href="https://habrahabr.ru/post/277479/#comment_8779645">Цитирую:</a>
<blockquote>
...
<br>
Или, например, синтаксис объявления метода:

В scala: `def methodName(...) = {...}`

В kotlin возможны два варианта — как в scala (со знаком `=`) и как в java (без него), но эти два способа объявления неэквивалентны друг другу и работают немного по-разному, я однажды кучу времени потратил на поиск такой "особенности" в коде.
<br>
....
</blockquote>
<blockquote>
Я подразумевал следующее:

```kotlin
fun test(){ println("it works") } 
fun test2() = println("it works too")
fun test3() = {println("surprise!")}
```

Чтобы вывести "surprise", придётся написать `test3()()`. Вариант вызова `test3()` тоже нормально компилируется, только сработает не так, как ожидалось — добавление "лишних" скобочек кардинально меняет логику программы.

Из-за этих граблей переход со скалы на котлин оказался немного болезненным — иногда "по привычке" в объявлении какого-нибудь метода пишу знак равенства, а потом приходится искать ошибки.</blockquote>

# Заключение
На этом список наверняка не исчерпывается, поэтому делитесь в комментариях, как вы шли дорогой приключений, но потом что-то пошло не так... 
У языка много положительных черт, о которых вы можете прочитать на <a href="http://kotlinlang.org/">официальном сайте</a>, в <a href="https://habrahabr.ru/post/277479/">статьях</a> <a href="https://habrahabr.ru/post/268463/">на</a> <a href="https://habrahabr.ru/post/274997/">хабре</a> и еще много где. Но лично я не согласен с некоторыми архитектурными решениями (классы final by default, java interop) и иногда чувствуется, что языку нехватает единообразия, консистентности. Кроме примера с `lateinit` Int приведу еще два. Внутри блоков `let` используем `it`, внутри `with` - `this`, а внутри `run`, <a href="http://beust.com/weblog/2015/10/30/exploring-the-kotlin-standard-library/">который является комбинацией `let` и `this`</a> что надо использовать? А у класса `String!` можно вызвать методы `isBlank()`, `isNotBlank()`, `isNullOrBlank()`, а "дополняющего" метода вроде <code>isNotNullOrBlank</code> нет:( После Scala нехватает некоторых вещей - `Option`, `Either`, matching, каррирования. Но в целом язык оставляет приятное впечатление, надеюсь, что он продолжит достойно развиваться.

P.S. Хабровская подсветка Kotlin хромает, надеюсь, что администрация @habrahabr это когда-нибудь поправит...

# UPD: Выстрелы от комментаторов (буду обновлять)
<a href="https://habrahabr.ru/post/278169/#comment_8786835">Неочевидный приоритет оператора elvis</a>. Автор -  @senia.

# UPD2 
Обратите еще внимание на статью <a href="https://habrahabr.ru/post/308312/">Kotlin: без Best Practices и жизнь не та</a>.
В <a href="https://habrahabr.ru/post/308312/#comment_9766292">комментариях</a> там есть еще один шикарный выстрел от @Artem_zin: возможность переопределить `get()` у `val` и возвращать значения динамически.

# UPD3
Еще некоторые новички могут подумать, что операторы <code>and</code> и <code>or</code> для булевых переменных - это такой сахар для "нечитаемых" <code>&&</code> и <code>||</code>. Однако это не так: хоть результат вычислений будет тем же, но "старые" операторы вычисляются лениво. Поэтому если вы вдруг напишете так:
```kotlin
if ((i >= 3) and (someArray[i-3] > 0)){
    //do something
}
```
то получите исключение при <code>i<3</code>.

Скрин опроса:
![](/assets/images/habr_poll_shooting_with_kotlin.png)
