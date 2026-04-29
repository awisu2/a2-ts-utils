<script lang="ts">
  import {
    type ImageProps,
    type ImageBasicEvent,
    type ImageCustomEvent,
    onLoaded,
  } from "./image";

  const { src, opts, events }: ImageProps = $props();

  function convertEvent(ev: ImageBasicEvent): ImageCustomEvent {
    return {
      ...ev,
      currentTarget: ev.currentTarget as HTMLImageElement,
    };
  }
  const eventHandle = (
    fn?: (e: ImageCustomEvent) => void,
    isOnload = false,
  ): ((e: ImageBasicEvent) => void) | undefined => {
    if (!fn) return undefined;

    return (ev: ImageBasicEvent) => {
      var customEvent = convertEvent(ev);
      if (fn) fn(customEvent);
      if (isOnload) onLoaded(customEvent);
    };
  };
</script>

<img
  {src}
  {...opts}
  onload={eventHandle(events?.onload, true)}
  onerror={eventHandle(events?.onerror)}
/>
