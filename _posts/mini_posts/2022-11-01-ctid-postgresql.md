---
layout: post
title: Удаление дубликатов в таблице-списке
tags: [sql, бд]
tg_id: 347
---
Способов удалить дубликаты в таблице довольно много: с использованием CTE, JOIN, подзапроса, извращений вроде пересоздания таблица через DISTINCT и т.д.
Возьмем для примера группировку с USING:  
```sql
DELETE FROM elements t1 USING elements t2 WHERE t1.some_key = t2.some_key AND t1.created_at > t2.created_at;
```
Тут одна колонка (`some_key`) используется для собственно определения дубликатов, а вторая (`created_at`) — для сортировки их между собой.

Но что делать если в таблице всего одна колонка, как различать два элемента, чтобы удалить не все? Тут пригодятся [системные колонки](https://www.postgresql.org/docs/current/ddl-system-columns.html). В данном случае — `ctid`, "физическое расположение данной версии строки в таблице":
```sql
DELETE FROM list t1 USING list t2 WHERE t1.some_key = t2.some_key AND t1.ctid > t2.ctid;
```
