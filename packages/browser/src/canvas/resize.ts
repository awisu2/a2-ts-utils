// resize by CanvasImageSource

import { getFitSize } from "@a2-ts-utils/common/image";
import { clearCanvas, getCanvas2dBySource } from "./element";
import { getSizeBySource, getSourceAsync } from "./utils";
import { getBlobAsync } from "./getBlob";

// CanvasImageSource: HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, ImageBitmap, OffscreenCanvas, SVGImageElement, VideoFrame etc.
export const resizeAsync = async (
  source: CanvasImageSource | Blob | Uint8Array,
  type: string = "image/png",
  newSize?: { width: number; height: number },
) => {
  if (source instanceof Blob || source instanceof Uint8Array) {
    source = await getSourceAsync(source);
  }

  const canvas = getCanvas2dBySource(source, newSize);
  try {
    return await getBlobAsync(canvas, type);
  } finally {
    clearCanvas(canvas);
  }
};

export const resizeFitBySourceAsync = async (
  source: CanvasImageSource | Blob | Uint8Array,
  type: string = "image/png",
  maxSize: { width: number; height: number },
) => {
  if (source instanceof Blob || source instanceof Uint8Array) {
    source = await getSourceAsync(source);
  }
  const size = getSizeBySource(source);
  const fitSize = getFitSize(size, maxSize);
  return await resizeAsync(source, type, fitSize);
};
