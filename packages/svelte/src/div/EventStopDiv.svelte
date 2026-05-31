<script lang="ts">
  // EventStopper: 親タグへのイベント伝播を停止する
  import { Snippet } from "svelte";
  import { type HTMLAttributes } from "svelte/elements";

  type Props = {
    children: Snippet;
  } & HTMLAttributes<HTMLDivElement>;
  const { children, ...attrs }: Props = $props();

  const stopEvent = (e: Event) => {
    // Note: preventDefault() はブラウザのデフォルトの挙動を停止する
    e.stopPropagation();
  };
</script>

<div
  onclick={stopEvent}
  ondblclick={stopEvent}
  onmousedown={stopEvent}
  onmouseup={stopEvent}
  onpointerdown={stopEvent}
  onpointerup={stopEvent}
  oncontextmenu={stopEvent}
  ontouchstart={stopEvent}
  {...attrs}
>
  {@render children()}
</div>
