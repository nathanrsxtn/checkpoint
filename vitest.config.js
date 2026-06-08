import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // make vitest globals available
    environment: "node", // set env where tests run
    coverage: {
      provider: "v8",
      reporter: ["text", "html"] // output formats for reports
    }
  }
});