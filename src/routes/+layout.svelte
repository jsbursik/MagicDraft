<script lang="ts">
  import "./app.css";
  import favicon from "$lib/assets/favicon.svg";
  import TopNav from "../components/top-nav.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<TopNav />
<main>
  {@render children?.()}
</main>
