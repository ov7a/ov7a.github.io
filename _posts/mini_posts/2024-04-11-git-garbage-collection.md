---
layout: post
title: Сборка мусора в git, GitHub и GitLab
tags: [git, github, gitlab]
---
Как удалить коммит, который не принадлежит ни одной ветке, из git? Выполнить _на сервере_ `git gc`.

Как удалить такой же коммит с GitHub? Похоже, что никак [[1](https://stackoverflow.com/questions/9135095/git-gc-aggressive-push-to-server), [2](https://stackoverflow.com/questions/4367977/how-to-remove-a-dangling-commit-from-github/4368673)], ну или [через поддержку](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository#fully-removing-the-data-from-github) или удаление всего репозитория. В [GitLab](https://docs.gitlab.com/ee/administration/housekeeping.html) такая функция есть.

Разумеется, сборка мусора — [очень непростая задача](https://github.blog/2022-09-13-scaling-gits-garbage-collection/).
