---
layout: post
title: Миграция approle между двумя Vault-хранилищами
tags: [vault]
---
Секреты смигрировать много ума не надо — это практически key-value хранилище. А вот с ролями приложений (которые представляют собой пару `role_id` + `secret_id` и по сути мало отличаются от логина-пароля) сложнее. Нельзя просто так взять и записать
```bash
vault write /auth/approle/role/ROLE_NAME role_id=SOME_UUID secret_id=WANTED_UUID
```
— параметр `secret_id` будет проигнорирован. Т.е.
```bash
vault read /auth/approle/role/ROLE_NAME/role-id
```
вернет нужный `role_id`, а вот
```bash
vault list /auth/approle/role/ROLE_NAME/secret-id
```
вернет ошибку, т.к. `secret_id` не был создан. Причем нужный `secret_id` не получится прописать, только сгенерировать новый через
```bash
vault write /auth/approle/role/ROLE_NAME/secret-id
```

Но [есть способ](https://www.vaultproject.io/api/auth/approle#create-custom-approle-secret-id) это обойти — создать `custom-secret-id`.
```bash
write /auth/approle/role/ROLE_NAME/custom-secret-id secret_id=WANTED_UUID
```
Для приложения все будет работать "как раньше", роль/секрет ему можно не менять.

Вообще говоря, это [не очень хороший подход](https://www.vaultproject.io/docs/auth/approle#pull-and-push-secretid-modes), правильнее и безопаснее будет сгенерировать новый `secret_id` и прокидывать его приложению вместо этой чехарды. Но прокидывание роли контролирует обычно CI/CD (иначе зачем нужна вообще эта безопасность), а там две роли сразу (старую и новую) для всех фиче-веток не прокинешь. Дешевле на время переходного периода мигрировать старую роль приложения, а после окончания миграции — удалить ее.

