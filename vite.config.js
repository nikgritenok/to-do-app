import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "localhost",
    port: 5173,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
});
