---
layout: post
title: Переключение на форк
tags: [git, github]
---
Если возитесь в скачанных исходниках и появилась потребность внести исправления, то не нужно качать заново качать код из своего форка.

Можно просто переименовать `origin` в `upstream`, добавить форк в качестве `origin` и подтянуть информацию из форка.
```bash
git remote rename origin upstream
git remote add origin git@FORK
git fetch origin
```

