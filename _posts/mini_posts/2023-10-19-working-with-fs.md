---
layout: post
title: Работа с файловой системой
tags: [fs, linux, иб, java, encoding]
---
Подобно тому, как стоит избегать писать свои реализации всякой криптографии и делать что-то [со временем](/2020/04/10/working-with-time.html), есть еще одна область в которую лучше не лезть: работа с символическими ссылками и файловой системой вообще.

Правильно реализовать работу с символическими ссылками — довольно нетривиальная задача. Хорошую презентацию по этому поводу можно посмотреть [тут](https://sambaxp.org/fileadmin/user_upload/sambaxp2022-Slides/Allison-Symlinks_considered_harmful.pdf). Если вкратце, то ссылки могут меняться между системными вызовами, что открывает массу возможностей для повышения привилегий из-за того, что их проверка и действие над ссылкой происходит неатомарно. Даже в системных вызовах Linux не смогли поправить это с первого и даже со второго раза. 

А еще символические ссылки ломают иерархию (и связанные с ней проверки) — например, путь с `..` уже нельзя нормализовать без запроса к файловой системе. А еще ссылка может ссылаться на другую ссылку, и эти случаи в два раза веселее обрабатывать.

В добавок к этому, я недавно нашел интересное поведение в java. Если создать папку, содержащую юникодные символы, то ее имя [по-разному](https://gist.github.com/ov7a/c971dfe516f1beb11db847faea44ca57) будет [нормализовано](/2023/06/08/utf-8-nfd-nfc.html) в зависимости от того, был ли использован метод `Files.createDirectory` или `File.mkdir`. Это приводит к тому, что оригинальный путь не совпадает с "реальным" путем к файлу, который только что был создан по этому пути:

```java
package test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.Callable;
import java.util.function.Consumer;
import java.util.function.Function;


public class App {

    @FunctionalInterface
    public interface Action {
        void apply(Path path) throws IOException;
    }

    public static void main(String[] args) throws IOException {
        check("createDirectory", Files::createDirectory);
        check("mkdir", x -> x.toFile().mkdir());
    }

    private static void check(String hint, Action createDir) throws IOException {
        String name = "teŝt files";
        Path root = Path.of(name).toAbsolutePath();
        Path file = root.resolve("file1");

        Files.deleteIfExists(file);
        Files.deleteIfExists(root);
        createDir.apply(root);
        Files.createFile(file);

        Path alternative = file.toRealPath();

        System.out.printf("%s - Equals: %s, isSameFile: %s\n", hint, file.equals(alternative), Files.isSameFile(file, alternative));
    }
}
```
Вывод:
```
createDirectory - Equals: true, isSameFile: true
mkdir - Equals: false, isSameFile: true
```

