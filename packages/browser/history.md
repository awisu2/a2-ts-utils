# history

## 26-06

- 06-02
  - added download `downloadToBlobWithRetryAsync`, `downloadToBlobAsync`

## 26-05

- 05-30(sat)
  - packageを 先頭の index のみに統一 (利用時に不明な分散が多いため)
- 05-27(wed)
  - listenMousuWheel で警告が出るため passive をセットできるように対応
- 05-24(sun)
  - add getValueByEvent, getNumbByEvent, getWheelDerection
  - add mouseEvent, keyEvent
- 05-20(wed)
  - add `resizeBlob`, `resizeBytes`
- 05-06(wed)
  - image, canvasのメソッド名を修正
    - getXXFromYYY, intoYYYToXXXという名前で統一することにした
    - 正直 intoは使わないけれど、両方あることで、名称の統一はしやすくなった

## 26-04

- 04-29(wed)
  - bytesToBase64Src を追加
  - VideoやImageのリサイズ処理を追加
  - 画像の変換処理を分割及びカスタマイズ
    - element > canvas > blob > buffer > bytes
