<script lang="ts">
  import { onLoaded, type Props } from "./image";

  const { src, opts, events }: Props = $props();

  function onload(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    events?.onLoad?.(event, img);
    onLoaded(img, event);
  }

  function onerror(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    events?.onError?.(event, img);
  }
</script>

<img {src} {...opts} {onload} {onerror} />
