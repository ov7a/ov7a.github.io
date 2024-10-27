---
layout: post
title: Опыт использования библиотеки Puniverse Quasar для акторов
tags: [habr, kotlin, quasar, actors]
category: blog
repost: https://habr.com/ru/post/350182/
---
_С появлением котлиновских корутин и маячащим релизом project loom эта статья потеряла свою актуальность_

В прошедшем, 2017 году, был небольшой проект, который почти идеально ложился на идеологию <a href="https://ru.wikipedia.org/wiki/%D0%9C%D0%BE%D0%B4%D0%B5%D0%BB%D1%8C_%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2">акторов</a>, решили поэкспериментировать и попробовать использовать их реализацию от Parallel Universe. От самих акторов особо много не требовалось - знай себе храни состояние да общайся с другими, иногда изменяйся по таймеру и не падай.

Библиотека вроде достаточно зрелая, почти 3 тысячи звезд на <a href="https://github.com/puniverse/quasar">гитхабе</a>, больше 300 форков, пара <a href="https://habrahabr.ru/post/313070/">рекомендаций</a> на <a href="https://habrahabr.ru/company/luxoft/blog/280784/">Хабре</a>… Почему бы и нет? Наш проект стартовал в феврале 2017, писали на Kotlin. 

<img src="/assets/images/habr_quasar.png" />
Казалось бы, что могло пойти не так?

<h2>Вкратце о библиотеке</h2>
→ <a href="http://www.paralleluniverse.co/">Разработчик</a><br>
→ <a href="http://docs.paralleluniverse.co/quasar/">Документация</a><br>
→ <a href="https://github.com/puniverse/quasar">GitHub</a>

Основное предназначение библиотеки - легковесные потоки (fibers), уже поверх которых реализованы Go-подобные каналы, Erlang-подобные акторы, всякие реактивные плюшки и другие подобные вещи "для асинхронного программирования на Java и Kotlin". Разрабатывается с 2013 года.

<h2>Настройка сборки</h2>
Т.к. проект на котлине, сборка будет на gradle. Важный момент: для работы легковесных потоков необходимы манипуляции с Java байт-кодом (instrumentation), которые обычно делают с помощью java-агента. Этого агента quasar любезно предоставляет. На практике это означает, что:

<img src="/assets/images/habr_one_does_not_simply_quasar.jpeg" />

​Для начала нам понадобится добавить конфигурацию quasar:

```gradle
configurations {
    quasar
}
```
Подключим зависимости:

```gradle
dependencies {
    compile("org.jetbrains.kotlin:kotlin-stdlib-jre8:$kotlin_version") // котлин

    compile("co.paralleluniverse:quasar-core:$quasar_version:jdk8") // основные функции quasar
    compile("co.paralleluniverse:quasar-actors:$quasar_version") // акторы
    compile("co.paralleluniverse:quasar-kotlin:$quasar_version") // обертки для котлина
    quasar "co.paralleluniverse:quasar-core:$quasar_version:jdk8" // для java-агента

    //... и другие
}
```
Говорим, что все gradle-таски надо запускать с java-агентом:

```gradle
tasks.withType(JavaForkOptions) {
    //uncomment if there are problems with fibers
    //systemProperty 'co.paralleluniverse.fibers.verifyInstrumentation', 'true'

    jvmArgs "-javaagent:${(++configurations.quasar.iterator())}"
}
```
Cвойство <code>co.paralleluniverse.fibers.verifyInstrumentation</code> отвечает за проверку в рантайме корректности манипуляций с байт-кодом. Разумеется, если эта проверка включена, то все начинает тормозить:)

Для релиза написал еще функцию для генерации bat/sh файлов, которые запускают приложение с java-агентом. Ничего особо интересного, просто создать файлик и прописать туда нужную строку запуска, с нужной версией quasar‘a:

