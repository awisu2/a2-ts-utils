# history

## 26-05

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
