/// <reference types="vitest" />

import react from "@vitejs/plugin-react-swc";
import "@testing-library/jest-dom";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["test/vitest.setup.ts"],
    include: ["**/?(*.)test.ts?(x)"],
  },
});
