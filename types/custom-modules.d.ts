// Global fallback/re-export module declarations
// ------------------------------------------------
// These declarations simply re-export the real typings shipped with each
// library. They are only consulted if the module resolution fails in certain
// build environments, preventing "Cannot find module ..." errors while keeping
// the rich type information intact.

/* eslint-disable @typescript-eslint/no-explicit-any */

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

// React 17+ automatic JSX runtime
// (only needed if the build tool fails to resolve it automatically)

declare module "react/jsx-runtime" {
  export * from "react/jsx-runtime";
  const _default: typeof import("react/jsx-runtime");
  export default _default;
}

/* eslint-enable @typescript-eslint/no-explicit-any */