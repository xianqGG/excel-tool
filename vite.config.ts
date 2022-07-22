import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import analyzer from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [reactRefresh(), process.env.ANALYZER && analyzer()].filter(
    Boolean
  ) as any,
  build: {
    outDir: "docs",
  },
  server: {
    port: 3000,
  },
});
