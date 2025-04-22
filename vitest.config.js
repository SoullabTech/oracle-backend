// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
  test: {
    globals: true,
    environment: "node", // ✅ Changed from 'jsdom' to 'node' to support OpenAI SDK
    setupFiles: ["./test-env.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"], // ✅ Only run tests inside /src
    exclude: [
      "node_modules",
      "dist",
      ".idea",
      ".git",
      ".cache",
      "**/__mocks__/**", // Optional: ignore mock directories
    ],
    reporters: ["default"], // Optional: use ['default', 'verbose'] for detailed logs
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@types": path.resolve(__dirname, "./src/types"), // 🔧 Useful for shared TypeScript types
    },
  },
});
