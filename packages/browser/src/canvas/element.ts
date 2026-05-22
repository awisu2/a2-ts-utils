// create canvas for risize Image

import { getSizeBySource } from "./utils";

// CanvasImageSource: HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, ImageBitmap, OffscreenCanvas, SVGImageElement, VideoFrame etc.
export const getCanvas2dBySource = (
  src: CanvasImageSource,
  size?: { width: number; height: number },
): HTMLCanvasElement => {
  let _size = size ?? getSizeBySource(src);

  // get canvas =====
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(_size.width);
  canvas.height = Math.floor(_size.height);

  // get 2d context =====
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // draw/resize =====
  // 引数が 5つの場合 元データの全範囲を, canvasの指定した範囲に貼り付ける
  // 引数が 9つの場合 最初の4引数の範囲で 元データを切り取り 残りの4引数の範囲で canvasに貼り付ける
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);

  return canvas;
};

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  // remove from parent
  if (canvas.parentNode) {
    canvas.remove();
  }

  // reset 2d context
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.beginPath();
  }

  // clear buffer from memory
  canvas.width = 0;
  canvas.height = 0;
};
