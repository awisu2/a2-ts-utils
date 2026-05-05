import { Size } from "@a2-ts-utils/common/type";
import { getSizeFromCanvasElement } from "../canvas/utils";
import { getSizeFromVideoElement } from "../video/utils";

export type ImageInfo = {
  src: string;
  // 元サイズ
  naturalWidth: number;
  naturalHeight: number;
  // 表示サイズ
  width: number;
  height: number;
};

export function getImageInfoFromImageElement(
  element: HTMLImageElement,
): ImageInfo {
  return {
    src: element.src,
    naturalWidth: element.naturalWidth,
    naturalHeight: element.naturalHeight,
    width: element.width,
    height: element.height,
  };
}

export function getSizeFromImageElement(element: HTMLImageElement): Size {
  return {
    width: element.naturalWidth,
    height: element.naturalHeight,
  };
}

export function getSizeFromElement(
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
): Size {
  if (element instanceof HTMLVideoElement) {
    return getSizeFromVideoElement(element);
  } else if (element instanceof HTMLImageElement) {
    return getSizeFromImageElement(element);
  } else if (element instanceof HTMLCanvasElement) {
    return getSizeFromCanvasElement(element);
  }
  throw new Error("Unsupported element type");
}
