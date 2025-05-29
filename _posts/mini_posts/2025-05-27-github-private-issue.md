---
layout: post
title: "\"Паблик Морозов\" для GitHub-тикета"
tags: [github]
tg_id: 620
---
Довольно специфичная проблема для мейнтейнера OSS-проекта: по ошибке переместил тикет из открытого репозитория GitHub в приватный, а обратить эту операцию GitHub [не разрешает](https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/transferring-an-issue-to-another-repository) (даже не предупредил, зараза).

Решение довольно [очевидное](https://github.com/orgs/community/discussions/21979): сделать временный приватный репозиторий, переместить тикет туда, а потом сделать репозиторий публичным — и вуаля, уже с публичным тикетом можно делать что нужно.
