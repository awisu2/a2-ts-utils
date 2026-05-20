import { Size } from "@a2-ts-utils/common/type";
import { getSizeFromCanvasElement } from "../canvas/utils";
import { getSizeFromVideoElement } from "../video/utils";
import { getFitSize } from "@a2-ts-utils/common/image";

export type ImageInfo = {
  src: string;
  // 元サイズ
  naturalWidth: number;
  naturalHeight: number;
  // 表示サイズ
  width: number;
  height: number;
};

export const getImageInfoFromImageElement = (
  element: HTMLImageElement,
): ImageInfo => {
  return {
    src: element.src,
    naturalWidth: element.naturalWidth,
    naturalHeight: element.naturalHeight,
    width: element.width,
    height: element.height,
  };
};

export const getSizeFromImageElement = (element: HTMLImageElement): Size => {
  return {
    width: element.naturalWidth,
    height: element.naturalHeight,
  };
};

export const getSizeFromElement = (
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
): Size => {
  if (element instanceof HTMLVideoElement) {
    return getSizeFromVideoElement(element);
  } else if (element instanceof HTMLImageElement) {
    return getSizeFromImageElement(element);
  } else if (element instanceof HTMLCanvasElement) {
    return getSizeFromCanvasElement(element);
  }
  throw new Error("Unsupported element type");
};

export const getSizeFromBlobAsync = async (blob: Blob): Promise<Size> => {
  const bitmap = await createImageBitmap(blob);
  return {
    width: bitmap.width,
    height: bitmap.height,
  };
};

export const getFitSizeFromBlobAsync = async (
  blob: Blob,
  maxSize: Size,
): Promise<Size> => {
  const size = await getSizeFromBlobAsync(blob);
  return getFitSize(size, maxSize);
};
