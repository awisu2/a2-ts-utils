# history

## 26-05

- 05-03(sun)
  - added ConcurentRunnner
  - added Queue
- 05-01(fri)
  - DataObserverを追加
    - subscribe時に値を返却しない、シンプルな更新通知
  - KeyMapでcloneがしやすいように関数追加

## 26-04

- 04-30(thu)
  - KeyMapを追加
    - また、内部の map に直接アクセスさせる式だと実際利用する際に混乱するので、基本関数や必要な関数を追加
  - DatasDebouncer (一定時間内複数データコールを一度の実行にまとめる) を追加
    - debounce は bounce(飛び跳ね) を de (抑える) という意味の造語
- 04-29(wed)
  - ImageMimeType を追加
  - 画像用の関数やtypeを追加
    - getFitSize, Size など
