<script lang="ts">
  import { onMount } from "svelte";
  import {
    type VideoCustomEvent,
    type Props,
    type VideoBasicEvent,
    type VideoApi,
  } from "./video";

  let { src, attrs, events, api = $bindable<VideoApi>() }: Props = $props();

  let _src = $derived.by(() => {
    if (attrs?.currenttime) {
      return `${src}#t=${attrs.currenttime}`;
    }
    return src;
  });

  onMount(() => {});

  const eventHandle = (
    fn?: (e: VideoCustomEvent) => void,
  ): ((e: VideoBasicEvent) => void) | undefined => {
    if (!fn) return undefined;

    return (e: VideoBasicEvent) => {
      if (fn) fn({ ...e, currentTarget: e.currentTarget as HTMLVideoElement });
    };
  };

  let ref: HTMLVideoElement | null = null;

  $effect(() => {
    api = {
      play: () => ref!.play(),
      pause: () => ref!.pause(),
      togglePlay: () => {
        if (!ref) return;
        ref.paused ? ref.play() : ref.pause();
      },
      setTime: (time: number) => {
        if (!ref) return;
        ref.currentTime = time;
      },
      addTime: (time: number) => (ref ? (ref.currentTime += time) : undefined),
      mute: () => (ref ? (ref.muted = true) : undefined),
      unmute: () => (ref ? (ref.muted = false) : undefined),
      toggleMute: () => (ref ? (ref.muted = !ref.muted) : undefined),
      setVolume: (volume: number) => (ref ? (ref.volume = volume) : undefined),
      setPlaybackRate: (rate: number) =>
        ref ? (ref.playbackRate = rate) : undefined,
    };
  });
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
