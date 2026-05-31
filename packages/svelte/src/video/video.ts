import { HTMLVideoAttributes } from "svelte/elements";

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

export const VideoEventType = {
  Error: "error",
  Ended: "ended",
  LoadedMetadata: "loadedmetadata",
  // シーク完了
  Seeked: "seeked",
  // 再生位置が変化
  TimeUpdate: "timeupdate",
  // 音量が変化
  VolumeChange: "volumechange",
  // 再生速度が変化
  RateChange: "ratechange",
  // play() による再生要求
  Play: "play",
  // 停止
  Pause: "pause",
  // 再生開始
  Playing: "playing",
  // 再生が一時停止またはバッファリングで待機中(再生中ランダムに発生する可能性あり)
  Waiting: "waiting",
} as const;
export type VideoEventType =
  (typeof VideoEventType)[keyof typeof VideoEventType];

export type VideoEvent = (
  type: VideoEventType,
  event: Event,
  element: HTMLVideoElement,
) => void;

export type Props = {
  api?: VideoApi;
  onEvent?: VideoEvent;
} & HTMLVideoAttributes;
