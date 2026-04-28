import { Size } from "../type";

export function getFitSize(size: Size, maxSize: Size): Size {
  const aspectRatio = size.width / size.height;
  let width = size.width;
  let height = size.height;

  // note: 2段階で計算することで、縦横どちらも内側に収まる
  if (width > maxSize.width) {
    width = maxSize.width;
    height = width / aspectRatio;
  }

  if (height > maxSize.height) {
    height = maxSize.height;
    width = height * aspectRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}
