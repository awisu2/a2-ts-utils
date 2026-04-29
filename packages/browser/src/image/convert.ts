import { Size, ImageMimeType } from "@a2-ts-utils/common/type";
import {
  blobToBytesAsync,
  elementToCanvas2d,
  getBlobAsync,
} from "../canvas/convert";

export function getElementImageBlobAsync(
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize?: Size,
): Promise<Blob> {
  const canvas = elementToCanvas2d(element, newSize);
  return getBlobAsync(canvas, type);
}

export async function getElementImageBytesAsync(
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize?: Size,
): Promise<Uint8Array> {
  var blob = await getBlobAsync(elementToCanvas2d(element, newSize), type);
  return blobToBytesAsync(blob);
}
