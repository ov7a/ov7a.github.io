---
layout: post
title: Hello world на kotlin native
tags: [kotlin]
---
1. Скачиваем [релиз](https://github.com/JetBrains/kotlin/releases/latest), распаковываем.
2. Запускаем `kotlinc-native -help`:
```
Error occurred during initialization of VM
Could not reserve enough space for 3145728KB object heap
```
3. Офигеваем от того, что этой штуке нужно 3 гига, запускаем с ограничением:
```bash
_JAVA_OPTIONS="-Xmx256M" kotlinc-native -help
```
4. Делаем 1.kt с чем-то похожим на котлиновский код:
```kotlin
fun main() {
  println("https://t.me/minutkaprosvescheniya/120")
}
```
5. Пробуем скомпилировать:
```bash
_JAVA_OPTIONS="-Xmx256M" kotlinc-native 1.kt -o 1
```
6. Офигеваем от того, что надо скачать "немного" зависимостей — 600 мегабайт (в 2000-х за такое расстреляли бы).
7. Офигеваем от того, что виртуалка у нас немного старая, i386, и kotlin-native поддерживается для arm32, win x86, watchOs x86, wasm32, MIPS, умных часов, но не для [linux 32-bit](https://kotlinlang.org/docs/reference/native-overview.html#target-platforms), мол никому не надо — [тебе надо, ты и делай](https://github.com/JetBrains/kotlin-native/issues/939).
8. Повторяем шаги 1-6 для компа поновее.
9. Офигеваем от того, что нельзя никак убрать расширение `.kexe`, потому что ["это хороший способ идентифицировать файлы"](https://github.com/JetBrains/kotlin-native/issues/967).
10. Запускаем `./1.kexe`, получаем результат.
11. Продолжаем офигевать от зрелости технологии.

