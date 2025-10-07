import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: ["better-auth", "drizzle-orm", "postgres"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/routes/**/*.svelte"],
    },
  },
  plugins: [sveltekit()],
});
