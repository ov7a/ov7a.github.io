---
layout: post
title: Конвертация pdf ⟷ png
tags: [linux, cli, convert]
---
В продолжение темы конвертеров.
```bash
convert -density 300 order.pdf %02d.png
```
сконвертирует pdf в png. А обратно склеить их в pdf можно так:
```bash
convert {00..03}.png combined.pdf
```
Возможно придется [включить разрешения](https://stackoverflow.com/questions/52998331/imagemagick-security-policy-pdf-blocking-conversion), добавив
```xml
<policy domain="coder" rights="read | write" pattern="PDF" />
```
в `/etc/ImageMagick-[версия]/policy.xml`.
