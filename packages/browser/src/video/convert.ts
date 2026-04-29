import { Size, ImageMimeType } from "@a2-ts-utils/common/type";
import { elementToCanvas2d, getBytesAsync } from "../canvas/convert";

// get current frame bytes =====
// canvasに描画してからDataURL経由でバイト列を取得する
export async function getVideoBytes(
  video: HTMLVideoElement,
  type: ImageMimeType = ImageMimeType.JPEG,
  newSize?: Size,
): Promise<Uint8Array> {
  const canvas = elementToCanvas2d(video, newSize);
  return getBytesAsync(canvas, type);
}
