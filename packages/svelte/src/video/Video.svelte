<script lang="ts">
  import { onMount } from "svelte";
  import { VideoEventType, type Props, type VideoApi } from "./video";

  // e.g.: `bind:api={movieApiRef}`
  // bind:this による直接参照はまだ動作するが、svelte5からRuneモードというものが導入され exportが非推奨になっている
  // そのため,別途 $bindable で interface を提供するのが良いらしい
  let {
    api = $bindable<VideoApi>(),
    onEvent = undefined,
    ...attrs
  }: Props = $props();

  onMount(() => {});

  // fix first seek time ====
  // this also can update with src change.
  const src = $derived.by(() => {
    if (attrs.src && attrs.currenttime) {
      return attrs.src + "#t=" + attrs.currenttime;
    }
    return attrs.src;
  });

  let ref: HTMLVideoElement | null = null;

  const _withRef = (fn: (ref: HTMLVideoElement) => void) => {
    if (ref) {
      fn(ref);
    }
  };

  api = {
    getRef: () => ref,
    // play =====
    play: () => _withRef((ref) => ref.play()),
    pause: () => _withRef((ref) => ref.pause()),
    togglePlay: () =>
      _withRef((ref) => (ref.paused ? ref.play() : ref.pause())),

    // time =====
    setCurrentTime: (time: number) =>
      _withRef((ref) => {
        // adjust from end if minus.
        if (time < 0) {
          if (ref.duration) {
            time = ref.duration - (Math.abs(time) % ref.duration);
          } else {
            time = 0;
          }
        }
        ref.currentTime = time;
      }),
    addCurrentTime: (time: number) =>
      _withRef((ref) => (ref.currentTime += time)),
    getCurrentTime: () => ref?.currentTime ?? 0,

    // volume =====
    setVolume: (volume: number) => _withRef((ref) => (ref.volume = volume)),
    mute: () => _withRef((ref) => (ref.muted = true)),
    unmute: () => _withRef((ref) => (ref.muted = false)),
    toggleMute: () => _withRef((ref) => (ref.muted = !ref.muted)),

    // playback rate (speed) =====
    setPlaybackRate: (rate: number) =>
      _withRef((ref) => (ref.playbackRate = rate)),
  };

  // イベントは onEventに集約して発火するようにする
  const _onEvent = (eventType: VideoEventType, event: Event) => {
    const element = event.currentTarget as HTMLVideoElement;
    onEvent?.(eventType, event, element);
  };
</script>

<video
  bind:this={ref}
  onerror={(e) => _onEvent(VideoEventType.Error, e)}
  onended={(e) => _onEvent(VideoEventType.Ended, e)}
  onloadedmetadata={(e) => _onEvent(VideoEventType.LoadedMetadata, e)}
  onseeked={(e) => _onEvent(VideoEventType.Seeked, e)}
  ontimeupdate={(e) => _onEvent(VideoEventType.TimeUpdate, e)}
  onvolumechange={(e) => _onEvent(VideoEventType.VolumeChange, e)}
  onratechange={(e) => _onEvent(VideoEventType.RateChange, e)}
  onplay={(e) => _onEvent(VideoEventType.Play, e)}
  onwaiting={(e) => _onEvent(VideoEventType.Waiting, e)}
  onplaying={(e) => _onEvent(VideoEventType.Playing, e)}
  onpause={(e) => _onEvent(VideoEventType.Pause, e)}
  {...attrs}
  {src}
>
  <track kind="captions" />
</video>
