import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'warning' | 'danger';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  let nextId = 0;

  return {
    subscribe,
    show(message: string, type: ToastType = 'info', duration: number = 3000) {
      const id = nextId++;
      const toast: Toast = { id, message, type, duration };

      update(toasts => [...toasts, toast]);

      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    },
    dismiss(id: number) {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    clear() {
      update(() => []);
    }
  };
}

export const toast = createToastStore();
