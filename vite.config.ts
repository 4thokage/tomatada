import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    devtools(), solidPlugin(), tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Tomatada",
        short_name: "Tomatada",
        display: "standalone",
        theme_color: "#0f172a",
        icons: []
      }
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
