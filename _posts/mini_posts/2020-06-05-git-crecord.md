---
layout: post
title: Частичный коммит
tags: [git, mercurial, intellij, bestpractices]
---
Я надеюсь, что доказывать пользу атомарных коммитов не нужно. Можно почитать немного про это, а заодно про сообщение коммита в [wiki OpenStack](https://wiki.openstack.org/wiki/GitCommitMessages).

Но не всегда получается построить план своей работы над задачей так, чтобы учесть все возможные изменения. Особенно если вы вдруг из тех, кто считает, что зачем тратить целых 30 минут на раздумья, когда можно всего лишь за 5 часов все потом отрефакторить :)

Если у вас есть большая пачка изменений с рефакторингами и изменениями в бизнес-логике вперемешку, то разбить ее на атомарные коммиты поможет частичный коммит. Ну и stash/shelve, но про них как-нибудь в другой раз.

В mercurial для этого есть просто великолепный интерактивный режим (`hg commit -i`), который раньше был расширением [Crecord](https://www.mercurial-scm.org/wiki/CrecordExtension). В Intellij поддержки частичного коммита нет, но [есть тикет](https://youtrack.jetbrains.com/issue/IDEA-187153). Шансы на то, что его исправят близки к нулю — "кто же использует mercurial в 2020?", считает большая часть индустрии.

В git для этого есть механизм [patch](https://stackoverflow.com/questions/1085162/commit-only-part-of-a-file-in-git) (`git add -p <filename>`), который работает, мягко говоря, отвратительно. Там даже нельзя выбрать отдельную строчку. `Stage this hunk [y,n,q,a,d,/,j,J,g,s,e,?]?` звучит особенно по гитовски — миллион опций, запомнить которые невозможно. В Intellij уже два года как есть поддержка частичного коммита, который является надстройкой над этим механизмом, и закоммитить отдельные строчки через нее тоже [пока нельзя](https://youtrack.jetbrains.com/issue/IDEA-186988).

Но не стоит унывать, потому что для git тоже есть расширение [Crecord](https://github.com/andrewshadura/git-crecord). `sudo apt-get install git-crecord`, и после этого доступна команда `git crecord`, которая окунет вас в такой же отличный интерактивный режим, как и в mercurial.

