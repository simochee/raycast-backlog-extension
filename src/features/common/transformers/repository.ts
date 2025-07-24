import type { Entity } from "backlog-js";
import { pick } from "es-toolkit";

export const transformRepository = (repository: Entity.Git.GitRepository) => {
  return {
    ...pick(repository, ["id", "name", "description", "projectId", "displayOrder"]),
  };
};

export type Repository = ReturnType<typeof transformRepository>;
