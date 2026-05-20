import { Size, ImageMimeType } from "@a2-ts-utils/common/type";
import {
  getBytesFromBlobAsync,
  getCanvas2dFromElement,
  getBlobFromCanvasAsync,
} from "../canvas/convert";
import { bytesToBase64 } from "@a2-ts-utils/common/byte";
import { getImageElementAsync } from "./image";

// element > blob =====
export const getBlobFromElementAsync = (
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize?: Size,
): Promise<Blob> => {
  const canvas = getCanvas2dFromElement(element, newSize);
  return getBlobFromCanvasAsync(canvas, type);
};

export const intoElementToBlobAsync = getBlobFromElementAsync;

// element (> blob) > bytes =====
export const getBytesFromElementAsync = async (
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize?: Size,
): Promise<Uint8Array> => {
  var blob = await getBlobFromElementAsync(element, type, newSize);
  return getBytesFromBlobAsync(blob);
};

export const intoElementToBytesAsync = getBytesFromElementAsync;

// bytes > base64 =====
export const getBase64SrcFromBytes = (
  bytes: Uint8Array,
  type: ImageMimeType = ImageMimeType.JPEG,
): string => {
  const base64String = bytesToBase64(bytes);
  return `data:${type};base64,${base64String}`;
};

export const intoBytesToBase64Src = getBase64SrcFromBytes;

// resize blob image
// mainly work with set canvas
export const resizeBlob = async (
  blob: Blob,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize: Size,
): Promise<Blob> => {
  const url = URL.createObjectURL(blob);
  try {
    const imageElement = await getImageElementAsync(url);
    return await getBlobFromElementAsync(imageElement, type, newSize);
  } finally {
    URL.revokeObjectURL(url);
  }
};

// resize bytes image
// bytes > blob > resizeBlob > blob
export const resizeBytes = async (
  bytes: Uint8Array,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize: Size,
): Promise<Blob> => {
  const blob = getBlobFromBytes(bytes);
  return await resizeBlob(blob, type, newSize);
};

// blob > element
export const getImageElementFromBlob = async (
  blob: Blob,
): Promise<HTMLImageElement> => {
  const url = URL.createObjectURL(blob);
  try {
    return await getImageElementAsync(url);
  } finally {
    URL.revokeObjectURL(url);
  }
};

export const getBlobFromBytes = (bytes: Uint8Array) => {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([arrayBuffer]);
};
