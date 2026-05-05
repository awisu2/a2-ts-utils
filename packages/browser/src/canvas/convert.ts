import { ImageMimeType, Size } from "@a2-ts-utils/common/type";
import { getSizeFromElement } from "../image/image";

// elementからCanvasを取得
// newSizeを指定した場合は、Canvasのサイズを変更して描画する
export const getCanvas2dFromElement = (
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  newSize?: Size,
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");

  const _size = newSize ?? getSizeFromElement(element);
  canvas.width = Math.floor(_size.width);
  canvas.height = Math.floor(_size.height);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  return canvas;
};

export const intoElementToCanvas2d = getCanvas2dFromElement;

// Blob: Binary Large Object
// canvas > Blob > buffer > Uint8Array
export const getBlobFromCanvasAsync = (
  canvas: HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      blob
        ? resolve(blob)
        : reject(
            new Error(
              'Failed to create blob. may need crossOrigin="anonymous"',
            ),
          );
    }, type);
  });
};

export const intoCanvasToBlobAsync = getBlobFromCanvasAsync;

export const getBytesFromBlobAsync = async (
  blob: Blob,
): Promise<Uint8Array> => {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
};

export const intoBlobToBytesAsync = getBytesFromBlobAsync;

export const getBytesFromCanvasElementAsync = async (
  canvas: HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
): Promise<Uint8Array> => {
  const blob = await getBlobFromCanvasAsync(canvas, type);
  return getBytesFromBlobAsync(blob);
};

export const intoCanvasElementToBytesAsync = getBytesFromCanvasElementAsync;
