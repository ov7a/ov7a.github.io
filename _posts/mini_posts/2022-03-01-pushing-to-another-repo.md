---
layout: post
title: Action для коммита в другой репозиторий
tags: [git, github, blogdev]
tg_id: 276
---
У меня на сайте сейчас два способа подключения чего-то стороннего: через [git read-tree](/2021/11/04/git-read-tree.html) и через [git submodule](https://git-scm.com/docs/git-submodule). Теперь появился еще один: через [github action](https://github.com/cpina/github-action-push-to-another-repository), который пушит коммит в другой репозиторий. Этот вариант оказался самым удобным, жаль, что я на него наткнулся недавно и случайно.

[Пример настройки](https://github.com/ov7a/profunctor-rating/blob/main/.github/workflows/deploy.yml) и [сгенерированный коммит](https://github.com/ov7a/ov7a.github.io/commit/f32801cd28ad8772db6c6e724a8c043d89442204).
