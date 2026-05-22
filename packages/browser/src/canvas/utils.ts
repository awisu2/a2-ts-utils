// get size from CanvasImageSource

import { getBlobByBytes } from "./getBlob";

// CanvasImageSource: HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, ImageBitmap, OffscreenCanvas, SVGImageElement, VideoFrame etc.
export const getSizeBySource = (
  src: CanvasImageSource,
): { width: number; height: number } => {
  if (src instanceof HTMLVideoElement) {
    return { width: src.videoWidth, height: src.videoHeight };
  }
  if (src instanceof SVGImageElement) {
    return { width: src.width.baseVal.value, height: src.height.baseVal.value };
  }
  if (src instanceof VideoFrame) {
    return { width: src.displayWidth, height: src.displayHeight };
  }
  return { width: src.width, height: src.height };
};

export const getSourceAsync = async (
  data: Blob | Uint8Array,
): Promise<CanvasImageSource | undefined> => {
  if (data instanceof Blob) {
    return await createImageBitmap(data);
  }

  if (data instanceof Uint8Array) {
    const blob = getBlobByBytes(data);
    if (!blob) {
      return undefined;
    }
    return await getSourceAsync(blob);
  }
};
