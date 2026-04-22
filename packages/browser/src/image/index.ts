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
