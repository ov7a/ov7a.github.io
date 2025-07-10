---
layout: post
title: Резиновый квадрат в CSS
tags: [css]
tg_id: 633
---
Прогресс не стоит на месте. Когда делал [галерею со смешнявками](/gags) на [чистом CSS](/2020/05/03/css-impressions.html) в далеком 2020 году, у меня был вопрос, на который не могли ответить ни знакомые фронтендеры, ни на [StackOverflow](https://stackoverflow.com/questions/61466852/make-a-square-element-with-lazy-images-inside/79691833#79691833): как сделать "резиновый" квадрат, совместимый с другими фичами.

И вот, 5 лет спустя, шальная мысль пришла в голову и решение нашлось за один запрос: примерно с 2021 везде доступно свойство [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio), которое делает именно то, что нужно. Никаких больше [уродских абсолютных значений в пикселях](https://github.com/ov7a/ov7a.github.io/commit/da384762d1e5d42dcc7075d9479cdecfd1c0a5c1)!
