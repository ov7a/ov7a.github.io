---
layout: post
title: Bootstrapping для Zig
tags: [compiler, zig, wasm, c]
tg_id: 529
---
Занятная [история](https://ziglang.org/news/goodbye-cpp/) про то, как Zig выкинул исходники на плюсах для самосборки в пользу многоступенчатого процесса, в котором фигурирует компактная виртуальная машина с WASI/WASM. При этом компилятор сей все равно понадобится. 

[Подобные выкрутасы](https://en.wikipedia.org/wiki/Bootstrapping_(compilers)) интересны с точки зрения воспроизводимости сборки, точнее, уменьшения количества кода, нужного для этого. В статье том числе описаны стандартные подходы, которые используются в других языках.

Требования по воспроизводимости обычно предъявляют мейнтейнеры пакетов (например, в Debian или nix). Увы, то, что описано в статье, не совсем воспроизводимо по таким критериям, т.к. содержит бинарный код для WASM, но все равно прикольно. RISC > CISC!