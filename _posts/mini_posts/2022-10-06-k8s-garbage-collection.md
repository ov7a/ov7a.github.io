---
layout: post
title: Приборка подов в k8s
tags: [k8s]
tg_id: 340
---
Поды, завершившиеся с ошибкой, могут [висеть в кубере](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection) до посинения ([тикет](https://github.com/kubernetes/kubernetes/issues/99986)). 

Чтобы почистить все руками, можно выполнить что-то вроде такого:
```
kubectl -n namespace delete pods --field-selector=status.phase=Failed
```

Хотя, конечно, лучше разобраться с первопричиной падения подов:) 


