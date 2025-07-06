/*
  Ambient module declarations that simply re-export the actual typings shipped
  by the corresponding npm packages.  These are only needed when TypeScript's
  module resolution cannot find the real declaration files (e.g. in certain
  CI or editor setups).  They do NOT replace the package typings; they merely
  act as a fallback.
*/

declare module "@raycast/api" {
  export * from "@raycast/api";
}

declare module "@raycast/utils" {
  export * from "@raycast/utils";
}

declare module "backlog-js" {
  export * from "backlog-js";
}

declare module "@tanstack/react-query" {
  export * from "@tanstack/react-query";
}

declare module "valibot" {
  export * from "valibot";
}

declare module "react/jsx-runtime" {
  export * from "react/jsx-runtime";
}