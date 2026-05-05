import { Size, ImageMimeType } from "@a2-ts-utils/common/type";
import {
  getBytesFromBlobAsync,
  getCanvas2dFromElement,
  getBlobFromCanvasAsync,
} from "../canvas/convert";
import { bytesToBase64 } from "@a2-ts-utils/common/byte";

//
export const getBlobFromElementAsync = (
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize?: Size,
): Promise<Blob> => {
  const canvas = getCanvas2dFromElement(element, newSize);
  return getBlobFromCanvasAsync(canvas, type);
};

export const intoElementToBlobAsync = getBlobFromElementAsync;

export const getBytesFromElementAsync = async (
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize?: Size,
): Promise<Uint8Array> => {
  var blob = await getBlobFromElementAsync(element, type, newSize);
  return getBytesFromBlobAsync(blob);
};

export const intoElementToBytesAsync = getBytesFromElementAsync;

export const getBase64SrcFromBytes = (
  bytes: Uint8Array,
  type: ImageMimeType = ImageMimeType.JPEG,
): string => {
  const base64String = bytesToBase64(bytes);
  return `data:${type};base64,${base64String}`;
};

export const intoBytesToBase64Src = getBase64SrcFromBytes;