```gradle
def createRunScript(String scriptPath, String type) {
    def file = new File(scriptPath)
    file.createNewFile()
    file.setExecutable(true)
    def preamble = "@echo off"
    if (type == "sh") {
        preamble = "#!/bin/bash"
    }
    def deps = configurations.quasar.files.collect { "-Xbootclasspath/a:\"libs/${it.name}\"" }.join(" ")
    def flags = "-Dco.paralleluniverse.fibers.detectRunawayFibers=false"
    def quasarAgent = configurations.quasar.files.find { it.name.contains("quasar-core") }.name
    file.text = """$preamble
java -classpath "./*.jar" -javaagent:"libs/$quasarAgent" $deps $flags -jar ${project.name}.jar
"""
}
```
И таск release, который создает отдельную папку со всем необходимым:

```gradle
task release(dependsOn: ['build']) {
    group = "Build"
    def targetDir = "$buildDir/release"
    doLast {
        copy {
            from "$buildDir/libs/${project.name}.jar"
            into targetDir
        }
        copy { //копируем все библиотеки quasar, чтобы javaagent мог их подцепить
            from(configurations.quasar.files)
            into "$targetDir/libs"
        } 
        copy { // конфиг по умолчанию, раз уж релиз делаем все равно
            from("src/main/resources/application.yml")
            into targetDir
        }

        //скрипты для запуска
        createRunScript("$targetDir/${project.name}.bat", "bat")  
        createRunScript("$targetDir/${project.name}.sh", "sh")
    }
}
```
Посмотреть подробнее пример можно <a href="https://gist.github.com/ov7a/9e203ba27755d35c0557bb87bee40cd4">в моем gist</a> или <a href="https://github.com/puniverse/quasar-gradle-template/blob/master/build.gradle">в официальном примере</a> для gradle. Теоретически, вроде как существует возможность изменить байт-код на стадии компиляции и не использовать java-агент. Для этого в quasar есть <a href="http://docs.paralleluniverse.co/quasar/#aot">ant-таск</a>. Однако даже с вагоном костылей и изоленты настроить его у меня не удалось.

<h2>Использование акторов</h2>
Перейдем собственно к акторам. В моем понимании основа акторов - это постоянный обмен сообщениями. Однако из коробки Quasar представляет только универсальный <code>co.paralleluniverse.kotlin.Actor</code> с методом <code>receive</code>. Для постоянного обмена пришлось реализовать небольшую прослойку:

```kotlin
abstract class BasicActor : Actor() {

    @Suspendable
    abstract fun onReceive(message: Any): Any?

    @Suspendable
    override fun doRun() {
        while (true) {
            receive { onReceive(it!!) }
        }
    }

    fun <T> reply(incomingMessage: RequestMessage<T>, result: T) {
        RequestReplyHelper.reply(incomingMessage, result)
    }
}
```
Которая по сути только делает вечный цикл приема сообщений.

Кроме того, с переходом на Kotlin 1.1 у библиотеки начались проблемы, которые не решены до сих пор (привожу кусок их кода): 

```kotlin
// TODO Was "(Any) -> Any?" but in 1.1 the compiler would call the base Java method and not even complain about ambiguity! Investigate and possibly report
inline protected fun receive(proc: (Any?) -> Any?) {
    receive(-1, null, proc)
}
```
Из-за этого в нашем <code>BasicActor</code> пришлось сделать обертку для <code>receive</code>. Ну и для понятности был сделан метод <code>reply</code> и extenstion-метод <code>ask</code>:

```kotlin
@Suspendable
fun <T> ActorRef<Any>.ask(message: RequestMessage<T>): T {
    return RequestReplyHelper.call(this, message)
}
```
Обратите внимание, чтобы послать сообщение-вопрос, оно обязательно должно быть унаследовано от <code>RequestMessage</code>. Это немного ограничивает сообщения, которыми можно обмениваться в формате вопрос-ответ.

