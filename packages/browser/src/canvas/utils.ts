import { Size } from "@a2-ts-utils/common/type";

export const getSizeFromCanvasElement = (element: HTMLCanvasElement): Size => {
  return {
    width: element.width,
    height: element.height,
  };
};
