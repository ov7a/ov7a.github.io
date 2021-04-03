---
layout: post
title: Term vs match query
tags: [elasticsearch]
---
[Term query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html) ищет документы по точному совпадению запроса с токенами в индексе, а [match query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) — по совпадению *токенизированого* запроса. Т.е. к значению в запросе применяются те же преобразования, что и при индексации, или даже какой-то другой анализатор. Дополнительная плюшка match query еще в том, что он, как и term query, универсален, и позволяет искать не только по текстовым полям, но и по keyword/числовым/датам и т.п.

Возникает вопрос: а зачем тогда вообще нужен term query? Для текстового поля логично использовать тот же анализатор (разве что кроме каких-то очень экзотических случаев или дебага). Для прочих типов полей — разница будет крошечной: потратится только немного времени на определение анализатора, который надо применить (чтобы выяснить, что его нет). [Даже разработчики](https://discuss.elastic.co/t/term-vs-match-query-on-keyword-field/65892) говорят — используйте match для единообразия. И в старом гайде [пишут](https://www.elastic.co/guide/en/elasticsearch/guide/master/term-vs-full-text.html) примерно то же самое. Я нашел только один аргумент — [скоринг](https://discuss.elastic.co/t/difference-between-bool-should-match-vs-terms-query-on-keyword-numeric-field/193207): в term query игнорируется IDF. Но это подходит под "экзотический случай".

Альтернативный вариант — использовать для всего, кроме текста terms query. Это ясно дает понять, что ищем в индексе "как есть", намекая на то, что это поле в индексе тоже хранится "как есть".

