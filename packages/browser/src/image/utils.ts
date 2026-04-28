import { Size } from "@a2-ts-utils/common/type";
import { getSize as getSizeCanvas } from "../canvas/utils";
import { getSize as getSizeVideo } from "../video/utils";

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
