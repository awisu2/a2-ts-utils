import { ImageMimeType, Size } from "@a2-ts-utils/common/type";
import { getElementSize, getSize as getSizeImage } from "../image/image";

// elementからCanvasを取得
// newSizeを指定した場合は、Canvasのサイズを変更して描画する
export function elementToCanvas2d(
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  newSize?: Size,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  const _size = newSize ?? getElementSize(element);
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
}

// Blob: Binary Large Object
// canvas > Blob > buffer > Uint8Array
export function getBlobAsync(
  canvas: HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
): Promise<Blob> {
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
}

export async function blobToBytesAsync(blob: Blob): Promise<Uint8Array> {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function getBytesAsync(
  canvas: HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
): Promise<Uint8Array> {
  const blob = await getBlobAsync(canvas, type);
  return blobToBytesAsync(blob);
}
