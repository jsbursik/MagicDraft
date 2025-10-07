<script lang="ts">
  import "./app.css";
  import favicon from "$lib/assets/favicon.svg";
  import TopNav from "../components/nav/nav.svelte";
  import { sessionStore } from "$lib/stores/session";
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
