---
layout: post
title: Перенаправление портов
tags: [linux, cli, ssh, haproxy, docker]
---
Способов сделать это - тьма тьмущая:

1. Настроить firewall - iptables, ufw, firewalld,... тысячи их! Обычно инструкция не всегда простая, надо курнуть манов.
2. Если дело происходит на маршрутизаторе - то обычно есть встроенные средства (и GUI тоже).
3. Haproxy и прочие решения для балансировки нагрузки. Сейчас такое даже в Spring есть встроенное. 
4. nginx, apache и прочие продвинутые веб-сервера.
5. ssh. Например, так: `ssh -L 80:target_server:80 gateway_server`. Чего он только не умеет... Кстати, в одном из проектов этот способ был весьма удобен для отладки взаимодействия с базой, к которой не было прямого доступа.
6. Консольные утилиты. Например, так: `socat TCP-LISTEN:80,fork TCP:target_server:80`.
7. В каком-нибудь docker'е это задается на уровне конфига. В kubernetes команда `port-forward` делает проброс порта к поду.
8. Ngrok. Вы ставите себе утилиту на комп и она вытаскивает наружу веб-сервер с localhost. Типа чтобы демки сайтов заказчику показывать. Звучит как эксплоит, да и исходников нет... -_-

И наверняка этим список не исчерпывается. 