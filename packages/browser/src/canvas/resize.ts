// resize by CanvasImageSource

import { Bytes, getFitSize, isBytes } from "@a2-ts-utils/common";
import { clearCanvas, getCanvas2dBySource } from "./element";
import { getSizeBySource, getSourceAsync } from "./utils";
import { getBlobAsync } from "./getBlob";

// CanvasImageSource: HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, ImageBitmap, OffscreenCanvas, SVGImageElement, VideoFrame etc.
export const resizeAsync = async (
  source: CanvasImageSource | Blob | Bytes,
  type: string = "image/png",
  newSize?: { width: number; height: number },
) => {
  // get source =====
  if (source instanceof Blob || isBytes(source)) {
    source = await getSourceAsync(source);
  }

  // resize via canvas =====
  const canvas = getCanvas2dBySource(source, newSize);
  try {
    return await getBlobAsync(canvas, type);
  } finally {
    clearCanvas(canvas);
  }
};

// resize with fitting size
export const resizeFitAsync = async (
  source: CanvasImageSource | Blob | Bytes,
  type: string = "image/png",
  maxSize: { width: number; height: number },
) => {
  // get source =====
  if (source instanceof Blob || isBytes(source)) {
    source = await getSourceAsync(source);
  }

  // get fit size =====
  const size = getSizeBySource(source);
  const fitSize = getFitSize(size, maxSize);

  // resize =====
  return await resizeAsync(source, type, fitSize);
};
