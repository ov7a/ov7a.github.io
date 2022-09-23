---
layout: post
title: Потребление ресурсов в k8s
tags: [k8s, cli]
---
Хотелось бы конечно иметь бесконечный кластер, но, увы, за расходами все равно следить надо.
```sh
kubectl get nodes --no-headers | cut -f1 -d\  | xargs -I {} sh -c 'echo {} ; kubectl describe node {} | grep Allocated -A 5 | grep -ve percent -ve -- ; echo '
```
Выведет потребление в формате
```
ip-1-2-3-4.some.host.cluster
  Resource                    Requests      Limits
  cpu                         1610m (83%)   3450m (178%)
  memory                      2566Mi (35%)  5478Mi (76%)
```

