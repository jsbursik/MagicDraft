<script lang="ts">
  import "./app.css";
  import favicon from "$lib/assets/favicon.svg";
  import TopNav from "../components/nav/nav.svelte";
  import Toast from "$components/toast.svelte";
  import { sessionStore } from "$lib/stores/session";
  import { toast } from "$lib/stores/toast";
  import { onMount } from "svelte";

  let { data, children } = $props();

  onMount(() => {
    sessionStore.set(data.session);
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<TopNav />
<main>
  {@render children?.()}
</main>

<div class="toast-container">
  {#each $toast as toastItem (toastItem.id)}
    <Toast toast={toastItem} onDismiss={() => toast.dismiss(toastItem.id)} />
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: var(--space-xl);
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    pointer-events: none;
  }

  .toast-container > :global(*) {
    pointer-events: all;
  }
</style>
