---
layout: post
tags: [habr, python, telegram]
title: Как убить на мелкий скрипт кучу времени или история одного пулл-реквеста 
hidden: true
repost: https://habr.com/ru/post/497628/
---
Этой заметкой я хочу еще раз показать, что оценка времени на задачу — это нетривиальная проблема. Даже элементарные задачи по написанию 15-строчного скрипта могут растягиваться на несколько часов.

Понадобилось мне дублировать информацию из markdown-заметок в телеграм-канал. Казалось быть, что тут рассусоливать — `Ctrl+C` и `Ctrl+V` в помощь. Однако выяснился маленький нюанс: markdown в телеге не совсем полноценный и ссылки в таком формате `[text](http://example.com)` [клиент не поддерживает](https://github.com/telegramdesktop/tdesktop/issues/4737). Ладно, подумал я, попробуем что-то с этим сделать.

![](/assets/images/20minutes_adventure.png)

<cut text="Делов там на 5 минут максимум"/>

# Пытаюсь победить врукопашную

![](/assets/images/monkey_publish.gif)

Руками править ссылки, особенно когда их несколько — довольно муторно. Особенно с учетом [бага декстопного клиента](https://github.com/telegramdesktop/tdesktop/issues/6496), из-за которого невозможно редактировать отложенные сообщения. С планшета можно отредачить, но это еще напряжнее.

Может, получится копированием из браузера или текстового редактора? Снова облом и [еще один баг в телеге](https://github.com/telegramdesktop/tdesktop/issues/5795): при использовании буфера обмена форматирование сообщения теряется. Я заинтересовался, почему же так произошло. 

В этом нам поможет утилита [`xclip`](http://manpages.ubuntu.com/manpages/eoan/man1/xclip.1.html), которая позволяет инспектировать содержимое буфера обмена. Для сообщения телеги она показывает такие доступные форматы:
```
text/plain
UTF8_STRING
STRING
TEXT
application/x-td-field-text
application/x-td-field-tags
```
Сравните это с теми, что предоставляет Firefox:
```
text/html
text/_moz_htmlcontext
text/_moz_htmlinfo
UTF8_STRING
COMPOUND_TEXT
TEXT
STRING
text/plain;charset=utf-8
text/plain
text/x-moz-url-priv
```
или какой-нибудь Libre Office Writer:
```
application/x-openoffice-embed-source-xml;windows_formatname="Star Embed Source (XML)"
text/rtf
text/richtext
text/html
text/plain;charset=utf-16
application/x-openoffice-objectdescriptor-xml;windows_formatname="Star Object Descriptor (XML)";classname="8BC6B165-B1B2-4EDD-aa47-dae2ee689dd6";typename="LibreOffice 6.0 Text Document";viewaspect="1";width="16999";height="2995";posx="0";posy="0"
text/plain;charset=utf-8
UTF8_STRING
STRING
application/x-libreoffice-internal-id-5387
```
В общем, судя по всему, проблема достаточно глубокая. С учетом того, что я уже наткнулся на три бага декстопного клиента телеги, пора бы уже рассмотреть альтернативные решения. Конечно, можно попробовать сделать пулл-реквест, чтобы пофиксить один из двух багов, но что-то я посмотрел на исходники, вспомнил насколько я хорош с Qt да и с современными плюсам и подумал, что нет, как-нибудь в другой раз. Отложенные 5 минут я к этому моменту уже давно исчерпал, но уже интересно было из принципа хоть как-то облегчить себе задачу копипаста. 

![](/assets/images/time_to_write_a_script.png)

# В любой непонятной ситуации пиши скрипт

Да-да, я не очень хороший человек, который [все пытается решить программированием](https://habr.com/ru/company/icl_services/blog/492746/). Тем не менее, немножко погуглив, я выяснил, что боты все ж таки могут в нормальном маркдауне посылать сообщения. И может даже люди. Но это не точно.

Ок, нам нужен скрипт, который прочитает файлик и отправить его сообщением в телегу. Какие библиотеки для этого есть? На PyPI [31 страница с результатами](https://pypi.org/search/?q=telegram) по запросу "telegram". Выбрал [Telethon](https://github.com/LonamiWebs/Telethon) — на хабре статьи с ним есть, и вообще, стильно, модно, молодежно, асинхронно, чистый питон, MTProto и так далее.

Накидаем простенький скрипт, чтобы проверить работу клиента и получить информацию о себе. Не забываем о том, что я живу в стране, которая _заботится о моей безопасности_, поэтому к телеграму я могу подключиться только через прокси.
```python
from telethon.sync import TelegramClient
import socks

api_id = 11111
api_hash = '...'
proxy=(socks.SOCKS4, '127.0.0.1', 9050)

with TelegramClient('anon', api_id, api_hash, proxy=proxy, timeout=60) as client:
	print(client.get_me().stringify())
```

Запускаем скрипт... и он не работает из-за того, что не может подключиться к телеге. Конечно же, я не _HACKERMAN_, чтобы он с первого раза заработал. Наверно, проблема с прокси.

![](/assets/images/wait_a_sec.png)

# We need to do deeper

Ок, проверим, работает ли Tor, который исполняет роль прокси:
```
$ curl -XGET httpbin.org/ip --socks5 localhost:9050
```
Получаем ответ с адресом, который не мой — все ок. Значит, проблема в том, как работает прокси в Telethon. Какую библиотеку он для этого использует? [PySocks](https://github.com/Anorov/PySocks). Отлично, с этой библиотекой работал давным-давно. Там есть [простенький скрипт](https://github.com/Anorov/PySocks/blob/master/sockshandler.py), которым в том числе можно проверить работу прокси. Запускаем и получаем...
```
Traceback (most recent call last):
  File "test.py", line 110, in <module>
    print("HTTP: " + opener.open("http://httpbin.org/ip").read().decode())
  File "/usr/lib/python3.6/urllib/request.py", line 526, in open
    response = self._open(req, data)
  File "/usr/lib/python3.6/urllib/request.py", line 544, in _open
    '_open', req)
  File "/usr/lib/python3.6/urllib/request.py", line 504, in _call_chain
    result = func(*args)
  File "test.py", line 94, in http_open
    return self.do_open(build, req)
  File "/usr/lib/python3.6/urllib/request.py", line 1318, in do_open
    encode_chunked=req.has_header('Transfer-encoding'))
  File "/usr/lib/python3.6/http/client.py", line 1254, in request
    self._send_request(method, url, body, headers, encode_chunked)
  File "/usr/lib/python3.6/http/client.py", line 1300, in _send_request
    self.endheaders(body, encode_chunked=encode_chunked)
  File "/usr/lib/python3.6/http/client.py", line 1249, in endheaders
    self._send_output(message_body, encode_chunked=encode_chunked)
  File "/usr/lib/python3.6/http/client.py", line 1036, in _send_output
    self.send(msg)
  File "/usr/lib/python3.6/http/client.py", line 974, in send
    self.connect()
  File "test.py", line 55, in connect
    ((socket.IPPROTO_TCP, socket.TCP_NODELAY, 1),))
  File "/usr/lib/python3/dist-packages/socks.py", line 200, in create_connection
    proxy_username, proxy_password)
  File "/usr/lib/python3/dist-packages/socks.py", line 322, in set_proxy
    username.encode() if username else None,
AttributeError: 'int' object has no attribute 'encode'
```
Ах ты ж... Какого черта? Я ведь сам туда хэндлер для https [добавлял](https://github.com/Anorov/PySocks/pull/5/commits/b73084a429fe07f8787bf8485050ca02991e2a7b), должно работать! Что могло там поменяться за... 6 лет? Какой я старый :( 

15-20 минут на клонирование репы и принт-деббагинг приводят к ответу, что проблема в неправильном порядке аргументов — в основной библиотеке поменяли аргументы, а во вспомогательном скрипте забыли поправить. Хорошо хоть [пулл-реквеcт](https://github.com/Anorov/PySocks/pull/135/files) на фикс этой проблемы есть, и скрипт оттуда работает. Мораль проста: если список аргументов длинный, лучше использовать именованные параметры.

Ок, с этим разобрались, значит, проблема не в прокси. В чем же дело? И тут мне в голову приходит гениальнейшая идея про то, что может стоит включить дебаг-логи в Telethon? И одновременно осознание, какой же я даун, если не додумался до этого раньше. Пробуем с дебаг-логами:
```
DEBUG:telethon.network.mtprotosender:Connection attempt 2...
WARNING:telethon.network.mtprotosender:Attempt 2 at connecting failed: ProxyConnectionError: Error connecting to SOCKS4 proxy 127.0.0.1:9050: [Errno 115] Operation now in progress
```
О чем же говорит нам эта ошибка? По номеру находим код `EINPROGRESS`, а про него читаем уже [маны ядра по функции connect](http://man7.org/linux/man-pages/man2/connect.2.html). Если общими словами, то проблема заключается в том, что у нас неблокирующая операция (в нашем случае установка соединения) не успела выполнится мгновенно и намекает нам, что она все еще выполняется. Похоже на правду: Tor не очень быстр. Не ожидал конечно, что ради 10-строчного скрипта на питоне, который в наши времена любой школотрон пишет за 5 минут с закрытыми глазами, мне придется опуститься до уровня системых вызовов и вспоминать особенности работы с сокетами... 

После того, как я понял, в чем проблема, выяснилось, что она на самом деле уже известна, правда [сформулирована по-другому](https://github.com/Anorov/PySocks/issues/121). И внезапно автор этого тикета в репозитории — создатель библиотеки Telethon. Есть еще [баг с похожими симптомами](https://github.com/LonamiWebs/Telethon/issues/1192) в самом Telethon и подозрительно похожий на мою ситуацию [тикет в PySocks](https://github.com/Anorov/PySocks/issues/130).

# Пора уже делать что-то полезное

Дальше стоит уже более обозримая задача: пофиксить это хоть как-нибудь. Лезть в дебри работы с сокетами — уж очень специфичное занятие, тем более, что реагирует мейнтенер не очень быстро. Тот же баг от автора Telethon висит уже больше года без ответа и привета. Опытный читатель здесь может сказать: бросай ты уже эту библиотеку, возьми другую. И, наверно, будет прав. Но мы не ищем легких путей: попробуем сделать что-нибудь с самим Telethon.

![](/assets/images/my_pr_with_fix.png)

Клонируем репу, немного принт-дебажим как питекантропы, которые не умеют пользоваться отладчиком, и наконец наш фикс готов: просто добавляем таймаут перед установкой соединения. Ведь по сути вся асинхронность заключается в том, что таймаут нулевой. 
```diff
- s.setblocking(False)
+ s.settimeout(timeout)
```
Грязно, некрасиво, неасинхронно, но работает. Получаю большое удовольствие от того, какой я молодец и смог пофиксить проблему, и [создаю PR](https://github.com/LonamiWebs/Telethon/pull/1432). 

![](/assets/images/wild_commits.jpg)

# Возвращаемся назад

Вы ведь еще же помните, что я всего лишь хотел в телегу сообщения в маркдауне отсылать, да? Накидал я в итоге по-быренькому этот скрипт, заодно пару вещей с форматированием исправил, но к делу это не относится. Вроде все хорошо, скрипт работает, казалось бы, задача решена. Но тут что-то во мне ёкнуло и я задумался: не хочу я быть как трейдеры в телеге, которые делают так:

![](/assets/images/telegram_api_creds.png)

Как нормально передать параметры `api_key` и `api_hash`, которые нельзя отозвать/поменять, но можно заабузить? Посмотрел, как это делают в примерах Telethon — через переменные окружения. Неплохо, но где хранить тогда эти переменные окружения? В конфиге, чтобы подгружать их? А что если кто-то получит доступ к конфигу?

Тут я немного начал параноить (видимо сказывается профдеформация) и начал думать в сторону всяких Vault, шифрованных разделов, аппаратных ключей, начал смотреть про их уязвимости... Решил даже спросить совета у хорошего знакомого, который лучше разбирается в ИБ, чем я. Рассказал ему о проблеме. И тут он спрашивает про мой скрипт:
> А зачем ему энтерпрайз левел секурити?)

...

![](/assets/images/really.png)

... подумал я и впихнул чтение через [keyring](https://pypi.org/project/keyring/). Не plain-text, ничего разворачивать не надо, даже ставить не надо. Для моих целей действительно сойдет.

# Заключение

Я надеюсь, что мне удалось на примере еще раз показать, что оценка времени на работу — непростое занятие, что для программиста иметь кругозор — хорошо, и что надо знать, когда стоит остановиться. [Скрипт](https://github.com/ov7a/telegram_publisher/blob/master/publisher.py) разросся до 50 строк, из которых полезны только 10, остальное — парсинг параметров, импорты да отступы. А [пулл-реквест](https://github.com/LonamiWebs/Telethon/pull/1432) в итоге приняли на следующий день после небольшой дискуссии. 

Надеюсь, что статья вас хотя бы позабавила, а если вы узнали что-то новое, то вообще шикарно. Спасибо за внимание!

Опрос: оправдана ли трата нескольких часов на этот скрипт?
* Да
* Зависит, от ситуации, но скорее да
* Зависит, от ситуации, но скорее нет
* Точно нет
