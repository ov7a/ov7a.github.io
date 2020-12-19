---
layout: post
title: Принудительное скачивание исходников
tags: [intellij, maven, gradle, sbt, java, kotlin]
---
Иногда IntelliJ жестко тупит и не скачивает исходники библиотек в проекте с maven, какие бы настройки ни стояли, и сколько бы ты не нажимал "Download Sources".
Помогут команды
```bash
mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
```
Первая скачает все доступные исходники ко всем зависимостям, а вторая — еще и javadoc к ним.
В sbt это можно сделать командой `sbt updateClassifiers` (хотя я это не проверял).
А вот в [gradle](https://discuss.gradle.org/t/how-do-i-force-gradle-to-download-dependency-sources/34726/2) такого вроде нет (с другой стороны, я и не припомню проблем с этим, может IntelliJ была со старыми иконками и работала нормально).

