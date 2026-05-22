// resize by CanvasImageSource

import { getFitSize } from "@a2-ts-utils/common/image";
import { clearCanvas, getCanvas2dBySource } from "./element";
import { getSizeBySource } from "./utils";
import { getBlobAsync } from "./getBlob";

// CanvasImageSource: HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, ImageBitmap, OffscreenCanvas, SVGImageElement, VideoFrame etc.
export const resizeBySourceAsync = async (
  src: CanvasImageSource,
  type: string = "image/png",
  newSize?: { width: number; height: number },
) => {
  const canvas = getCanvas2dBySource(src, newSize);
  try {
    return await getBlobAsync(canvas, type);
  } finally {
    clearCanvas(canvas);
  }
};

export const resizeFitBySourceAsync = async (
  source: CanvasImageSource,
  type: string = "image/png",
  maxSize: { width: number; height: number },
) => {
  const size = getSizeBySource(source);
  const fitSize = getFitSize(size, maxSize);
  return await resizeBySourceAsync(source, type, fitSize);
};
