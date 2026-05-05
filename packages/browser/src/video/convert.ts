import { Size, ImageMimeType } from "@a2-ts-utils/common/type";
import {
  getBytesFromCanvasElementAsync,
  getCanvas2dFromElement,
} from "../canvas/convert";

// get current frame bytes =====
// canvasに描画してからDataURL経由でバイト列を取得する
export const videoElementToBytesAsync = async (
  video: HTMLVideoElement,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize?: Size,
): Promise<Uint8Array> => {
  const canvas = getCanvas2dFromElement(video, newSize);
  return getBytesFromCanvasElementAsync(canvas, type);
};

export const bytesFromVideoElementAsync = videoElementToBytesAsync;
