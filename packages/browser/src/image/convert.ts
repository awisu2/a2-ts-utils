import { Size, ImageMimeType } from "@a2-ts-utils/common/type";
import {
  blobToBytesAsync,
  elementToCanvas2d,
  getBlobAsync,
} from "../canvas/convert";
import { bytesToBase64 } from "@a2-ts-utils/common/byte";

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

export function bytesToBase64Src(
  bytes: Uint8Array,
  type: ImageMimeType = ImageMimeType.JPEG,
): string {
  const base64String = bytesToBase64(bytes);
  return `data:${type};base64,${base64String}`;
}
