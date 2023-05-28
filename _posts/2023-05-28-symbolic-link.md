---
layout: post
title: Что внутри у мягкой ссылки
tags: [linux, fs, tutorial]
hidden: true
---
На примере ext4. Краткая справка: с каждым логическим файлом ассоциирован inode, который хранит его [метаданные](https://ext4.wiki.kernel.org/index.php/Ext4_Disk_Layout#Inode_Table): права доступа, атрибуты, указатели на блоки с данными и т.п. 

Признак того, что файл является символической ссылкой, хранится поле `mode` в inode: у обычных файлов это `010xxxx` (в 8-ричной системе; `xxxx` — это unix-права вместе со sticky битом), а у символических ссылок — `012xxxx`. А путь ссылки хранится в данных. Т.е. ссылка — это просто текстовый файл, у которого выставлен специальный флаг.

Но есть нюанс. Подобные ссылки будут не очень быстрыми, т.к. надо сначала прочитать метаданные, а потом пройти по указателям на блоки и прочитать собственно путь. Поэтому придумали оптимизацию, чтобы хранить путь прямо в метаданных, если он достаточно короткий (меньше 60 символов). Подобное можно применить и к обычным маленьким файлам, если файловая система была создана с флагом `inline_data`.

Перейдем к практике.

![](/assets/gags/2023-05-28-symbolic_link.png)

Для безопасного эксперимента можно воспользоваться утилитой [debugfs](https://man7.org/linux/man-pages/man8/debugfs.8.html). Создадим файл с ФС:
```sh
dd if=/dev/zero of=ext4.img bs=1M count=100
mkfs.ext4 ext4.img -O inline_data
mkdir mnt
sudo mount ext4.img mnt
```
Заполним данными
```sh
sudo echo -n "some text" | sudo tee mnt/original.txt
sudo ln -s original.txt mnt/short_link
sudo ln -s very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_long mnt/long_link
sudo echo -n "original.txt" | sudo tee mnt/manual_link
```
Получили такое в `ls -lF mnt`:
```
lrwxrwxrwx 1 long_link -> very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_long
drwx------ 2 lost+found/
-rw-r--r-- 1 manual_link
-rw-r--r-- 1 original.txt
lrwxrwxrwx 1 short_link -> original.txt
```
Отмонтируем ФС и откроем `debugfs`:
```sh
sudo umount mnt
debugfs -w ext4.img
```
Начнем с простого — с длинной ссылки. Ей достаточно поменять `mode`:
```
debug_fs: mi long_link
  Mode    [0120777] 0100777
  ...
```
У короткой ссылки надо поменять `mode`, выставить флаг того, что файл содержит данные в метаданных и добавить расширенный атрибут, что это именно данные:
```
debugfs:  mi short_link
  Mode    [0120777] 0100777
  ...
  File flags    [0x0] 0x10000000
  ...
  
debugfs:  ea_set short_link system.data 0 
```
Наконец, превратим текстовый файл в ссылку:
```
debugfs:  mi manual_link
  Mode    [0100644] 0120777
  ...
  File flags    [0x10000000] 0x0
  ...
```
Сохраняем с помощью <kbd>Ctrl</kbd> + <kbd>D</kbd> и монтируем `sudo mount ext4.img mnt`. Вывод `ls -lF mnt`:
```
-rwxrwxrwx long_link*
drwx------ lost+found/
lrwxrwxrwx manual_link -> original.txt
-rw-r--r-- original.txt
-rwxrwxrwx short_link*
```
Содержимое ссылок:
```sh
$ cat mnt/long_link; echo
very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_long
$ cat mnt/short_link; echo
original.txt
$ readlink mnt/manual_link 
original.txt
$ cat mnt/manual_link; echo
some text
```
Теперь вы знаете простой способ, как сделать символическую ссылку :)
![](/assets/images/symbolic_link.png)

