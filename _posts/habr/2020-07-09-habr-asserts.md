---
layout: post
tags: [habr, kotlin, asserts]
title: Выбор библиотеки ассертов для проекта на Kotlin
hidden: true
repost: https://habr.com/ru/post/510206/
---

В одном из старых проектов в кучу были навалены ассерты из JUnit, kotlin.test и AssertJ. Это было не единственной его проблемой: его вообще писали как письмо Дяди Федора, а времени остановиться и привести к единому виду не было. И вот это время пришло.

В статье будет мини-исследование про то, какие ассерты лучше по субъективным критериям. Хотел сначала сделать что-то простое: накидать набор тестов, чтобы быстренько копипастом клепать варианты. Потом выделил общие тестовые данные, некоторые проверки автоматизировал, и как поехало все... В результате получился небольшой розеттский камень и эта статья может пригодится вам для того, чтобы выбрать библиотеку ассертов, которая подойдет под ваши реалии.

Сразу оговорюсь, что в статье не будет сравнения фреймворков для тестирования, подходов к тестированию и каких-то хитрых подходов к проверке данных. Речь будет идти про несложные ассерты.

![](/assets/images/habr-asserts.png)

Если вам лень читать занудные рассуждения, историю моих мытарств и прочие подробности, то можете перейти сразу к [результатам сравнения](#rezultaty).

## Немного бэкграунда

Долгое время моим основным ЯП была Scala, а фреймворком для тестов — ScalaTest. Не то чтобы это был лучший фреймворк, но я как-то к нему привык, поэтому мое мнение может быть искажено из-за этого.

Когда на старой работе [начали писать на Kotlin](https://habr.com/ru/company/inforion/blog/278169/), через какое-то время даже делали свою библиотечку, имитирующую поведение скаловских матчеров, но сейчас она имеет мало смысла после появления Kotest (хотя в ней лучше было реализовано сравнение сложных структур, с рекурсивным выводом более подробного сообщения).

## Требования

Сразу оговорюсь, требования весьма субъективны и предвзяты, а часть — вообще вкусовщина. Требования получились такие:
1. Бесшовная интеграция с Kotlin и IntelliJ Idea. Scala-библиотеки по этому принципу отпадают — извращаться с настройкой двух рантаймов нет желания. Несмотря на это, ScalaTest будет присутствовать в сравнении как отправная точка, просто потому что с ним много работал. Под интеграцией с IntelliJ я подразумеваю возможность клика на `<Click to see difference>`, чтобы увидеть сравнение реального значения и ожидаемого. Эта фича, вообще говоря, работает в кишках IntelliJ Idea — но ведь разработчики Kotlin-библиотек наверно про нее все-таки слышали и могут решить эту проблему, да?
  ![](/assets/images/habr-click-to-see-difference.png)
2. Возможность быстро понять проблему. Чтобы было не `1 != 2` и стектрейс, а нормальное сообщение, содержащее в идеале название переменной и разделение на "expected" и "actual". Чтобы для коллекций было сообщение не просто "два множества на 100 элементов не равны, вот тебе оба в строковом представлении, ищи разницу сам", а подробности, например "... эти элементы должны быть, а их нет, а вот эти не должны, но они есть". Можно конечно везде описания самому писать, но зачем тогда мне библиотека? Как выяснилось чуть позже, название переменной — это была влажная мечта, и при недолгих раздумьях будет очевидно, что это не так-то просто сделать.
3. Адекватность записи. `assertEquals(expected, actual)` — Йоды стиль читать сложно мне, вкусовщина однако это большая. Кроме того, я не хочу задумываться о тонких нюансах библиотеки — в идеале должен быть ограниченный набор ключевых слов/конструкций, и чтобы не надо было вспоминать особенности из серии "это массив, а не коллекция, поэтому для него нужен особый метод" или помнить, что строка не `contains`, а `includes`. Другими словами — это одновременно читаемость и очевидность как при чтении, так и при написании тестов.
4. Наличие проверки содержания подстроки. Что-то вроде `assertThat("Friendship").contains("end")`.
5. Проверка исключений. В качестве контр-примера приведу JUnit4, в котором исключение ловится либо в аннотацию, либо в переменную типа `ExpectedException` с аннотацией `@Rule`.
6. Сравнение коллекций и содержание элемента(ов) в них.
7. Поддержка отрицаний для всего вышеперечисленного.
8. Проверка типов. Если ошибка будет выявлена компилятором — то это гораздо круче, чем если она будет выявлена при запуске теста. Как минимум, типизация не должна мешать: если мы знаем тип ожидаемого значения, то тип реального значения, возвращенного generic-функцией, должен быть выведен. Контр-пример: `assertThat(generic<Boolean>(input)).isEqualTo(true)`. `<Boolean>` тут лишний. Третий вариант заключается в игнорировании типов при вызове ассерта.
9. Сравнение сложных структур, например двух словарей с вложенными контейнерами. И даже если в них вложен массив примитивов. Все же знают про [неконсистентность их сравнения](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/)? Так вот ассерты — это последнее место, где я хочу об этом задумываться, даже если это отличается от поведения в рантайме. Для сложных структур по-хорошему должен быть рекурсивный обход дерева объектов с полезной информацией, а не тупо вызов equals. Кстати в той недо-библиотеке на старой работе так и было сделано.

Не будем рассматривать сложные поведенческие паттерны или очень сложные проверки, где надо у объекта `человек` прям сразу проверить, что он и швец, и жнец, и на дуде играет, и вообще хороший парень в нужном месте и время. Повторюсь, что цель — подобрать ассерты, а не фреймворк для тестов. И ориентир на разработчика, который пишет юнит-тесты, а не на полноценного QA-инженера.

## Конкурсанты

Перед написанием этой статьи я думал, что достаточно будет сравнить штук 5 библиотек, но оказалось, что этих библиотек — пруд пруди.

Я сравнивал следующие библиотеки:
1. [ScalaTest](https://www.scalatest.org) — как опорная точка для меня.
2. [JUnit 5](https://junit.org/junit5/) — как опорная точка для сферического Java-разработчика.
3. [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) — для любителей multiplatform и официальных решений. Для наших целей — это обертка над JUnit, но есть нюансы.
4. [AssertJ](https://assertj.github.io/doc/) — довольно популярная библиотека с богатым набором ассертов. Отпочковалась от FestAssert, [на сайте которого](http://fest.easytesting.org/) по-японски торгуют сезамином по всем старым ссылкам на документацию.
5. [Kotest](https://github.com/kotest/kotest) — он же KotlinTest, не путать с kotlin.test. Разработчики пишут, что их вдохновлял ScalaTest. В кишках есть даже сгенерированные функции и классы для [1-22 аргументов](https://github.com/kotest/kotest/blob/624a36a1936e370ae720cca2a7878af47f27604b/kotest-assertions/kotest-assertions-shared/src/commonMain/kotlin/io/kotest/data/tables.kt) — в лучших традициях scala.
6. [Truth](https://truth.dev/) — библиотека от Гугла. По словам самих создателей, очень напоминает AssertJ.
7. [Hamсrest](http://hamcrest.org/JavaHamcrest/) ­— фаворит многих автотестировщиков по мнению [Яндекса](https://habr.com/ru/company/yandex/blog/346186/). Поверх нее еще работает [valid4j](http://www.valid4j.org/).
8. [Strikt](https://strikt.io/) — многим обязан AssertJ и по стилю тоже его напоминает.
9. [Kluent](https://markusamshove.github.io/Kluent/) — автор пишет, что это обертка над JUnit (хотя на самом деле — над kotlin.test), по стилю похож на Kotest. Мне понравилась документация — куча примеров по категориям, никаких стен текста.
10. [Atrium](https://github.com/robstoll/atrium) — по словам создателей, черпали вдохновение из AssertJ, но потом встали на свой путь. Оригинальная особенность — локализация сообщений ассертов (на уровне импорта в maven/gradle).
11. [Expekt](https://github.com/winterbe/expekt) — черпали вдохновение из Chai.js. Проект заброшен: последний коммит — 4 года назад.
12. [AssertK](https://github.com/willowtreeapps/assertk) — как AssertJ, только AssertK (но есть нюансы).
13. [HamKrest](https://github.com/npryce/hamkrest) — как Hamсrest, только HamKrest (на самом деле от Hamcrest только название и стиль).

Если вы хотите нарушить прекрасное число этих конкурсантов — пишите в комментах, какую достойную сравнения библиотеку я упустил или делайте [пулл-реквест](https://github.com/ov7a/kotlin-asserts-comparison).

## Эволюция методики оценки

Когда уже написал процентов 80 статьи и добавлял все менее известные библиотеки, наткнулся на [репозиторий](https://github.com/code-schreiber/AssertLibsCompare), где есть сравнение примерно в том виде, что мне думалось изначально. Возможно кому-то там проще будет читать, но там меньше конкурсантов.

Сначала я создал набор тестов, которые всегда валятся, 1 тест — 1 ассерт. Несмотря на то, что я люблю автоматизировать [всякую](https://habr.com/ru/post/497628/) [дичь](https://habr.com/ru/company/inforion/blog/354468/), писать какую-то сложную лабуду для проверки требований мне было откровенно лень, поэтому я планировал проверять все почти вручную и вставить шутку "то самое место, где вы можете влепить минус за "низкий технический уровень материала"".

Потом решил, что все-таки надо защититься от банальных ошибок, и средствами JUnit сделал [валидатор](https://github.com/ov7a/kotlin-asserts-comparison/blob/master/src/test/kotlin/common/TestReportValidator.kt), который проверяет, что все тесты, которые должны были завалиться, завалились, и что нет неизвестных тестов. Когда наткнулся на [баг в ScalaTest](https://github.com/scalatest/scalatest/issues/491), решил сделать две вариации: одна, где все тесты проходят, вторая — где ничего не проходит и дополнил валидатор. Внимательный читатель может спросить: а кто стрижет брадобрея и какие ассерты использованы там? Отчасти для объективности, отчасти для переносимости ассертов там вообще нет:). Заодно будет демо/аргумент для тех, кто считает, что ассерты не нужны вообще.

Затем я оказался на распутье: выносить ли или нет константы типа `listOf(1,2,3)`? Если да — то это упоротость какая-то, если нет — то при переписывании теста на другие ассерты обязательно ошибусь. Составив список библиотек, которые стоит проверить для претензии на полноту исследования, я плюнул и решил решить эту проблему наследованием: написал общий скелет для всех тестов и сделал [интерфейс для ассертов](https://github.com/ov7a/kotlin-asserts-comparison/blob/master/src/test/kotlin/common/Asserts.kt), который нужно переопределить для каждой библиотеки. Выглядит немного страшновато, зато можно использовать как розеттский камень.

Однако есть проблема с параметризованными проверками и type erasure. Reified параметры могут быть только в inline-функциях, а их переопределять нельзя. Поэтому хорошо заиспользовать конструкции типа
```
assertThrows<T>{...}
```
в коде не получится, пришлось использовать их дополнения без reified параметра:
```
assertThrows(expectedClass){...}
```
Я честно немного поковырялся в этой проблеме и решил на нее забить. В конце концов, в kotlin.test есть похожая проблема с интерфейсом [Asserter](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/): ассерт на проверку исключения в него не включен, и является [внешней функцией](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-fails.html). Чего мне тогда выпендриваться, если у создателей языка та же проблема?:)

Весь получившийся код можно посмотреть в [репозитории на GitHub](https://github.com/ov7a/kotlin-asserts-comparison). После накрученных абстракций вариант со ScalaTest я оставил как есть, и положил в отдельную папку отдельным проектом.

## Результаты

Дальше тупо суммируем баллы по требованиям: 0 — если требование не выполнено, 0.5 — если выполнено частично, 1 — если все в целом ок. Максимум — 9 баллов.

По-хорошему, надо расставить коэффициенты, чтобы более важные фичи имели больший вес. А по некоторым пунктам так вообще дробные оценки давать. Но я думаю, что для каждого эти веса будут свои. В то же время, хоть как-то табличку мне надо было отсортировать, чтобы "скорее хорошие" библиотеки были наверху, а "скорее не очень" библиотеки были внизу. Поэтому я оставил тупую сумму.

| Библиотека | Интеграция | Описание ошибки | Читабельность | Подстрока | Исключения | Коллекции | Отрицания | Вывод типов | Сложные структуры | Итого |
| ---------- | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: |
| Kotest     |     ±      |        ±        |        +      |     +     |      +     |     +     |     +     |     нет     |         -         |  6.0  |
| Kluent     |     ±      |        ±        |        +      |     +     |      +     |     +     |     +     |     нет     |         -         |  6.0  |
| AssertJ    |     ±      |        +        |        ±      |     +     |      ±     |     +     |     +     |     нет     |         ±         |  6.0  |
| Truth      |     ±      |        +        |        +      |     +     |      -     |     +     |     +     |     нет     |         -         |  5.5  |
| Strikt     |     ±      |        ±        |        ±      |     +     |      +     |     +     |     +     |     нет     |         -         |  5.5  |
| ScalaTest  |     ±      |        ±        |        ±      |     +     |      +     |     +     |     +     |     нет     |         -         |  5.5  |
| HamKrest   |     ±      |        -        |        ±      |     +     |      +     |     ±     |     +     |     да      |         -         |  5.5  |
| AssertK    |     ±      |        ±        |        ±      |     +     |      ±     |     +     |     +     |     нет     |         -         |  5.0  |
| Atrium     |     ±      |        ±        |        ±      |     +     |      +     |     ±     |     +     |     нет     |         -         |  5.0  |
| Hamсrest   |     ±      |        ±        |        ±      |     +     |      -     |     ±     |     +     |     да      |         -         |  5.0  |
| JUnit      |     +      |        +        |        -      |     ±     |      +     |     -     |     ±     |    игнор    |         -         |  4.5  |
| kotlin.test|     +      |        ±        |        -      |     -     |      +     |     -     |     -     |     да      |         -         |  3.5  |
| Expekt     |     ±      |        ±        |        -      |     +     |      -     |     ±     |     +     |     нет     |         -         |  3.5  |

Примечания по каждой библиотеке:

<details class="spoiler"><summary class="spoiler">Kotest</summary>

* Чтобы подключить только ассерты, надо немного поковыряться. На мой взгляд сходу это понять тяжело.
* Не имеет варианта ловли исключения с явным параметром, а не reified, но это на самом деле не особо и нужно: мало кто будет заниматься такими извращениями.
* Сложные структуры: тест с вложенными массивами не прошел. Я завел на это [тикет](https://github.com/kotest/kotest/issues/1543).
* Интеграция: `<Click to see difference>` есть только для простых ассертов.
* Типизация: иногда при использовании дженериков надо писать им явный тип.
* Описание ошибок: почти идеальное, не хватило только подробностей отличия двух множеств.
</details>
<details class="spoiler"><summary class="spoiler">Kluent</summary>

* Можно писать как `"hello".shouldBeEqualTo("hello")`, так и ``"hello" `should be equal to` "hello"``. Любителям DSL понравится.
* Интересная запись для ловли исключения:
    ```kotlin
    invoking { block() } shouldThrow expectedClass.kotlin withMessage expectedMessage
    ```
* Описания ошибок в целом отличные, не нет подробностей отличия двух коллекций, что не так. Еще расстроила ошибка в формате `Expected Iterable to contain none of "[1, 3]"` — непонятно, что на самом деле проверяемый Iterable содержит.
* Интеграция: `<Click to see difference>` есть только для простых ассертов.
* Сложные структуры: тест с вложенными массивами не прошел.
</details>
<details class="spoiler"><summary class="spoiler">AssertJ</summary>

* Впечатляющее количество методов для сравнения — еще бы запомнить их... Надо знать, что списки надо сравнивать через `containsExactly`, множества — через `hasSameElementsAs`, а словари — через `.usingRecursiveComparison().isEqualTo`.
* Интеграция: `<Click to see difference>` есть только для простых ассертов.
* Исключения: ловится просто какое-то исключение, а не конкретное. Сообщение об ошибке, соответственно, не содержит название класса.
* Сложные структуры: есть `.usingRecursiveComparison()`, который почти хорошо сравнивает. Однако ошибку хотелось бы иметь поподробнее: ассерт определяет, что значения по одному ключу не равны, но не говорит по какому. И несмотря на то, что он корректно определил, что два словаря с массивами равны, отрицание этого ассерта
    ```kotlin
    assertThat(actual)
        .usingRecursiveComparison()
        .isNotEqualTo(unexpected)
    ```
    сработало некорректно: для одинаковых структур не завалился тест на их неравенство.
* Типизация: иногда при использовании дженериков надо писать им явный тип. Видимо, это ограничение DSL.
</details>
<details class="spoiler"><summary class="spoiler">Truth</summary>

* Подробные сообщения об ошибках, иногда даже многословные.
* Исключения: не поддерживаются, пишут, что [надо использовать `assertThrows`](https://github.com/google/truth/issues/219) из JUnit5. Интересно, а если ассерты не через JUnit запускают, то что?
* Читаемость: кроме прикола с исключением, странное название для метода, проверяющего наличие всех элементов в коллекции: `containsAtLeastElementsIn`. Но я думаю на общем фоне это незначительно, благо тут можно для сравнения коллекций не задумываясь писать `assertThat(actual).isEqualTo(expected)`.
* Интеграция: `<Click to see difference>` только для примитивного ассерта.
* Сложные структуры: тест с вложенными массивами не прошел.
* Типизация: тип не выводится из ожидаемого значения, пришлось писать явно.
* Веселый стектрейс с сокращалками ссылок "для повышения читаемости":
  ```
  expected: 1
  but was : 2
	at asserts.truth.TruthAsserts.simpleAssert(TruthAsserts.kt:10)
	at common.FailedAssertsTestBase.simple assert should have descriptive message(FailedAssertsTestBase.kt:20)
	at [[Reflective call: 4 frames collapsed (https://goo.gl/aH3UyP)]].(:0)
	at [[Testing framework: 27 frames collapsed (https://goo.gl/aH3UyP)]].(:0)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1540)
	at [[Testing framework: 9 frames collapsed (https://goo.gl/aH3UyP)]].(:0)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1540)
	at [[Testing framework: 9 frames collapsed (https://goo.gl/aH3UyP)]].(:0)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1540)
	at [[Testing framework: 17 frames collapsed (https://goo.gl/aH3UyP)]].(:0)
	at org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.processAllTestClasses(JUnitPlatformTestClassProcessor.java:99)
    ...
  ```
</details>
<details class="spoiler"><summary class="spoiler">Strikt</summary>

* Не имеет варианта ловли исключения с явным параметром, а не reified, но это на самом деле не особо и нужно: мало кто будет заниматься такими извращениями.
* Отрицание для содержания подстроки в строке выглядит неконсистентно: `expectThat(haystack).not().contains(needle)`, хотя для коллекций есть нормальный `expectThat(collection).doesNotContain(items)`.
* Читаемость: для массивов надо использовать `contentEquals`. Та же проблема с отрицанием: `expectThat(actual).not().contentEquals(unexpected)`. Более того, надо еще думать о типе, потому что для `Array<T>` Strikt почему-то не смог определить нужный ассерт сам. Для списков — `containsExactly`, для множеств — `containsExactlyInAnyOrder`.
* Типизация: иногда при использовании дженериков надо писать им явный тип. Более того, для массивов нужно еще с вариацией правильно тип подобрать. Посмотрите на этот кусочек кода:
  ```kotlin
  val actual: Array<String> = arrayOf("1")
  val expected: Array<String> = arrayOf("2")
  expectThat(actual).contentEquals(expected)
  ```
  Он не скомпилируется, потому что компилятор не сможет определить перегрузку для `contentEquals`. Это происходит потому, что нужный `contentEquals` определен с ковариантным типом:
  ```
  infix fun <T> Assertion.Builder<Array<out T>>.contentEquals(other: Array<out T>)
  ```
  Из-за этого надо писать
  ```kotlin
  val actual: Array<out String> = arrayOf("1")
  val expected: Array<String> = arrayOf("2")
  expectThat(actual).contentEquals(expected)
  ```
* Интеграция: нет `<Click to see difference>`.
* Описание ошибки: нет подробностей для словаря и массивов, а целом довольно подробно.
* Сложные структуры: тест с вложенными массивами не прошел.
</details>
<details class="spoiler"><summary class="spoiler">ScalaTest</summary>

* Интеграция: при сравнении коллекций нельзя открыть сравнение.
* Описание ошибки: в коллекциях написано, что просто не равны. Для словаря тоже подробностей нет.
* Читабельность: надо помнить об особенностях DSL при отрицании и `contains`, отличии `contains` и `include`, а также необходимости `theSameElementsAs`.
* Сложные структуры: тест с вложенными массивами не прошел, на это [есть тикет](https://github.com/scalatest/scalatest/issues/491).
* Типизация: тип не выводится из ожидаемого значения, пришлось писать явно.
</details>
<details class="spoiler"><summary class="spoiler">Hamkrest</summary>

* Проект, судя по тикетам, в полузаброшенном состоянии. Вдобавок документация весьма жиденькая — пришлось читать исходный код библиотеки, чтобы угадать название нужного матчера.
* Ожидал, что достаточно сменить импорты Hamcrest, но не тут-то было: довольно многое тут по-другому.
* Запись ловли исключений — зубодробительная:
    ```kotlin
    assertThat( {
        block()
    }, throws(has(RuntimeException::message, equalTo(expectedMessage))))
    ```
* Коллекции: нет проверки наличия нескольких элементов. [Пулл-реквест](https://github.com/npryce/hamkrest/pull/15) висит 3,5 года. Написал так: `assertThat(collection, allOf(items.map { hasElement(it) }))`.
* Поддержки массивов нет.
* Сложные структуры: тест с вложенными массивами не прошел.
* Интеграция: нет `<Click to see difference>`.
* Описание ошибки — как-то ни о чем:
  ```
  expected: a value that not contains 1 or contains 3
  but contains 1 or contains 3
  ```

</details>
<details class="spoiler"><summary class="spoiler">AssertK</summary>

* Как можно догадаться из названия — почти все совпадает с AssertJ. Однако синтаксис иногда немного отличается (нет некоторых методов, некоторые методы называются по-другому).
* Читаемость: Если в AssertJ написано `assertThat(collection).containsAll(items)`, то в AssertK та же конструкция сработает неправильно, потому что в нем `containsAll` принимает `vararg`. Понятно, что цель на `containsAll(1,2,3)`, но продумать альтернативный вариант стоило бы. В некоторых других библиотеках есть похожая проблема, но в них она вызывает ошибку компиляции, а тут — нет. Причем разработчикам проблема известна — это [один из первых тикетов](https://github.com/willowtreeapps/assertk/issues/2). Вдобавок, нужно отличать `containsOnly` и `containsExactly`.
* Интеграция: нет `<Click to see difference>`.
* Исключения: ловится просто какое-то исключение, а не конкретное, потом его тип надо отдельно проверять.
* Сложные структуры: аналога `.usingRecursiveComparison()` нет.
* Типизация: иногда при использовании дженериков надо писать им явный тип.
* Описания ошибок — подробности есть (хоть и не везде), но местами странные:
  ```
  expected to contain exactly:<[3, 4, 5]> but was:<[1, 2, 3]>
   at index:0 unexpected:<1>
   at index:1 unexpected:<2>
   at index:1 expected:<4>
   at index:2 expected:<5>
  ```
  Вот почему тут на первый индекс два сообщения?
</details>
<details class="spoiler"><summary class="spoiler">Atrium</summary>

* Поставляется в двух вариантах стиля: fluent и infix. Я ожидал отличий вида `assertThat(x).isEqualTo(y)` против `x shouldBe y`, но нет, это `expect(x).toBe(y)` против `expect(x) toBe y`. На мой взгляд весьма сомнительная разница, с учетом того, что инфиксный метод можно вызвать без "инфиксности". Однако для инфиксной записи иногда нужно использовать объект-заполнитель `o`: `expect(x) contains o atLeast 1 butAtMost 2 value "hello"`. Вроде объяснено, [зачем так](https://github.com/robstoll/atrium/blob/v0.12.0/apis/differences.md#and-property), но выглядит странно. Хотя в среднем по больнице мне нравится infix-ассерты (вертолеты из-за скаловского прошлого), для Atrium я писал во fluent-стиле.
* Читабельность: странные отрицания: `notToBe`, но `containsNot`. Но это не критично. Пришлось думать, как сделать проверку наличия нескольких элементов в коллекции: `contains` принимает `vararg`, а `containsElementsOf` не может вывести тип, сделал тупой каст. Понятно, что цель на `contains(1,2,3)`, но продумать альтернативный вариант стоило бы. Отрицание наличия нескольких элементов записывается как `expect(collection).containsNot.elementsOf(items)`.
* Поддержки работы с массивами [нет](https://github.com/robstoll/atrium/issues/459), рекомендуют преобразовывать через `toList`.
* Не имеет варианта ловли исключения с явным параметром, а не reified, но это на самом деле не особо и нужно: мало кто будет заниматься такими извращениями.
* Сложные структуры: тест с вложенными массивами не прошел.
* Интеграция: нет `<Click to see difference>`.
* Описание ошибки: местами нет подробностей (при сравнении словарей, например), местами описание довольно запутанное:
  ```
  expected that subject: [4, 2, 1]        (java.util.Arrays.ArrayList <938196491>)
  ◆ does not contain:
    ⚬ an entry which is: 1        (kotlin.Int <211381230>)
      ✘ ▶ number of such entries: 1
          ◾ is: 0        (kotlin.Int <1934798916>)
      ✔ ▶ has at least one element: true
          ◾ is: true
  ```
* Типизация: иногда при использовании дженериков надо писать им явный тип.
</details>
<details class="spoiler"><summary class="spoiler">Hamcrest</summary>

* Читабельность: странный синтаксис для отрицаний (либо
```kotlin
assertThat(actual, `is`(not(unexpected)))
```
либо
```kotlin
assertThat(actual, not(unexpected))
```
Надо знать нюанс `containsString` vs `contains` vs `hasItem` vs `hasItems`. Пришлось думать, как сделать проверку наличия нескольких элементов в коллекции: `hasItems` принимает `vararg`, а `Set<T>` без знания `T` просто так не преобразуешь в массив. Понятно, что цель на `hasItems(1,2,3)`, но продумать альтернативный вариант стоило бы. Получилось в итоге
```kotlin
assertThat(collection, allOf(items.map { hasItem(it) }))
```
С отрицанием еще веселее:
```kotlin
assertThat(collection, not(anyOf(items.map { hasItem(it) })))
```

* В продолжение этой вакханалии с `hasItems`, я поставил ± в графу "коллекции", потому что лучше б не было ассертов, чем такие.
* Исключения: отдельной проверки нет.
* Интеграция: нет `<Click to see difference>`.
* Описание ошибки: для коллекций нет подробностей.
* Сложные структуры: тест с вложенными массивами не прошел.
</details>
<details class="spoiler"><summary class="spoiler">JUnit</summary>

* Читабельность: Йода-стиль `assertEquals(expected, actual)`, надо помнить нюансы и отличия методов: что массивы надо сравнивать через `assertArrayEquals`, коллекции через `assertIterableEquals` и т.п.
* Описание ошибок: для тех случаев, когда у JUnit все-таки были методы, оно было вполне нормальным.
* Подстрока: через `assertLinesMatch(listOf(".*$needle.*"), listOf(haystack))` конечно можно, но выглядит это не очень.
* Отрицания: нет отрицания для `assertLinesMatch`, что логично, нет отрицания для `assertIterableEquals`.
* Коллекции: нет проверки содержания элемента, `assertIterableEquals` для `Map` и `Set` не подходит совсем, потому что ему важен порядок.
* Сложные структуры: тупо нет.
</details>
<details class="spoiler"><summary class="spoiler">kotlin.test</summary>

* Очень бедно. Вроде как это должна быть обертка над JUnit, но методов там еще меньше. Очевидно, что это расплата за кроссплатформенность.
* Проблемы те же, что и у JUnit, и плюс к этому:
* Нет проверки подстроки.
* Нет даже намека на сравнения коллекций в лице `assertIterableEquals`, нет сравнения массивов.
* Типизация: JUnit'у пофиг на типы в `assertEquals`, а kotlin.test ругнулся, что не может вывести тип.
* Описание ошибок: не по чему оценивать.
</details>
<details class="spoiler"><summary class="spoiler">Expekt</summary>

* Можно писать в двух стилях `expect(x).equal(y)` и `x.should.equal(y)`, причем второй вариант не инфиксный. Разница тут ничтожна, выбрал второй.
* Читабельность: `contains(item)` против `should.have.elements(items)` и `should.contain.elements(items)`.  Причем есть приватный метод `containsAll`. Пришлось думать, как сделать проверку наличия нескольких элементов в коллекции: `should.have.elements` принимает `vararg`. Понятно, что цель на `should.have.elements(1,2,3)`, но продумать альтернативный вариант стоило бы. Для отрицания нужно еще вспомнить про `any`: `.should.not.contain.any.elements`.
* Типизация: тип не выводится из ожидаемого значения, пришлось писать явно.
* Поддержки исключений [нет](https://github.com/winterbe/expekt/issues/12).
* Поддержки массивов [нет](https://github.com/winterbe/expekt/issues/6).
* Сложные структуры: тест с вложенными массивами не прошел.
* Описание ошибки: просто разный текст для разных ассертов без подробностей.
* Интеграция: нет `<Click to see difference>`.
</details>

## Заключение
Лично мне из всего этого разнообразия понравились Kotest, Kluent и AssertJ. В целом я в очередной раз опечалился тому, как фигово работать с массивами в Kotlin и весьма удивился, что нигде кроме AssertJ нет нормального рекурсивного сравнения словарей и коллекций (да и там отрицание этого не работает). До написания статьи я думал, что в библиотеках ассертов эти моменты должны быть продуманы.

Что в итоге выбрать — еще предстоит решить команде, но насколько мне известно, большинство пока склоняется к AssertJ. Надеюсь, что и вам эта статья пригодилась и поможет вам выбрать библиотеку для ассертов, подходящую под ваши нужды.

Опросы:
* А какая библиотека больше всего нравится вам?
* Какой библиотекой пользуетесь?
