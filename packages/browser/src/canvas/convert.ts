import { getElementSize, getSize as getSizeImage } from "../image/utils";
import { Size } from "@a2-ts-utils/common/type";

// elementからCanvasを取得
// newSizeを指定した場合は、Canvasのサイズを変更して描画する
export function elementToCanvas(
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  newSize?: Size,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  if (newSize) {
    canvas.width = newSize.width;
    canvas.height = newSize.height;
  } else {
    const size = getElementSize(element);
    canvas.width = size.width;
    canvas.height = size.height;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

  return canvas;
}

export const ToDataUrlType = {
  JPEG: "image/jpeg",
  PNG: "image/png",
  WEBP: "image/webp",
  AVIF: "image/avif",
} as const;
export type ToDataUrlType = (typeof ToDataUrlType)[keyof typeof ToDataUrlType];

export async function getBytes(
  canvas: HTMLCanvasElement,
  newType: ToDataUrlType,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create blob"));
        return;
      }
      blob.arrayBuffer().then((buffer) => {
        resolve(new Uint8Array(buffer));
      });
    }, newType);
  });
}
