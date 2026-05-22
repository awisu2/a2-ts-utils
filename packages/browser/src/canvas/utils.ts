// get size from CanvasImageSource

import { getBlobAsync } from "./getBlob";

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
  if (src instanceof HTMLImageElement) {
    return { width: src.naturalWidth, height: src.naturalHeight };
  }
  return { width: src.width, height: src.height };
};

export const getSourceAsync = async (
  data: Blob | Uint8Array,
): Promise<CanvasImageSource> => {
  if (data instanceof Blob) {
    return await getSourceByBlobAsync(data);
  }
  return await getSourceByBytesAsync(data);
};

const getSourceByBlobAsync = async (data: Blob): Promise<CanvasImageSource> => {
  return await createImageBitmap(data);
};

const getSourceByBytesAsync = async (
  data: Uint8Array,
): Promise<CanvasImageSource> => {
  const blob = await getBlobAsync(data);
  return await getSourceByBlobAsync(blob);
};
