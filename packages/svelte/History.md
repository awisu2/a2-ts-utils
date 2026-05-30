# History

## 26-05

- 05-30(sat)
  - packageを 先頭の index のみに統一 (利用時に不明な分散が多いため)
- 05-26(tue)
  - add vervose to Video.svelte
- 05-24
  - add LazyActive

## 26-04

- 04-28
  - Image.svelteの拡張方法を onload, onerror など通常のelementの関数に合わせた
  - Video.svelteを追加
  - Image.svelte
    - moduleにsubscribeを追加
    - Propsなどをexport化
    - image.tsを追加しmodule部分を分離。exportしたものを解決できるように対応
