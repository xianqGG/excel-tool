import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import analyzer from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [reactRefresh(), process.env.ANALYZER && analyzer()].filter(Boolean),
  build: {
    outDir: "docs",
  },
});
