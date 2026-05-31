import { HTMLImgAttributes } from "svelte/elements";

// types =====
export const ImageEventType = {
  Load: "load",
  Error: "error",
  Abort: "abort",
} as const;
export type ImageEventType =
  (typeof ImageEventType)[keyof typeof ImageEventType];

export type ImageProps = {
  onEvent?: (
    type: ImageEventType,
    event: Event,
    element: HTMLImageElement,
  ) => void;
} & HTMLImgAttributes;
