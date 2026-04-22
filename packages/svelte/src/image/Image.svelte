<script lang="ts">
  type Props = {
    src: string;
    Options?: Options;
    Events?: Events;
  };

  // Note: パラメータの伝播がしやすい用に1変数に集約
  export type Options = {
    id?: string;
    alt?: string;
    class?: string;
    style?: string;
    title?: string;
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
  }

  function onerror(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    Events?.onError?.(event, img);
  }
</script>

<img {src} {...Options} {onload} {onerror} />
