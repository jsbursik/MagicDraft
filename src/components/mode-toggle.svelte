<script>
  import { IconSunFilled, IconMoonFilled } from "@tabler/icons-svelte";
  import { onMount } from "svelte";

  let theme = "light";

  onMount(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  });

  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
</script>

<button on:click={toggleTheme} class="mode-toggle">
  {#if theme === "dark"}
    <IconSunFilled />
  {:else}
    <IconMoonFilled />
  {/if}
</button>

<style>
  button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;

    display: grid;
    place-items: center;

    height: 3rem;
    width: 3rem;
    padding: 0.5rem;
    border-radius: 100%;

    background: var(--color-border);
    color: var(--color-text);
  }
</style>
