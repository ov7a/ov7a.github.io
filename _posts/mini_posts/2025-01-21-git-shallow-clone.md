---
layout: post
title: Неполное клонирование
tags: [git, devops, github]
tg_id: 585
---
Во всяких CI и/или тестовых окружениях обычно не нужна вся история коммитов, а достаточно выгрузить состояние репозитория на момент определенного (чаще всего последнего) коммита. Чтобы сэкономить время и снизить вероятность ошибки сети, если она нестабильна, можно вместо тупого `clone` сделать неполный:
```sh
git clone --depth=1 <remote-url>
# или
git clone --depth=1 <remote-url> --branch <branch_name> --single-branch <folder_name>
```
Больше опций можно посмотреть в [статье от GitHub](https://github.blog/open-source/git/get-up-to-speed-with-partial-clone-and-shallow-clone/), а сравнение скорости для некоторых репозиториев — [тут](https://github.blog/open-source/git/git-clone-a-data-driven-study-on-cloning-behaviors/) (до 25х быстрее).

Еще возникает иногда желание склонировать только коммиты из ветки (например, для того, чтобы проверить каждый из них на вшивость), но, увы, это сложнее. Даже стандартный checkout от GitHub это пока [не умеет](https://github.com/actions/checkout/issues/520). Всякие обходные пути можно найти в том же тикете.
