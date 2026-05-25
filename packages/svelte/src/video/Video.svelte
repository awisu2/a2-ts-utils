<script lang="ts">
  import { onMount } from "svelte";
  import {
    type VideoCustomEvent,
    type Props,
    type VideoBasicEvent,
    type VideoApi,
  } from "./video";

  // e.g.: `bind:api={movieApiRef}`
  let {
    src,
    attrs,
    events,
    api = $bindable<VideoApi>(),
    vervose = false,
  }: Props = $props();

  let _src = $derived.by(() => {
    if (attrs?.currenttime) {
      return `${src}#t=${attrs.currenttime}`;
    }
    return src;
  });

  onMount(() => {});

  const log = (...args: any[]) => {
    if (vervose) {
      console.log("[Video.svelte]", ...args);
    }
  };

  let ref: HTMLVideoElement | null = null;

  const withRef = (fn: (ref: HTMLVideoElement) => void) => {
    if (ref) {
      fn(ref);
    } else {
      log("ref is not set yet");
    }
  };

  $effect(() => {
    api = {
      play: () => {
        log("play");
        withRef((ref) => ref.play());
      },
      pause: () => {
        log("pause");
        withRef((ref) => ref.pause());
      },
      togglePlay: () => {
        log("togglePlay", ref?.paused);
        withRef((ref) => {
          ref.paused ? ref.play() : ref.pause();
        });
      },
      setTime: (time: number) => {
        log("setTime", time);
        withRef((ref) => (ref.currentTime = time));
      },
      addTime: (time: number) => {
        log("addTime", time);
        withRef((ref) => (ref.currentTime += time));
      },
      mute: () => {
        log("mute");
        withRef((ref) => (ref.muted = true));
      },
      unmute: () => {
        log("unmute");
        withRef((ref) => (ref.muted = false));
      },
      toggleMute: () => {
        log("toggleMute", ref?.muted);
        withRef((ref) => (ref.muted = !ref.muted));
      },
      setVolume: (volume: number) => {
        log("setVolume", volume);
        withRef((ref) => (ref.volume = volume));
      },
      setPlaybackRate: (rate: number) => {
        log("setPlaybackRate", rate);
        withRef((ref) => (ref.playbackRate = rate));
      },
    };
  });

  // eventの簡易ハンドラー, 引数の有無に合わせてvideoタグへセットを行う
  const eventHandle = (
    fn?: (e: VideoCustomEvent) => void,
  ): ((e: VideoBasicEvent) => void) | undefined => {
    if (!fn) return undefined;

    return (e: VideoBasicEvent) => {
      log("event", e.type, e);
      fn({ ...e, currentTarget: e.currentTarget as HTMLVideoElement });
    };
  };
</script>

<video
  src={_src}
  {...attrs}
  onerror={eventHandle(events?.onerror)}
  onended={eventHandle(events?.onended)}
  onloadedmetadata={eventHandle(events?.onloadedmetadata)}
  onseeked={eventHandle(events?.onseeked)}
  bind:this={ref}
>
  <track kind="captions" />
</video>
