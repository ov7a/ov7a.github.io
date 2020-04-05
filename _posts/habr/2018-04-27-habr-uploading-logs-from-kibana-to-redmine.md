---
layout: post
title: Автоматизация загрузки логов из Kibana в Redmine
tags: [habr, kibana, redmine, javascript, haproxy, web]
hidden: true
repost: https://habr.com/ru/post/354468/
---
Типичный юзкейс для Kibana - смотрим логи, видим ошибки, создаем тикеты по ним. Логов у нас довольно много, места для их хранения мало. Поэтому просто вставить ссылку на документ из Elasticsearch/Kibana недостаточно, особенно для низкоприоритетных задач: пока доберемся до нее, индекс с логом может быть уже удален. Соответственно, приходится документ сохранять в файл и прикреплять к тикету.

Если один раз это делать, то это еще куда ни шло, но создавать уже десять тикетов подряд будет тупо лень, поэтому я решил это "быстренько" (ха-ха) автоматизировать.

<img src="/assets/images/habr_because_its_awesome.png" align = "center"/>
<br>
Под катом: статья для пятницы, экспериментальная фича javascript, пара грязных хаков, небольшая регулярка с галочками, reverse proxy, проигрыш безопасности удобству, костыли и очевидная картинка из xkcd.
<cut text="Поехали!" />
<b>Предупреждаю</b>: я далеко не специалист в web-технологиях, и поэтому специалистам, скорее всего, покажутся мои проблемы очень очевидными, а решения - тупыми. Но это не продакшн-решение, а просто мелкий скрипт "для своих". Все происходит в доверенной локальной сети и поэтому скрипт имеет много проблем с безопасностью.

<h2>Варианты решения</h2>
Сходу можно придумать достаточно много решений проблемы. Во-первых, можно пихать сразу все логи в RM (внезапно, для этого даже есть <a href="https://www.elastic.co/guide/en/logstash/current/plugins-outputs-redmine.html">плагин logstash</a>), предварительно их фильтруя/агрегируя - знай себе меняй описание да исполнителя. Это, конечно, прикольно, но надо будет долго отлаживать/настраивать и появится много новой рутинной работы - давать описания/удалять лишнее. 

Второй вариант - намастрячить какой-нибудь скрипт, который получает ссылки на логи, скачивает их, спрашивает дополнительные параметры у пользователя и через API Redmine создает новый тикет. Но к этому надо будет нормальный интерфейс пилить, да и дублировать часть функций RM…

Можно извратиться и сделать кликер или с помощью selenium подготовить тикет, чтобы потом в привычном интерфейсе дозаполнить что надо, но нельзя будет трогать мышку… Да и редактирование может вдруг понадобиться.

Плагин для браузера? Окститесь, его еще регистрировать и поддерживать, да еще хотя бы под два браузера делать.

Плагин Redmine? Не, это ж API надо будет изучать, да и лезть в кишки RM… Простого дополнительного поля недостаточно будет.

В итоге приходим к букмарклету (выполнению javascript из закладок) и/или пользовательскому скрипту (greasemonkey/tampermonkey и т.п.) - javascript‘ом вроде можно и интерфейс нарисовать, и логи скачать через ajax-запрос, да и вообще почти все что угодно со страницей сделать.

<h2>Загрузка файлов</h2>
Пока самая неясная часть - это загрузка файлов. Все остальное вроде можно легко сделать… За загрузку файлов на странице создания тикета RM отвечает обычный <code>&lt;input type="file"&gt;</code>, при изменении которого вызывается функция <code>addInputFiles(this)</code>.

По идее, надо всего лишь изменить список файлов у этого элемента и дернуть этот метод. Есть только одна мааааленькая <a href="https://stackoverflow.com/questions/5632629/how-to-change-the-file-inputs-filelist">проблема</a>:

<img src="/assets/images/habr_one_does_not_simply_filelist.jpeg" />
<br>
Сделано это ради того, чтобы нельзя было отправить на сервер <code>/etc/passwd</code>, <code>/etc/shadow/</code> или фото вашего кота с рабочего стола. В принципе, разумно, но надо это как-то обойти. Впрочем, если нельзя, но очень хочется, то можно заиспользовать такой грязный хак, который основан экспериментальной фиче - <a href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API">Clipboard API</a>.

```javascript
function createFileList(files){
    const dt = new ClipboardEvent("").clipboardData || new DataTransfer();
    for (let file of files) {
        dt.items.add(file);
    }
    return dt.files;
}
```
Т.е. тут имитируется добавление файлов из буфера обмена, которые мы потом получаем списком. Сам по себе "файл" из текста создается элементарно:

