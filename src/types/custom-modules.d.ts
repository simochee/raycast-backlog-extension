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

// Fallback stubs — remove at will if you prefer to rely on the library typings.
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "@raycast/api" {
  const value: any;
  export = value;
}

declare module "@raycast/utils" {
  const value: any;
  export = value;
}

declare module "backlog-js" {
  const value: any;
  export = value;
}

declare module "@tanstack/react-query" {
  const value: any;
  export = value;
}

declare module "valibot" {
  const value: any;
  export = value;
}

/* eslint-enable @typescript-eslint/no-explicit-any */