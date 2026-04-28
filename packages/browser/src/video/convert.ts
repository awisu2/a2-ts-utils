import { elementToCanvas } from "../canvas/convert";
import { getBytes, ToDataUrlType } from "../canvas/convert";

// get current frame bytes =====
// canvasに描画してからDataURL経由でバイト列を取得する
export async function getVideoBytes(
  video: HTMLVideoElement,
  newType: ToDataUrlType,
): Promise<Uint8Array> {
  const canvas = elementToCanvas(video);
  return getBytes(canvas, newType);
}
