---
layout: post
title: Все зависимости Gradle-билда
tags: [gradle, иб, cli, owasp]
tg_id: 621
---
Недавно опять получил сесурити-алерт от dependabot о том, что в проекте уязвимая зависимость, уровень опасности 100500, пофикси срочно, но где — ищи сам (спойлер: она была в итоге транзитивных зависимостях WireMock).

Чтобы получить дерево зависимостей билда Gradle, можно запустить
```shell
./gradlew dependencies
```
Однако, в этом отчете будут только зависимости одного проекта. И там не будет зависимостей билд-логики (плагины там всякие).

Чтобы получить почти все (потому что более чем уверен, что есть случаи, которые этим не покрыты), я использую вот такую колбасу (которая хранится в баш-профиле):
```shell
function deps(){
  ./gradlew --no-parallel dependencies buildEnvironment $(./gradlew -q projects | grep -Fe "--- Project " | sed -Ee "s/^.+--- Project '([^']+)'.*/\1:dependencies \1:buildEnvironment/" | sort) $([ -d buildSrc ] && echo ":buildSrc:dependencies :buildSrc:buildEnvironment" || echo "")
}
```
Тут запускается диагностика для вывода списка проектов и для каждого из них выводится дерево зависимостей как для самого билда, так и для его билд-логики. Предполагается сохранить вывод в файл (на больших проектах это может быть 100+ мегабайт текста), искать в нем проблемную зависимость и по дереву идти выше до конкретной зависимости верхнего уровня, конфигурации и проекта.

Если нет жестких ограничений на публичность метаданных проекта, можно запустить
```shell
./gradlew build --scan
```
и получить [Build Scan](https://docs.gradle.org/8.14.1/userguide/command_line_interface.html#reporting_dependencies) с интерактивным отчетом. Вот [пример](https://scans.gradle.com/s/oekqu362xmrmg/dependencies?focusedDependency=WzAsNiwyNDgsWzAsNixbMjMzLDI0OF1dXQ&focusedDependencyView=details&toggled=W1swXSxbMCw2XSxbMCw2LFsyMzNdXV0).

И бонус — не могу не пожаловаться на качество разработки с точки зрения ИБ. Ладно еще вышеупомянутый WireMock, у которого каждая версия на текущий момент имеет какую-то незакрытую уязвимость. Но вот [официальная библиотека](https://mvnrepository.com/artifact/com.googlecode.owasp-java-html-sanitizer/owasp-java-html-sanitizer?p=1) от официальной организации OWASP для санитайзинга HTML тоже не имеет НИ ЕДИНОЙ версии без уязвимостей. И примерно [никакущую реакцию](https://github.com/OWASP/java-html-sanitizer/issues/357) на вопрос трехмесячной давности "а какая версия без уязвимостей?" Добью [цитатой из README](https://github.com/OWASP/java-html-sanitizer/blob/f729a089b20aef49ed9ffd7ed1c7e207eee71dc5/README.md?plain=1#L14):

> This code was written with security best practices in mind, has an extensive test suite, and has undergone adversarial security review.
