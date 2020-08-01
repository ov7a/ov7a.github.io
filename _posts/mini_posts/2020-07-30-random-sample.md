---
layout: post
title: Случайная выборка из csv
tags: [linux, cli]
---
Безо всяких питонов сделать случайную выборку данных из текстового файла можно командой `shuf`:
```bash
cat dataset.csv | shuf | head -n100 | tee random_sample.csv
```

