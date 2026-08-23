import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
    resolve: {
        // Mirror the `@/*` path alias from tsconfig.json so tests import the
        // same way the app does.
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
});
