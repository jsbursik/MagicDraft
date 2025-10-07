<script lang="ts">
  import "./app.css";
  import favicon from "$lib/assets/favicon.svg";
  import TopNav from "../components/nav/nav.svelte";

  let { data, children } = $props();

  const session = data.session;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<TopNav user={session?.user} />
<main>
  {@render children?.()}
</main>
