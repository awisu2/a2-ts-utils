export type Size = {
  width: number;
  height: number;
};

export const ImageMimeType = {
  JPEG: "image/jpeg",
  PNG: "image/png",
  WEBP: "image/webp",
  AVIF: "image/avif",
} as const;
export type ImageMimeType = (typeof ImageMimeType)[keyof typeof ImageMimeType];
