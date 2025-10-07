<script lang="ts">
  import type { Toast } from "$lib/stores/toast";
  import { IconX } from "@tabler/icons-svelte";

  let buttonSize = 18;

  let { toast, onDismiss } = $props<{ toast: Toast; onDismiss: () => void }>();
</script>

<div class="toast toast-{toast.type}">
  {toast.message}
  <button class="toast-close" onclick={onDismiss} style="height: {buttonSize}px; width: {buttonSize}px;"><IconX size={buttonSize} /></button>
</div>

<style>
  .toast {
    position: relative;
    min-width: 300px;
    max-width: 500px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    color: white;

    font-weight: 500;

    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .toast-info {
    background: var(--color-primary);
  }

  .toast-success {
    background: var(--color-success);
    color: color-mix(in srgb, var(--color-success) 40%, black);
  }

  .toast-warning {
    background: var(--color-warning);
    color: color-mix(in srgb, var(--color-warning) 40%, black);
  }

  .toast-danger {
    background: var(--color-danger);
    color: color-mix(in srgb, var(--color-danger) 40%, black);
  }

  .toast-close {
    padding: 0;
    align-items: center;
    background: none;
    color: white;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .toast-close:hover {
    opacity: 1;
    background: none;
    box-shadow: none;
  }
</style>
