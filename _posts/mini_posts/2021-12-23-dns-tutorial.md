---
layout: post
title: Интерактивное обучение DNS
tags: [dns, tutorial]
---
[Коротенькая обучалка](https://messwithdns.net/), с которой можно немного поиграться. К сожалению, дает лишь горстку новых знаний, даже толком не рассказывает о том, какая разница между A и AAAA, какие вообще бывают [типы записей DNS](https://en.wikipedia.org/wiki/List_of_DNS_record_types) или что в DNS записи можно [напихать почти произвольный текст](https://breanneboland.com/blog/2020/02/28/you-can-put-what-in-dns-txt-records-a-blog-post-for-con-west-2020/):
```sh
dig txt +short maybethiscould.work
```
