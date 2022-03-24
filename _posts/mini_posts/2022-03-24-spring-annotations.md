---
layout: post
title: Хрупкие аннотации Spring
tags: [spring, java, kotlin]
---
Одна из самых бесючих проблем в Spring — это то, что одной аннотацией можно неочевидно сломать работающий код.

Например, добавление `@ComponentScan` [превратит в тыкву](https://stackoverflow.com/questions/47054716/componentscan-in-application-class-breaks-webmvctest-and-springboottest) `@WebMvcTest`.

`@Transactional` [может сломать](https://www.baeldung.com/spring-nosuchbeandefinitionexception#cause-4) любой сервис без интерфейса, причем в лучшем случае будет `NoSuchBeanDefinitionException`, а в худшем, а в худшем, если класс-потребитель не финальный, то будет тупо `null` вместо бина.

Поставил `@TestExecutionListeners` без `mergeMode = MERGE_WITH_DEFAULTS` — и тесты перестают работать.

И подобных примеров еще массу можно напридумывать:(

