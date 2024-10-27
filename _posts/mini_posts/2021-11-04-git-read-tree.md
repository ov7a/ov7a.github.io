---
layout: post
title: Git read-tree
tags: [git, blogdev]
---
В гите достаточно [много способов](https://stackoverflow.com/questions/6500524/alternatives-to-git-submodules) скопировать данные из одного репозитория в другой. Один из них — [read-tree](https://git-scm.com/docs/git-read-tree). Ключевая идея: берем поддерево одного репозитория и вставляем его в дерево другого. [Демка для зумеров](https://www.youtube.com/watch?v=t3Qhon7burE).

Мне это пригодилось для подключения [репозитория](https://github.com/ov7a/github-pr-stats) на сайт. Делал на основе п.2 [отсюда](https://stackoverflow.com/a/30386041/1003491):
```bash
git remote add -f -t main --no-tags github-pr-stats git@github.com:ov7a/github-pr-stats.git
git read-tree --prefix=github-pr-stats -u github-pr-stats/main:build/distributions
git commit
```
[Итоговый коммит](https://github.com/ov7a/ov7a.github.io/commit/9a0e36082080313e3380144969d8e555169e7b4a).

