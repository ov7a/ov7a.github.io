---
layout: post
title: Дебри рефлексии
tags: [java, kotlin]
---
[Картинка с двумя стульями](https://t.me/profunctor_io/5035) у меня родилась не просто так. Довольно типичная рабочая ситуация, в которую я вляпался на прошлой неделе. Ближе к концу я уже сел на третий стул пулл-реквестов и сделал их аж три штуки, но расскажу о дебрях, в которые зашел, пытаясь решить проблему через рефлексию.

Пусть у нас есть публичный метод, в котором надо немного подшаманить:
```java
@Override
String exampleMethod(){
    String firstPart = privateMethodToModify();
    String secondPart = super.exampleMethod();
    String thirdPart = anotherPrivateMethod();
    return firstPart + secondPart + thirdPart;
}
```
Первая реакция будет: "Чё тут делать-то? Отнаследуйся да переопредели!". Но есть нюанс: `super` будет уже не тот. А беспокоить дедушек в java нельзя.

Ок, может тогда получим указатели на `exampleMethod` и `anotherPrivateMethod`, и в месте вызова ручками все подергаем? Однако полиморфизм будет суров, и `exampleMethod` вызовется из дочернего класса, даже если указатель вы получали у родителя.

Что же делать? Сдаться и скопипастить дочерний класс, изменив в нем что нужно? Скорее всего да, но если вы хотите сидеть на пиках до конца, то есть еще один способ — `MethodHandles`. Это новый API, который не является заменой рефлексии, а дополнением к ней, в основном для всяких низкоуровневых манипуляций для разработчиков языков под JVM. С ним можно вызвать родительский `exampleMethod` для ребенка:
```java
MethodHandles.Lookup lookup = MethodHandles.privateLookupIn(Child.class, MethodHandles.lookup());
MethodHandle baseHandle = lookup.findSpecial(Parent.class, "exampleMethod", MethodType.methodType(String.class), Child.class);
return (String) baseHandle.invoke(child);
```
Но, как всегда, есть нюансы. Во-первых, если java меньше 9 версии, то придется еще и [рефлексию использовать](https://gist.github.com/nallar/2ac088d93fb411bd7240c9dd6c7cdc7f#file-basemethodcall-java-L14), чтобы в приватные методы залезть (выглядит стремно). Во-вторых, в kotlin это работать из коробки [пока не будет без специальных флагов](https://youtrack.jetbrains.com/issue/KT-14416), но в 1.4 эти флаги включат по умолчанию. 100% интеропа такие 100%.

Посмотреть примеры подробнее можно [github](https://github.com/ov7a/method-handles-example). Познакомиться с API подробнее — [тут](https://www.baeldung.com/java-method-handles), а узнать, зачем оно вообще нужно — [тут](https://stackoverflow.com/questions/8823793/methodhandle-what-is-it-all-about).

