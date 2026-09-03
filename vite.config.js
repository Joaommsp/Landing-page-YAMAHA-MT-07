import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // porta fixa: falhar alto e melhor que subir noutra porta em silencio
    port: 9000,
    strictPort: true,
  },
  preview: {
    port: 9001,
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.js"],
    css: false,
    // a suite nasce nesta feature; sem isso o gate falha antes do primeiro teste existir
    passWithNoTests: true,
  },
});
