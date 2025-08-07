---
layout: post
title: Релизы на GitHub
tags: [devops, github]
tg_id: 642
---
Окей, сделать релиз на GitHub оказалось проще, чем [ожидалось](/2025/07/31/github-actions-cache.html).

Главное — выбрать правильно action :) [Официальное](https://github.com/actions/create-release) — в архиве, одно из 4 рекомендованных — тоже, еще 2 имеют странные настройки по умолчанию, и методом исключение было выбрано [softprops/action-gh-release](https://github.com/softprops/action-gh-release).

И настраивать особо не понадобилось — самому действию нужен только список файлов для загрузки, а для workflow достаточно настроить права на запись и триггер на обновление тэгов.
