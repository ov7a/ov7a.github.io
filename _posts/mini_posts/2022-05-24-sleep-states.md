---
layout: post
title: Вариации сна для компьютера
tags: [hardware]
---
1. Бездействие (aka S1, idle) — CPU остановлен, система потребляет чуть меньше энергии: почти все устройства переключены в режим низкого энергопотребления или выключаются (ЖД, подсветка экрана).
2. Сон (aka S2) — как S1, только CPU отключен от питания (разница с S1 минимальна, на некоторых материнских платах его даже не реализовывают).
3. Ждущий режим (aka S3, sleep, suspend) — почти все устройства, кроме RAM отключены, состояние хранится в памяти. RAM обновляется медленнее. Жрет питание/батарею, но чуть-чуть.
4. Гибернация (aka S4, hibernate) — состояние сохраняется на диск (например, в swap), питание полностью отключается. Однако не все оборудование корректно может восстановить свое состояние, поэтому этот режим обычно отключен по умолчанию.
5. Мягкое выключение (aka S5, soft off) — все выключено, но некоторые порты/контроллеры включены (чтобы включить комп по LAN или по нажатию кнопки на клавиатуре, например).
6. Гибридная гибернация (aka hybrid suspend) — состояние сохраняется на диск, как в гибернации, а потом комп переводится в ждущий режим. Позволяет быстрее выходить из сна, но не терять состояние, если питание пропадет. Есть еще вариация, когда сначала выполняется suspend, а потом, по таймеру или по триггеру (например, низкий заряд батареи) кратенько просыпается и уходит в гибернацию.
7. Modern Standby (aka S0 low power idle, S0ix) и PowerNap — маркетинговые названия для S0 (полностью работающий комп), просто часть функций системы не работают и часть периферии отключена. Но при этом выполняются фоновые задачи и остается подключение к сети ("как у смартфона"). Питание потребляет много, и ноутбук в таком режиме в сумку класть не стоит — может перегреться.
