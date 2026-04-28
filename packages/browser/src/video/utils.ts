import { Size } from "@a2-ts-utils/common/type";

export type VideoInfo = Size & {
  currentTime: number;
  duration: number;
  paused: boolean;
  ended: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
  defaultPlaybackRate: number;
};

export function getVideoInfo(videoElement: HTMLVideoElement): VideoInfo {
  return {
    width: videoElement.videoWidth,
    height: videoElement.videoHeight,
    currentTime: videoElement.currentTime,
    duration: videoElement.duration,
    paused: videoElement.paused,
    ended: videoElement.ended,
    volume: videoElement.volume,
    muted: videoElement.muted,
    playbackRate: videoElement.playbackRate,
    defaultPlaybackRate: videoElement.defaultPlaybackRate,
  };
}

export function getSize(videoElement: HTMLVideoElement): Size {
  return {
    width: videoElement.videoWidth,
    height: videoElement.videoHeight,
  };
}
