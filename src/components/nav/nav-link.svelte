<script lang="ts">
  import { page } from "$app/state";

  let { href, children, ...props } = $props();

  let active = $derived(page.url.pathname === href);
</script>

<a {href} class="nav-link" class:active {...props}>
  {@render children()}
</a>

<style>
  .nav-link {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--transition);
  }

  .nav-link:hover {
    color: var(--color-text);
    background: var(--color-bg);
    transform: none;
    box-shadow: none;
  }

  .nav-link.active {
    background: var(--color-border);
    color: var(--color-text);
  }
</style>
