<script lang="ts">
  import "./app.css";
  import favicon from "$lib/assets/favicon.svg";
  import TopNav from "../components/nav/nav.svelte";

  import { onMount } from "svelte";
  import { authClient } from "$lib/auth-client";

  let session = $state<any>(null);

  let { children } = $props();

  onMount(async () => {
    const { data } = await authClient.getSession();
    session = data;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav>
  {#if session?.user}
    <p>Welcome, {session.user.name}!</p>
    <button onclick={() => authClient.signOut()}>Log Out</button>
  {:else}
    <a href="/login">Log In</a>
    <a href="/signup">Sign Up</a>
  {/if}
</nav>

<TopNav />
<main>
  {@render children?.()}
</main>
