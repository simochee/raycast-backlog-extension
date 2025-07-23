import { pick } from "es-toolkit";
import type { Entity } from "backlog-js";

export const transformUser = (myself: Entity.User.User) => {
  return {
    ...pick(myself, ["id"]),
  } satisfies { [K in keyof Entity.User.User]?: unknown };
};

export type User = ReturnType<typeof transformUser>;
