---
layout: post
title: Устранение шумов микрофона в Linux
tags: [linux]
---
Без понятия, почему это не включено по умолчанию, но хотя бы [можно включить](https://www.linuxuprising.com/2020/09/how-to-enable-echo-noise-cancellation.html).
В `/etc/pulse/default.pa` надо добавить
```
.ifexists module-echo-cancel.so
load-module module-echo-cancel aec_method=webrtc source_name=echocancel sink_name=echocancel1
set-default-source echocancel
set-default-sink echocancel1
.endif
```
И перезапустить PulseAudio (`pulseaudio -k`) или перезагрузиться. После этого в настройках звука появятся дополнительные входы/выходы с пометкой `echo cancelled`.

