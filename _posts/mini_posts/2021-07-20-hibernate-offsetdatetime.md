---
layout: post
title: OffsetDateTime и Hibernate
tags: [бд, sql, java]
---
При работе с датами Hibernate стоит быть аккуратным: он все типы конвертирует в java.sql.Timestamp, который по смыслу [идентичен](/2020/08/13/java-dates.html) java.time.Instant. Поэтому информация о временной зоне будет потеряна: при чтении из базы в какой-нибудь OffsetDateTime будет [подставлена системная зона](https://github.com/hibernate/hibernate-orm/blob/main/hibernate-core/src/main/java/org/hibernate/type/descriptor/java/OffsetDateTimeJavaDescriptor.java). Так что проще сразу маппить на Instant во избежание недоразумений. Матерые Java-чемпионы так и [говорят](https://vladmihalcea.com/date-timestamp-jpa-hibernate/), что OffsetDateTime и ZonedDateTime для JPA не очень полезны. И вообще, можно [стрельнуть](https://stackoverflow.com/questions/61656592/offsetdatetime-persisted-by-jpa-differs-by-2-hours) себе в ногу с ними.

Можно еще выбрать в самой базе тип "timestamp with time zone", если он поддерживается (потому что в SQL стандарте его нет), но, во-первых, Hibernate пофигу на это отличие, а во-вторых, в этом типе на самом деле не хранится информация о самой зоне, см., например, [документацию Postgresql](https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-TIMEZONES):
```
All timezone-aware dates and times are stored internally in UTC. They are converted to local time in the zone specified by the TimeZone configuration parameter before being displayed to the client.
```

