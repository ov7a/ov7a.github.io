---
layout: post
title: Старейшая тудушка в коде
tags: [legacy, git, cli]
tg_id: 582
---
Ну уж в этом-то году точно все легаси уберем, да?

Чтобы найти старые TODO в репозитории (и, скорее всего, ужаснуться), можно использовать вот эту колбасу
```
git grep -i -nE 'TODO|FIXME|FIMXE' | while IFS=: read -r file lineno line; do commit_date=$(git blame -L "$lineno,$lineno" --porcelain "$file" | awk '/^author-time/ {print $2}' | { read epoch; date -u -d @$epoch "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -u -r $epoch "+%Y-%m-%d %H:%M:%S"; }); echo "$commit_date $file:$lineno: $line"; done | tee >(sort > todos.txt)
```
(результат будет в todos.txt)

P.S. Особым мазохизмом было получение [кроссплатформенного](/2024/12/26/bash-crossplatform.html) варианта этой команды и выдрать нормальную дату из гита, потому что по умолчанию `blame` выдавал не очень машиночитаемый формат.
