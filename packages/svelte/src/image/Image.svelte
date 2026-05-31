<script lang="ts">
  import { ImageEventType, type ImageProps } from "./image";

  const { onEvent = undefined, ...attrs }: ImageProps = $props();

  const _onEvent = (type: ImageEventType, event: Event) => {
    const element = event.currentTarget as HTMLImageElement;
    onEvent?.(type, event, element);
  };
</script>

<img
  onload={(event) => _onEvent(ImageEventType.Load, event)}
  onerror={(event) => _onEvent(ImageEventType.Error, event)}
  onabort={(event) => _onEvent(ImageEventType.Abort, event)}
  {...attrs}
/>
