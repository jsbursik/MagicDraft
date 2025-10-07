<script lang="ts">
  import { onMount } from "svelte";

  interface Card {
    id: string;
    name: string;
    imageUris: {
      normal: string;
      small: string;
      large: string;
      png: string;
    } | null;
    set: string;
    rarity: string;
    typeLine: string;
  }

  let cards: Card[] = [];
  let loading = true;

  onMount(async () => {
    const response = await fetch("/api/cards/random");
    cards = await response.json();
    loading = false;
  });
</script>

<div class="center">
  <div class="card">
    <div class="grid">
      {#if loading}Loading Cards...
      {:else}
        {#each cards as card}
          {#if card.imageUris?.normal}
            <img src={card.imageUris.png} alt={card.name} class="mtg-card" loading="lazy" />
          {:else}
            <div class="no-image">{card.name}</div>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .no-image {
    background: #333;
    color: #999;
    padding: 4rem 1rem;
    text-align: center;
  }
</style>
