import { Size } from "@a2-ts-utils/common/type";

export function getSize(element: HTMLCanvasElement): Size {
  return {
    width: element.width,
    height: element.height,
  };
}
