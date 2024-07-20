---
layout: post
title: Несколько GitHub Actions в одной репе
tags: [githib, devops]
tg_id: 531
---
Один репозиторий может содержать несколько GitHub Actions. Примеры: [1](https://github.com/gradle/actions), [2](https://github.com/gradle/issue-management-action). Это удобно для группировки нескольких действий. Чтобы выбрать нужное, достаточно добавить папку: 
```yaml
- uses: username/repo/folder@tag
```

Увы, я этого не знал, и в первой итерации городил [костыли](https://github.com/gradle/issue-management-action/blob/987cf1921e68be3d5dbd704404aa2e1c5cc0a2e6/src/index.ts#L15), не делайте так:)

