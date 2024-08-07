---
layout: post
title: Будущее программирования взглядом из 1973
tags: [api, actors, web, graphics, regex, фп]
tg_id: 533
---
Прекрасный [доклад](https://youtu.be/8pTEmbeENF4) 50-летней давности про будущее программирования. На основе уже имевшихся тогда концептов удалось предсказать многое: WYSIWYG, декларативный подход, повсеместность регулярок, распространение интернета, GUI, Scratch, IDE, многоядерные процессоры (забавно, что полупроводниковая микросхема была суперновинкой на момент доклада).

Но есть и несбывшееся. Например, была классная идея про то, что протокол взаимодействия должен выводиться автоматически, а не быть жестким: "нам никогда не придется иметь дела с API". :harold: Если подушить, то что-то похожее есть, например, в TLS, но это слишком низкоуровнево. Есть еще [HATEOAS](https://en.m.wikipedia.org/wiki/HATEOAS), но его полтора землекопа используют...

Была надежда на [интерактивное программирование](/2023/04/27/interactive-programming.html), но даже сейчас это просто концепт. И очень грустно было слышать, что если даже в 60-е смогли сделать отзывчивый интерфейс, то в будущем никогда не будет лага у интерфейсов. Прости чувак, тут мы точно многое просрали...

В контексте многоядерных процессоров всплыла модель акторов, даже была отсылка к Erlang, но это тоже не взлетело. "Если через 40 лет мы все еще используем потоки и локи, то... мы полностью провалились в разработке". :harold: Конечно, сейчас это считается низкоуровневой абстракцией, но это все еще живее всех живых (даже на собесах нет-нет и спросят про механизмы синхронизации).

Завершается доклад мыслью о том, что надо не переставать искать новые подходы и идеи в своем деле, иначе развитие остановится и будут только догмы.
