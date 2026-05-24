# history

## 26-05

- 05-18(mon)
  - add `normalizePath()` `getSetInterval`
- 05-16(sat)
  - add KeyMapUtil.ts
- 05-06(wed)
  - logにF付きの関数を追加
    - prefixedLogのprefixを複数指定可能に対応
- 05-05(tue)
  - loggerの実装を修正
    - 毎回 logレベルチェックしているのを、事前にチェック済みのものを参照するように変更
    - prefixedLog() を追加してみた
    - Fをつけて強制出力はやめた。一時的でいいならログレベルを上げればいい
      - [] 追加するにしても logF ではなく log.infoF としたい
- 05-04(mon)
  - added simple log, glog, Logger
  - added log.ts and groupLog.ts
    - for simple logging
  - removed namespace
- 05-03(sun)
  - KeyMap added has() and hasData()
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
