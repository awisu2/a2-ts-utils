// ImageModule.ts
// Image.svelte用のロジック部分を分離したもの
// svelte内に直接記載すると、exportなどの解決がうまく行われないため分割してexportする
// module部分もここに記載することになる

// subscribes =====
const subscribes = new Set<(event: Event, element: HTMLImageElement) => void>();

export function subscribeEvent(onload: OnLoad, onerror?: OnError) {
  subscribes.add(onload);
  return () => subscribes.delete(onload);
}

export function onLoaded(img: HTMLImageElement, event: Event) {
  subscribes.forEach((cb) => cb(event, img));
}

// types =====
export type Props = { src: string; opts?: Options; events?: Events };
export type Options = import("svelte/elements").HTMLImgAttributes;

export type OnLoad = (event: Event, element: HTMLImageElement) => void;
export type OnError = (event: Event, element: HTMLImageElement) => void;

export type Events = {
  onLoad?: OnLoad;
  onError?: OnError;
};
