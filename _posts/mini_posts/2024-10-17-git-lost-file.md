---
layout: post
title: Поиск файла в git
tags: [git]
tg_id: 559
---
В продолжение предыдущего [поста](/2024/10/15/links-checker.html) и борьбы с мертвыми ссылками. Если содержимое известно, то найти файл в истории можно, [уже проходили](/2020/07/21/git-grep.html). Но что делать если известен только (устаревший) путь к файлу?
```sh
git log --all --full-history --no-merges -- your/broken/file.path
```
Тут идет поиск по всему логу изменений за исключением мержей (вы ведь не делаете ничего странного с файлами во время мержа?). Можно поиграться с флагом `--diff-filter=D`, но надо железно знать, что файл удален. В моем случае это было не так.