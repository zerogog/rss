# 👷 `rsshub in cloudflare worker`

A simple copy of `rsshub`. just for learning worker.

## problem

Beacuse of executed limit in cf wrokers and low quering about cheeio, maybe my bad `china net` also, Error 1102 is common thing i get.

## routes support

- `/rss/jiandan/article`
- `/rss/jiandan/:sub_model`

## todo

- Find some way to speed up process about `parse string` and `query html`. Is `HTMLRewriter` a better choice ?
