# 👷 `rsshub in cloudflare worker`


## 功能描述

在cloudflare worker中复刻rsshub功能

## 当前状态

v.0.1.0 beta 版

请求指定格式的rss，返回json数据。缓存请求结果和请求时间，处理短时间多次请求以及无最新数据的情况。

```
/jiandan/article
/jiandan/:sub_model
```

## TODO

+ 受限于cloudflare worker环境的`CSP`，需不借助`new Function`和`eval`实现模版引擎，参考vue
+ 逻辑拆分 
+ github workflow 脚本添加
