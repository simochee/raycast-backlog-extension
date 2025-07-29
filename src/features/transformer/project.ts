import { pick } from "es-toolkit";
import type { Entity } from "backlog-js";

export const transformProject = (project: Entity.Project.Project) => {
  return {
    ...pick(project, [
      "id",
      "name",
      "projectKey",
      "useDevAttributes",
      "chartEnabled",
      "useFileSharing",
      "useWiki",
      "useSubversion",
      "useGit",
      "archived",
      "displayOrder",
    ]),
  };
};

export const transformRecentlyViewedProject = (project: Entity.Project.RecentlyViewedProject) => {
  return {
    project: transformProject(project.project),
  } satisfies { [K in keyof Entity.Project.RecentlyViewedProject]?: unknown };
};

export type Project = ReturnType<typeof transformProject>;
export type RecentlyViewedProject = ReturnType<typeof transformRecentlyViewedProject>;
