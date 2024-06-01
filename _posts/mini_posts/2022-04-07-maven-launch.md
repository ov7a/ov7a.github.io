---
layout: post
title: Запуск нескольких целей в Maven
tags: [maven, devops]
tg_id: 286
---
С помощью `defaultGoal` и профиля можно запускать несколько фаз или целей:
```xml
<profile>
  <id>some-profile</id>
  <build>
    <defaultGoal>
      test
      a.group:an.artifact:some-plugin:goal@custom-goal-config
    </defaultGoal>
...
```
При такой настройке `mvn -Psome-profile` будет эквивалентен `mvn test a.group:an.artifact:some-plugin:goal@custom-goal-config`. Это удобно для разделения этапов в пайплайне (и когда есть конфигурации для целей). Мне пригодилось для получения агрегированного результата покрытия после параллельного выполнения тестов.

