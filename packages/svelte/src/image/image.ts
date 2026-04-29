// ImageModule.ts
// Image.svelte用のロジック部分を分離したもの
// svelte内に直接記載すると、exportなどの解決がうまく行われないため分割してexportする
// module部分もここに記載することになる

import { HTMLImgAttributes } from "svelte/elements";

// types =====
export type ImageProps = {
  src: string;
  opts?: ImageOptions;
  events?: ImageEvents;
};
export type ImageOptions = Omit<
  HTMLImgAttributes,
  "src" | "onload" | "onerror"
>;

export type ImageBasicEvent = Event & { currentTarget: Element };
export type ImageCustomEvent = Event & { currentTarget: HTMLImageElement };

export type ImageEvents = {
  onload?: (e: ImageCustomEvent) => void;
  onerror?: (e: ImageCustomEvent) => void;
};

// Module =====
const subscribes = new Set<(ev: ImageCustomEvent) => void>();

export function subscribeEvent(onload: (ev: ImageCustomEvent) => void) {
  subscribes.add(onload);
  return () => subscribes.delete(onload);
}

export function onLoaded(ev: ImageCustomEvent) {
  subscribes.forEach((cb) => cb(ev));
}
