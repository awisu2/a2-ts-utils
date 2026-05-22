import { getCanvas2dBySource } from "./element";

export const getBlobAsync = async (
  src: HTMLCanvasElement | HTMLVideoElement | Uint8Array,
  type: string = "image/png",
): Promise<Blob> => {
  if (src instanceof HTMLCanvasElement) {
    return await getBlobByCanvasAsync(src, type);
  } else if (src instanceof HTMLVideoElement) {
    return await getBlobByVideoElement(src, type);
  } else if (src instanceof Uint8Array) {
    return getBlobByBytes(src);
  } else {
    throw new Error("Failed getBlobAsync. Invalid input type.");
  }
};

// get blob from canvas
const getBlobByCanvasAsync = (
  canvas: HTMLCanvasElement,
  type: string = "image/png",
) => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        const error = new Error(
          "Failed canvas.toBlob(). may crossOrigin='anonymous'",
        );
        reject(error);
      }
    }, type);
  });
};

const getBlobByVideoElement = async (
  video: HTMLVideoElement,
  type: string = "image/png",
) => {
  const canvas = getCanvas2dBySource(video);
  return await getBlobByCanvasAsync(canvas, type);
};

const getBlobByBytes = (bytes: Uint8Array): Blob => {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error("Failed getBlobByBytes. Invalid input: not a Uint8Array");
  }
  if (!(bytes.buffer instanceof ArrayBuffer)) {
    throw new Error("Failed getBlobByBytes. Invalid input: not an ArrayBuffer");
  }
  return new Blob([bytes as Uint8Array<ArrayBuffer>]);
};
