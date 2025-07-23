import { pick } from "es-toolkit";
import type { Entity } from "backlog-js";

export const transformSpace = (space: Entity.Space.Space) => {
  return {
    ...pick(space, ["spaceKey", "name"]),
  } satisfies { [K in keyof Entity.Space.Space]?: unknown };
};

export type Space = ReturnType<typeof transformSpace>;
