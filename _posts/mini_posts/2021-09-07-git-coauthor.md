---
layout: post
title: Коммит в соавторстве
tags: [git, github]
---
Иногда на GitHub можно увидеть коммит от нескольких авторов ([например](https://github.com/ov7a/ov7a.github.io/commit/b3fb685e83865c82804b63fa5f49082bc2c1686f)). Сделать совместный коммит [довольно просто](https://docs.github.com/en/github/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors): нужно просто добавить строку в коммит с текстом
```
Co-authored-by: name <name@example.com>
```
Разумеется, туда можно вписать что угодно. Отображение соавторства поддерживается GitHub и GitLab, но это не стандартная фича git. При этом есть и [другие "прицепы"](https://git.wiki.kernel.org/index.php/CommitMessageConventions).

