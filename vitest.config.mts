import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    alias: {
      "@/": fileURLToPath(new URL("./src", import.meta.url)),
    },
    fileParallelism: false,
  },
})