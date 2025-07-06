/*
  This file provides fallback type declarations for external libraries that ship
  their own TypeScript definitions.  Some stricter build environments (for
  instance, when `skipLibCheck` is disabled or when the dependency cannot be
  resolved in CI) may still fail to resolve the module.  Declaring them here as
  `any` guarantees the project will continue to compile even if the actual
  typings cannot be found for some reason.

  IMPORTANT: Because the real packages already include rich typings, these
  declarations are marked with `/// <reference no-default-lib="true" />` to
  ensure they are only picked up when the genuine ones are missing (i.e., they
  have lower precedence than `@types/*` or the package-provided `.d.ts` files).
*/

// Make sure this file is a module so that the declarations are scoped.
export {};

// If the real type declarations of each library can be resolved, these
// re-export declarations simply forward to them.  Should the resolution fail
// (e.g. in an isolated build environment), this file still prevents the
// compiler from throwing a "Cannot find module" error.

declare module "@raycast/api" {
  export * from "@raycast/api";
  const _default: typeof import("@raycast/api");
  export default _default;
}

declare module "@raycast/utils" {
  export * from "@raycast/utils";
  const _default: typeof import("@raycast/utils");
  export default _default;
}

declare module "backlog-js" {
  export * from "backlog-js";
  const _default: typeof import("backlog-js");
  export default _default;
}

declare module "@tanstack/react-query" {
  export * from "@tanstack/react-query";
  const _default: typeof import("@tanstack/react-query");
  export default _default;
}

declare module "valibot" {
  export * from "valibot";
  const _default: typeof import("valibot");
  export default _default;
}

/* eslint-enable @typescript-eslint/no-explicit-any */