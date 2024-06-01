---
layout: post
title: Список измененных файлов в ветке
tags: [git, devops]
tg_id: 376
---
Если для какого-нибудь [пайплайна](/2023/02/02/coverage-integration.html) надо определить список измененных файлов, то сама команда довольно простая:
```sh
git diff-tree --no-commit-id --name-only -r %base_commit_hash% -r %commit_hash%
```
В качестве `%base_commit_hash%` и `%commit_hash%` можно использовать как хэш коммита, так и название ветки (`origin/master`, например). В CI почти наверняка эти ревизии есть в переменных окружения. В [GitLab](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) это `CI_MERGE_REQUEST_DIFF_BASE_SHA` и `CI_COMMIT_SHA`. 

Однако стоит внимательно следить за этими значениями, если их получаете самостоятельно. Оказывается, [нельзя просто так взять](https://stackoverflow.com/questions/1527234/finding-a-branch-point-with-git) и найти коммит, от которого началась ветка. Есть 
```sh
git merge-base master HEAD 
```
и эта команда будет неплохо работать в плюс-минус обычных сценариях. Но будет давать [неверный результат](https://stackoverflow.com/a/9979346/1003491), если `master` подмерживается в фиче-ветку.

