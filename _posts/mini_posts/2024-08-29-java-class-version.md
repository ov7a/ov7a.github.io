---
layout: post
title: Соответствие версии Java и версии class-файлов
tags: [java]
tg_id: 542
---
Кто писал для JVM, встречался с `Unsupported class file major version XX`. Обычно это означает, что текущая версия java слишком низкая. Но какая версия нужна, например, для 55? Можно использовать [табличные значения](https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-4.html), но запомнить табличку или ссылку на нее — нетривиально. Проще воспользоваться формулой: 
```
java_version + 44 = class_file_version
```
