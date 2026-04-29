import { HTMLVideoAttributes } from "svelte/elements";

export type VideoBasicEvent = Event & { currentTarget: Element };
export type VideoCustomEvent = Event & { currentTarget: HTMLVideoElement };

export type VideoAttrs = Omit<
  HTMLVideoAttributes,
  "src" | "onerror" | "onended" | "onloadedmetadata" | "onseeked"
>;

export type VideoEvents = {
  onerror?: (e: VideoCustomEvent) => void;
  onended?: (e: VideoCustomEvent) => void;
  onloadedmetadata?: (e: VideoCustomEvent) => void;
  onseeked?: (e: VideoCustomEvent) => void;
};

export type VideoApi = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setTime: (time: number) => void;
  addTime: (time: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
};

export type Props = {
  src: string;
  attrs?: VideoAttrs;
  events?: VideoEvents;
  ref?: HTMLVideoElement;
  api?: VideoApi;
};
