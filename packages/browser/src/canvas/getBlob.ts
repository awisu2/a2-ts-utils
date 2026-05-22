import { getCanvas2dBySource } from "./element";

export const getBlobAsync = async (
  src: HTMLCanvasElement | HTMLVideoElement,
  type: string = "image/png",
): Promise<Blob> => {
  if (src instanceof HTMLCanvasElement) {
    return await getBlobByCanvasAsync(src, type);
  } else {
    return await getBlobByVideoElement(src, type);
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
        reject(new Error("Failed toBlob. check crossOrigin='anonymous'"));
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

export const getBlobByBytes = (bytes: Uint8Array): Blob | undefined => {
  if (!(bytes instanceof Uint8Array)) {
    return undefined;
  }
  if (!(bytes.buffer instanceof ArrayBuffer)) {
    return undefined;
  }
  return new Blob([bytes as Uint8Array<ArrayBuffer>]);
};
