import { pick } from "es-toolkit";
import type { Entity } from "backlog-js";

export const transformRepository = (repository: Entity.Git.GitRepository) => {
  return {
    ...pick(repository, ["id", "name", "description", "projectId", "displayOrder"]),
  };
};

export type Repository = ReturnType<typeof transformRepository>;