```javascript
function createFile(text, fileName){
    let blob = new Blob([text], {type: 'text/plain'});
    let file = new File([blob], fileName);
    return file;
}
```
<h2>Пользовательский интерфейс</h2>
Тут все просто, как топор: делаем в нужном месте надпись, поле ввода и кнопку загрузки. Поскольку делается "для своих" с форматом ввода (и его валидацией) особо не стал заморачиваться - пусть будет текстовое поле, одна строка - один лог (ссылка и имя создаваемого файла через пробел).

Для букмарклета еще пригодилось предварительное удаление себя по id.

{% capture spoiler_content %}
```javascript
function removeSelf(){
    let old = document.getElementById(ui_id);
    if (old != null) old.remove();
}

function createUi(){
    removeSelf();

    let ui = document.createElement('p');
    ui.id = ui_id;

    let label = document.createElement('label');
    label.innerHTML = "Logs data:";
    ui.appendChild(label);

    let textarea = document.createElement('textarea');
    textarea.id = data_id;
    textarea.cols = 60;
    textarea.rows = 10;
    textarea.name = "issue[logs_data]";
    ui.appendChild(textarea);

    let button = document.createElement('button');
    button.type = "button";
    button.onclick = addLogsData;
    button.innerHTML = "Add logs data";
    ui.appendChild(button);

    let attributesBlock = document.querySelector("#attributes");
    attributesBlock.parentNode.insertBefore(ui, attributesBlock);
}
```
{% endcapture %}
{% include spoiler.html title="Элементарные вещи" content=spoiler_content %}

<h2>Основная работа</h2>
Здесь тоже все просто: разбиваем текст из поля ввода на пары "ссылка"-"имя файла", скачиваем все из эластика, потому что Kibana так просто данные не отдаст, заливаем на RM, изменяем описание тикета и все. Благо к RM уже подключен jquery и ajax-запросы легко создаются.

{% capture spoiler_content %}
```javascript
function addLogsData(){
    let text = document.getElementById(data_id).value;
    let lines = text.split('\n');
    let urlsAndNames = lines
        .filter(x => x.length > 2)
        .map(line => line.split(/\s+/, 2));
    downloadUrlsToFiles(urlsAndNames);
}

const kibana_pattern = /http:\/\/([^:]*):\d+\/app\/kibana#\/doc\/[^\/]*\/([^\/]*)\/([^\/]*)\/?\?id=(.*?)(&.*)?$/;
const es_pattern = 'http://$1:9200/$2/$3/$4';

function downloadUrlsToFiles(urlsAndNames){
    let requests = urlsAndNames.map((splitted) => {
        let url = splitted[0].replace(kibana_pattern, es_pattern);
        return $.ajax({
            url: url,
            dataType: 'json'
        });
    });
    $.when(...requests).done(function(...responses){
        let files = responses.map((responseRaw, index) => {
            let response = responseRaw[0];
            checkError(response);
            let fileName = urlsAndNames[index][1];
            return createFile(JSON.stringify(response._source), fileName + '.json');
        });
        uploadFiles(files, urlsAndNames);
    }).fail((error) => {
        let errorString = JSON.stringify(error);
        alert(errorString);
        throw errorString;
    });
}

function uploadFiles(files, urlsAndNames){
    pseudoUpload(files);

    changeDescription(urlsAndNames);
    removeSelf();
}
```
{% endcapture %}
{% include spoiler.html title="Скучный код, регулярку искать здесь" content=spoiler_content %}
Отлично, все готово! Делаем тестовый запуск и…

<img src="/assets/images/habr_mixed_content_blocking.png" />

<h2>Безопасность</h2>
Для тех кто не в курсе, запрашивать http-данные, находясь на https ресурсе, - очень плохо, потому что вам могут подпихнуть левые данные через MITM атаку. Более того, какой-нибудь Firefox даже если вам и разрешит это сделать, просить у него разрешение надо будет каждый раз - и белого списка <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=873349">никогда не будет</a>. Это все правильно и хорошо с точки зрения пользователя, но для скрипта на коленке это только палки в колеса.

Что ж, покупать <a href="https://www.elastic.co/products/x-pack/security">X-Pack</a> для Elasticsearch ради вшивого скрипта не хочется, поэтому придется сделать прокси https -> http. Он же reverse proxy. Вариантов тут достаточно много, от монструозного squid до питонячего скрипта. Самым подходящим мне показался haproxy - он и прост в настройке/установке, и ресурсы не жрет.

Достаточно лишь сгенерить самоподписанный сертификат (прости, let‘s encrypt, но мы в траст-зоне)

