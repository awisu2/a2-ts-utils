<script lang="ts" module>
  const subscribes = new Set<
    (event: Event, element: HTMLImageElement) => void
  >();

  export function subscribeEvent(
    onload: (event: Event, element: HTMLImageElement) => void,
  ): () => void {
    subscribes.add(onload);

    const unsubscribe = () => {
      subscribes.delete(onload);
    };
    return unsubscribe;
  }

  export function onLoaded(img: HTMLImageElement, event: Event) {
    subscribes.forEach((cb) => cb(event, img));
  }
</script>

<script lang="ts">
  import { HTMLImgAttributes } from "svelte/elements";

  type Props = {
    src: string;
    Options?: HTMLImgAttributes;
    Events?: Events;
  };

  // Note: パラメータの伝播がしやすい用に1変数に集約
  export type Events = {
    onLoad?: (event: Event, element: HTMLImageElement) => void;
    onError?: (event: Event, element: HTMLImageElement) => void;
  };

  const { src, Options, Events }: Props = $props();

  function onload(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    Events?.onLoad?.(event, img);
    onLoaded(img, event);
  }

  function onerror(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    Events?.onError?.(event, img);
  }
</script>

<img {src} {...Options} {onload} {onerror} />
