---
layout: post
title: Ping устарел
tags: [net, legacy, k8s, иб]
tg_id: 623
---
Когда не грузится сайт, я обычно машинально проверяю, работает ли у меня интернет при помощи `ping 1.1.1.1`. Недавно коллега упомянул, что `ping` не нужОн и вообще устарел как средство диагностики сети. Я что-то такое смутно подозревал конечно, но явно не осознавал. Вышел в интернет с вопросом и выяснил, что
- ICMP Echo отключен по умолчанию в большинстве нормальных облаков для защиты от DDoS ping flood, ping sweep и прочих.
- Некоторые провайдеры даже отключают ICMP Echo по тем же причинам.
- В кубере пинг тоже [не будет работать](https://medium.com/@danielepolencic/learn-why-you-cant-ping-a-kubernetes-service-dec88b55e1a3#:~:text=The%20answer%20is%20simple%3A%20there%E2%80%99s,in%20iptables%20for%20ICMP%20traffic), но это скорее для простоты.
- И в Software-Defined Networking (SDN) та же история.
- У большинства роутеров ICMP-траффик имеет низкий приоритет обработки и при нагрузке они могут дропать эти пакеты.
- Поскольку в ICMP можно запихать произвольную нагрузку (можно даже [туннель сделать](/2023/12/07/icmp-tunnel.html)), малварь может использовать его для C&C, поэтому многие режут ICMP файрволлом.

> Ping only tests for the ability to respond to pings, so that's base OS, parts of the IP stack and the physical links - but that's all, everything else could be down and you'd not know.

Предлагается использовать [`tcping`](https://github.com/pouriyajamshidi/tcping) с конкретным портом, а для более качественной диагностики — `traceroute`. Хотя кажется в моем сценарии "проверить интернет" — и так сойдет :)

