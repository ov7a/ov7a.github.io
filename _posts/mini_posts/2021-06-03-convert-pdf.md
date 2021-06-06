---
layout: post
title: Нюансы работы ImageMagick с PDF
tags: [linux, cli, convert]
---
Convert (ImageMagick) — классная утилита для преобразования изображений, но настройки по умолчанию для PDF там не очень хорошие. Поэтому стоит указывать такие параметры как `density` (DPI), `compress jpeg` (чтобы выходной pdf был не гигантским) и `quality` (чтобы определить степень "мыла"). Например, так:
```
convert -density 288 -quality 80 -compress jpeg page*.pdf combined.pdf
```
Кроме того, иногда бывают проблемы с потреблением ресурсов — тогда стоит отредактировать `/etc/ImageMagick-*/policy.xml` и повысить лимиты.

