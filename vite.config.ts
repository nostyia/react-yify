import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
    }),
    mkcert(),
  ],
  resolve: {
    alias: {
      webtorrent: "webtorrent/dist/webtorrent.min.js",
    },
  },
});
