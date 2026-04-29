import { Size } from "@a2-ts-utils/common/type";
import { getSize as getSizeCanvas } from "../canvas/utils";
import { getSize as getSizeVideo } from "../video/utils";

export type ImageInfo = {
  src: string;
  // 元サイズ
  naturalWidth: number;
  naturalHeight: number;
  // 表示サイズ
  width: number;
  height: number;
};

export function getImageInfo(element: HTMLImageElement): ImageInfo {
  return {
    src: element.src,
    naturalWidth: element.naturalWidth,
    naturalHeight: element.naturalHeight,
    width: element.width,
    height: element.height,
  };
}

export function getSize(element: HTMLImageElement): Size {
  return {
    width: element.naturalWidth,
    height: element.naturalHeight,
  };
}

export function getElementSize(
  element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
): Size {
  if (element instanceof HTMLVideoElement) {
    return getSizeVideo(element);
  } else if (element instanceof HTMLImageElement) {
    return getSize(element);
  } else if (element instanceof HTMLCanvasElement) {
    return getSizeCanvas(element);
  }
  throw new Error("Unsupported element type");
}
