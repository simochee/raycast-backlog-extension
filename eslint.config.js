/* eslint-disable @typescript-eslint/no-require-imports */
// The ESLint flat config uses CommonJS-style imports, which are acceptable in configuration files.

const { defineConfig } = require("eslint/config");
const raycastConfig = require("@raycast/eslint-config");

module.exports = defineConfig([
  ...raycastConfig,
]);