Очень важна аннотация <code>@Suspendable</code> - при использовании quasar ее надо вешать  на все методы, которые обращаются к другим акторам или легковесным потокам, иначе получите в рантайме исключение <code>SuspendExecution</code>, и толку от "легковесности" не будет. С точки зрения разработчиков библиотеки - очевидно, что это нужно для java-агента, но с точки зрения программиста-пользователя - это неудобно (существует возможность сделать это <a href="http://docs.paralleluniverse.co/quasar/#auto-detection">автоматически</a>, но будет это далеко не бесплатно).

Дальше, реализация актора сводится к переопределению метода <code>onReceive</code>, что достаточно просто можно сделать с помощью <code>when</code>, делая что-то в зависимости от типа сообщения:

```kotlin
override fun onReceive(message: Any) = when (message) {
    is SomeMessage -> {
        // Do stuff

       val someotherActor = ActorRegistry.getActor("other actor") 
       someotherActor.send(replyOrSomeCommand)        
    }

    is SomeOtherMessage -> {
        process(message.parameter) // работает smart-cast

        val replyFromGuru = guruActor.ask(Question("Does 42 equals 7*6?")) 
        doSomething()
    }

    else -> throw UnknownMessageTypeException(message)
}
```
Для того, чтобы получить ссылку на актор, надо обратиться к статическому методу <code>ActorRegistry.getActor</code>, который по  строковому идентификатору вернет ссылку на актор.

Осталось только акторы запустить. Для этого надо актор сначала создать, потом зарегистрировать, и наконец запустить:

```kotlin
val myActor = MySuperDuperActor()
val actorRef = spawn(register(MY_ACTOR_ID, myActor))<
```
(Почему нельзя было сразу это одним методом сделать - неясно).

<h2>Некоторые проблемы</h2>
Как вы думаете, что произойдет, если актор упадет с исключением?

А ничего. Ну упал актор. Теперь он сообщения принимать не будет, ну и что. Великолепное поведение по умолчанию!

В связи с этим пришлось реализовать актор-наблюдатель, который следит за состоянием акторов и роняет все приложение, если что-то пошло не так (к отказоустойчивости требования не предъявлялись, так что могли себе позволить):

```kotlin
class WatcherActor : BasicActor(), ILogging by Logging<WatcherActor>() {
    override fun handleLifecycleMessage(lcm: LifecycleMessage): Any? {
        return onReceive(lcm)
    }

    override fun onReceive(message: Any): Any? = when (message) {
        is ExitMessage -> {
            log.fatal("Actor ${message.actor.name} got an unhandled exception. Terminating the app. Reason: ", message.getCause())
            exit(-2)
        }
        else -> {
            log.fatal("Got unknown message for WatcherActor: $message. Terminating the app")
            exit(-1)
        }
    }

}
```
Но для этого приходится запускать акторы с привязкой к наблюдателю:

```kotlin
@Suspendable
fun registerAndWatch(actorId: String, actorObject: Actor<*, *>): ActorRef<*> {
    val ref = spawn(register(actorId, actorObject))
    watcherActor.link(ref)
    return ref
}
```
Вообще, по впечатлениям, многие моменты были неудобны или неочевидны. Возможно, "мы просто не умеем готовить" Quasar, но после Akka некоторые моменты выглядят диковато. Например, метод для реализации запроса по типу ask от Akka, который где-то закопан в утилитах и еще требует связывать типы сообщения-вопроса и сообщения-ответа (хотя с другой стороны, это неплохая фича, которая уменьшает число потенциальных ошибок).

Еще одна серьезная проблема возникла с завершением актора. Какие стандартные методы для этого есть? Может быть destroy, unspawn или unregister? А вот и нет. Только костыли:

```kotlin
fun <T : Actor<Any?, Any?>> T.finish() {
    this.ref().send(ExitMessage(this.ref(), null))
    this.unregister()
}
```
Есть конечно <code>ActorRegistry.clear()</code>, который удаляет ВСЕ акторы, но если залезть к нему в кишочки, то можно увидеть следующее:

