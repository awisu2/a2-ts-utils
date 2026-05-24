<script lang="ts">
  //
  //
  //
  //
  // コンパイル後だと、内部の処理は動作するけれど, isActive 後の active() が描画されない
  // altの描画はされるが、切替部分が動作しないっぽい
  //
  //
  //

  import { onMount, type Snippet } from "svelte";

  type Props = {
    parent?: HTMLElement | null;
    class?: string;
    style?: string;

    onActive?: () => void;

    active: Snippet;
    alt: Snippet;
  };

  const {
    parent = null,
    class: _class = "",
    style: _style = "",
    onActive,
    active,
    alt,
  }: Props = $props();

  let self: HTMLDivElement | null = $state(null);
  let isActive: boolean = $state(false);
  let unsubscribe: (() => void) | null = null;

  onMount(() => {
    return () => {
      clearSubscribe();
    };
  });

  $effect(() => {
    onChangeSelf(parent, self);
  });

  const onChangeSelf = (
    parent: HTMLElement | null,
    self: HTMLDivElement | null,
  ) => {
    console.log("===== 1");
    if (!parent || !self) {
      clearSubscribe();
      return;
    }

    // IntersectionObserverの初期化
    const observer = new IntersectionObserver(
      (entries) => {
        console.log("===== 2");
        for (const entry of entries) {
          if (entry.isIntersecting) {
            console.log("===== 3 Active!");
            isActive = true;
            onActive?.();

            // 一度アクティブになったら監視を終了してリソースを解放
            clearSubscribe();
          }
        }
      },
      {
        // parentが指定されていればそれを基準に、未指定ならビューポート(null)を基準にする
        root: parent || null,
        // 1ピクセルでも交差したら判定
        threshold: 0,
      },
    );

    observer.observe(self);

    unsubscribe = () => {
      observer.disconnect();
    };
  };

  const clearSubscribe = () => {
    unsubscribe?.();
    unsubscribe = null;
  };
</script>

<div bind:this={self} class={_class} style={_style}>
  {#if isActive}
    Active!
    {@render active()}
  {:else}
    {@render alt()}
  {/if}
</div>