```bash
openssl genrsa -out dummy.key 1024
openssl req -new -key dummy.key -out dummy.csr
openssl x509 -req -days 3650 -in dummy.csr -signkey dummy.key -out dummy.crt
cat dummy.crt dummy.key > dummy.pem
```
и, собственно, настроить haproxy:

```
frontend https-in
    mode tcp
    bind *:9243 ssl crt /etc/ssl/localcerts/dummy.pem alpn http/1.1
    http-response set-header Strict-Transport-Security "max-age=16000000; includeSubDomains; preload;"
    default_backend nodes-http

backend nodes-http
    server node1 localhost:9200 check
```
Теперь на порту 9243 будет прозрачная прокси до эластика (соответственно, меняем порт в регулярке и добавляем https).

Однако и это не удовлетворит наш браузер, который печется о безопасности пользователя. На этот раз проблема в том, что нельзя запрашивать данные с другого домена, если он это не разрешил. Решается это с помощью <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">механизма CORS</a>. Хорошо хоть, что Elasticsearch это <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-http.html">сам умеет</a>:

```yaml
http.cors.allow-headers: X-Requested-With, Content-Type, Content-Length
http.cors.allow-origin: "/.*/"
http.cors.enabled: true
```
<h2>Userscript</h2>
Напомню, что мы все еще <s>втирали</s> делали эту дичь в формате букмарклета. В принципе, ничего страшного, но кому-то даже лишний раз кликнуть лень (например, мне). Поэтому будем делать userscript. Тут заодно встает проблема его обновления (делаем-то на века!). Поэтому воспользуемся <s>механизмом обновления юзерскриптов</s> кого я обманываю, конечно, очередным костылем:

```javascript
// ==UserScript==
// @name     KIBANA_LOGS
// @grant    none
// @include  https://<rm-address>/*issues*
// ==/UserScript==
(function(){document.body.appendChild(document.createElement('script')).src='https://<kibana-address>:4443/kibana_logs_rm.js';})();
```
Зато и в букмарклетах у параноиков будет обновляться. Для раздачи этой фигни нам понадобится https-сервер. Тут я уже откровенно заленился и взял <a href="https://gist.github.com/dergachev/7028596">первый попавшийся</a> (да еще и на python 2.7) \*посыпаю голову пеплом\*:

```python
import BaseHTTPServer, SimpleHTTPServer
import ssl

httpd = BaseHTTPServer.HTTPServer(('0.0.0.0', 4443), 
                    SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile='/etc/ssl/localcerts/dummy.pem',
                            server_side=True)
httpd.serve_forever()
```
Вот теперь пользователям осталось только создать юзерскрипт/букмарклет, добавить в исключения сертификат и все будет работать.

<h2>Пара багов</h2>
Суть первой проблемы заключается в следующем: когда нужно обработать результаты сразу нескольких ajax-запросов, в функцию передается столько аргументов, сколько было запросов. Но когда запрос один, jquery "любезно" его раскрывает в <a href="https://api.jquery.com/jQuery.when/">три аргумента</a>. Поэтому пришлось писать такой костыль:

```javascript
let responses;
if (requests.length == 1){
    responses = [arguments];
} else {
    responses = Array.from(arguments);
}
```
Второй баг связан с тем, что при смене трекера или при смене статуса заявки Redmine сохраняет все введенные данные, запрашивает новый интерфейс (прямо html cо встроенным js), пересоздает интерфейс и перезаполняет поля с помощью функции <code>replaceIssueFormWith</code>. Звучит немного дико, но это сделано для реализации workflow (а там на разных стадиях поля для ввода потенциально могут отличаться). Тут тоже пришлось сделать <s>костыль</s> ad-hoc решение:

```javascript
function installReplaceHook(){
    let original = window.replaceIssueFormWith;
    window.replaceIssueFormWith = function(html){
        let logs_data = document.getElementById(data_id).value;
        let ret = original(html);
        createUi();
        document.getElementById(data_id).value = logs_data;
        return ret;
   };
}
```
Т.е. просто делаем хук на оригинальную функцию и делаем аналогичные ей действия для своего поля.

<h2>Заключение</h2>
Полную версию скрипта можно посмотреть в моем <a href="https://gist.github.com/ov7a/aa5b3aca246b575165db34cb77d712d9">gist</a>. Вот картинка, которую должно большинство ожидать к концу этой статьи:

<img src="/assets/images/habr_xkcd_automatization.png" />

А вообще автоматизировать вещи - весело и полезно, и позволяет изучить что-то новое в другой области. Пользователи скрипта довольны, создание тикетов по логам в кибане теперь не так сильно напрягает.
