---
layout: post
title: Двойные и тройные слеши в пути
tags: [linux, fs]
---
Нашел [прекрасное](https://unix.stackexchange.com/questions/256497/on-what-systems-is-foo-bar-different-from-foo-bar). В POSIX `////some/path`, `///some/path` и `/some/path` — это одно и то же, но при этом не то же самое что `//some/path`. 3 и более слешей спереди превращаются в одинарный слеш, а вот обработка 2 слэшей может зависеть от системы/реализации. И нет, это не из-за Microsoft.

В большинстве случаев, например в Cygwin, `//host/path` интерпретируется как сетевой ресурс. Но не сетью единой: например, в [Bazel](https://docs.bazel.build/versions/5.4.1/build-ref.html#labels) `//` используются для адресации таргетов. 

