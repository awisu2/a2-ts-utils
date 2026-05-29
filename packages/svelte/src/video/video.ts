import { HTMLVideoAttributes } from "svelte/elements";

export type VideoBasicEvent = Event & { currentTarget: Element };
export type VideoCustomEvent = Event & { currentTarget: HTMLVideoElement };

export type VideoAttrs = Omit<
  HTMLVideoAttributes,
  | "src"
  | "onerror"
  | "onended"
  | "onloadedmetadata"
  | "onseeked"
  | "ontimeupdate"
>;

export type VideoEvents = {
  onerror?: (e: VideoCustomEvent) => void;
  onended?: (e: VideoCustomEvent) => void;
  onloadedmetadata?: (e: VideoCustomEvent) => void;
  onseeked?: (e: VideoCustomEvent) => void;
  ontimeupdate?: (e: VideoCustomEvent) => void;
};

export type VideoApi = {
  getRef: () => HTMLVideoElement | null;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  addCurrentTime: (time: number) => void;
  getCurrentTime: () => number;
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
  verbose?: boolean;
};
