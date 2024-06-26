---
layout: post
title: Отладка Jenkins пайплайна
tags: [jenkins, devops]
tg_id: 287
---
Чтобы быстрее отладить/доработать скрипт пайплана в jenkins, можно использовать:
- Генератор кода http://${jenkinsHost}/pipeline-syntax, в котором можно накликать один из шагов из плагинов.
- REPL http://${jenkinsHost}/script, чтобы проверить небольшие кусочки или какие-то моменты из Groovy. Недостаток — контекст немного отличается от пайплайна (запускается без песочницы), и код из REPL не всегда будет работать в пайплайне.
- Список глобальных переменных и методов http://${jenkinsHost}/pipeline-syntax/globals, чтобы посмотреть, что доступно.
- [Скрипт](https://stackoverflow.com/a/55714171/1003491) для одобрения методов за пределами песочницы (если пришлось залезть в кишки), чтобы одобрять методы не по одному.
- Replay билда + отключение шагов, которые можно пропустить, для более быстрой проверки работоспособности.

