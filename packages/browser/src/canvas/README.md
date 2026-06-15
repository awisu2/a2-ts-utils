# canvas

## contents

- 画像のリサイズ及び映像ファイルからの画像取得について

## 画像のリサイズ及び映像ファイルからの画像取得について

簡易まとめ

- canvasを利用すると、画像を直接扱うことが可能
- 変換の流れ: Canvas <-> CanvasImageSource <-> Blob <-> Uint8Array
  - CanvasImageSource: HTMLImageElement, SVGImageElement, HTMLVideoElement, HTMLCanvasElement, ImageBitmap, OffscreenCanvas. VideoFrame
- リサイズ: canvasへ取り込む際にsize指定しておくことでリサイズが行われる

詳細は別途 mynote に記載
