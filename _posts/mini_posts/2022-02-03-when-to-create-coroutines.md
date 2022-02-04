---
layout: post
title: Когда нужно создавать корутины?
tags: [kotlin]
---
Интересный [вопрос](https://discuss.kotlinlang.org/t/globalscope-and-runblocking-should-not-be-used-so-how-do-you-start-a-coroutine/24004) задали на форуме котлина: а как собственно стартовать корутины, если не рекомендуется использовать `GlobalScope` и `runBlocking`? TLDR: `suspend fun main` или явные `CoroutineScope`. А вообще в этом плане лучше читать [статьи](https://elizarov.medium.com/explicit-concurrency-67a8e8fd9b25) от Елизарова, он неплохо объясняет их нюансы (что неудивительно, с учетом того, что он сейчас лид разработчиков Kotlin).

