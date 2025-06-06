import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: "assets/live-broadcast.js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 9999,
    allowedHosts: ["live-p2p.nizsimsek.dev"],
  },
  resolve: {
    alias: {
      "@": "/src",
      "@views": "/src/views",
      "@components": "/src/components",
      "@lib": "/src/lib",
      "@lib/utils": "/src/lib/utils",
    },
  },
});
