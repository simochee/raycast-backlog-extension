import raycastConfig from "@raycast/eslint-config";
import { tanstackConfig } from "@tanstack/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([{ ignores: ["*-env.d.ts"] }, ...raycastConfig, ...tanstackConfig]);
