---
layout: post
title: Долгой круглое время!
tags: [time, telegram]
tg_id: 515
---
Давненько заметил за телегой не очень строгое следование расписанию: если запланировал пост на 10:00, то он опубликуется обычно в 10:02-10:05, и со временем проблема становилась заметнее: можно посмотреть по истории постов канала. Вполне очевидно, почему так происходит: алгоритм отложек не идеален и все больше людей пользуется фичей. "Вас тут много, а я одна!". И лайфхак для решения проблемы очень простой — поставить в расписании 9:59 (~~по цене 9.99~~).

Он пригодится и в других контекстах. Ни для кого не секрет, что люди по умолчанию выбирают круглые даты и числа. И программисты — не исключение. Поэтому всякие работы по расписанию (например, очистка БД от мусора в ночное время) лучше ставить не тупо на полночь, а на на случайный час со случайными минутами — чтобы была меньше вероятность запуститься с чем-то одновременно. Конечно, в идеальном мире должен быть хороший планировщик, но кого мы обманываем с этими микросервисами?
