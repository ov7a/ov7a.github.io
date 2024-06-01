---
layout: post
title: SSH как SOCKS-proxy
tags: [linux, cli, ssh]
tg_id: 428
---
Чтобы быстро и без проблем скачать что-то из заблокированного интернета не надо ставить VPN и WireGuard, не надо [форвардить порты](/2020/04/17/port-forwarding.html), нужно всего лишь... [читать далее](https://stackoverflow.com/questions/51579063/curl-https-via-an-ssh-proxy)

```sh
ssh -D 8080 -C -q -N name@server
...
curl -s -x socks5h://0:8080 https://some.shit/file
```