```java
public static void clear() {
    if (!Debug.isUnitTest())
        throw new IllegalStateException("Must only be called in unit tests");
    if (registry instanceof LocalActorRegistry)
        ((LocalActorRegistry) registry).clear();
    else
        throw new UnsupportedOperationException();
}
```
Ага, только в юнит-тестах можно вызывать. А как же они это определяют?

```java
boolean isUnitTest = false;
StackTraceElement[] stack = Thread.currentThread().getStackTrace();
for (StackTraceElement ste : stack) {
    if (ste.getClassName().startsWith("org.junit")
            || ste.getClassName().startsWith("junit.framework")
            || ste.getClassName().contains("JUnitTestClassExecuter")) {
        isUnitTest = true;
        break;
    }
}
unitTest = isUnitTest;
```
Т.е. если вы вдруг используете не junit - до свидания. 

Погодите-погодите, вот же метод <code>ActorRegistry.shutdown()</code>, он то наверняка вызвает у каждого актора закрытие! Смотрим реализацию абстрактного метода в <code>LocalActorRegistry</code>:

```java
    @Override
    public void shutdown() {
    }
```
Еще один момент, библиотека может таинственно падать с каким-нибудь NPE без видимых на то причин/объяснений: 

<a href="https://github.com/puniverse/quasar/issues/182">https://github.com/puniverse/quasar/issues/182</a>

Кроме того, если вы используете сторонние библиотеки, с ними могут возникнуть проблемы. Например, в одной из зависимостей у нас была библиотека, которая общалась с железом (не очень качественная), в которой был <code>Thread.sleep()</code>. Quasar‘у это очень не понравилось, и он плевался логами с исключениями: мол, <code>Thread.sleep()</code> блокирует поток и это плохо скажется на производительности (см. подробнее <a href="http://docs.paralleluniverse.co/quasar/#runaway-fibers">здесь</a>). При этом конкретных рецептов, как это исправить (кроме как тупо отключить логирование таких ошибок системным флагом) или хотя бы "понять и простить" только для сторонних библиотек, Parallel Universe не дают.

Ну и напоследок, поддержка Kotlin оставляет желать лучшего - например проверка java-agent будет ругаться на некоторые его методы (хотя само приложение при этом может продолжать работать без видимых проблем):

<a href="https://github.com/puniverse/quasar/issues/238">https://github.com/puniverse/quasar/issues/238</a>
<a href="https://github.com/puniverse/quasar/issues/288">https://github.com/puniverse/quasar/issues/288</a>

В целом отлаживать работу приходилось по логам - и это было довольно грустно.

<h2>Заключение</h2>
В целом впечатления от библиотеки нейтральны. По впечатлениям, акторы в ней реализованы на уровне "демонстрации идеи" - вроде работает, но есть проблемы, которые обычно всплывают при первом боевом применении. Хотя потенциал у библиотеки <s>есть</s> был.

Нам еще "очень повезло": внимательный читатель мог заметить, что последний релиз был в декабре 2016 (по документации) или в июле 2017 (по гитхабу). А в бложике компании последняя запись вообще в июле 2016 (с интригующим заголовком <a href="http://blog.paralleluniverse.co/2016/07/23/correctness-and-complexity/">Why Writing Correct Software Is Hard</a>). В общем, библиотека скорее мертва, чем жива, поэтому в продакшене ее лучше не использовать. 

<b>P. S.</b> Тут еще внимательный читатель может спросить - а что же тогда Akka не использовали? В принципе, с ней никаких криминальных проблем не было (хотя по сути получалась цепочка Kotlin-Java-Scala), но т.к. проект был некритичный, решили попробовать "родное" решение.

Скрин опроса:
![](/assets/images/habr_poll_quasar.png)
