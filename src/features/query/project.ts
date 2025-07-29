import { queryOptions } from "@tanstack/react-query";
import * as v from "valibot";
import type { CurrentSpace } from "~space/hooks/useCurrentSpace";
import { transformProject, transformRecentlyViewedProject } from "~transformer/project";
import { CACHE_TTL } from "~common/constants/cache";
import { createCache } from "~common/utils/cache";
import { dedupe } from "~common/utils/promise-dedupe";
import { infiniteQueryOptions } from "@tanstack/react-query";

const PER_PAGE = 25;

export const projectOptions = (currentSpace: CurrentSpace, projectId: number) =>
  queryOptions({
    queryKey: ["project", currentSpace.space.spaceKey, projectId],
    queryFn: async () => {
      const cache = createCache(
        [currentSpace.space.spaceKey, "project", projectId.toString()],
        v.object({
          id: v.number(),
          projectKey: v.string(),
          name: v.string(),
          chartEnabled: v.boolean(),
          useWiki: v.boolean(),
          useFileSharing: v.boolean(),
          useSubversion: v.boolean(),
          useGit: v.boolean(),
          archived: v.boolean(),
          displayOrder: v.number(),
          useDevAttributes: v.boolean(),
        }),
      );
      const cached = cache.get();

      if (cached) return cached;

      const project = await dedupe(currentSpace.api.getProject.bind(currentSpace.api), projectId);
      const transformed = transformProject(project);

      cache.set(transformed);

      return transformed;
    },
    staleTime: CACHE_TTL.PROJECT,
    gcTime: CACHE_TTL.PROJECT,
  });

export const recentProjectsOptions = (currentSpace: CurrentSpace) =>
  infiniteQueryOptions({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "projects"],
    queryFn: async ({ pageParam }) => {
      const projects = await currentSpace.api.getRecentlyViewedProjects({
        count: PER_PAGE,
        offset: pageParam,
      });

      return projects.map(transformRecentlyViewedProject);
    },
    staleTime: CACHE_TTL.RECENT_VIEWED_PROJECTS,
    gcTime: CACHE_TTL.RECENT_VIEWED_PROJECTS,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

export const projectsOptions = (currentSpace: CurrentSpace, archived = false) =>
  queryOptions({
    queryKey: ["projects", currentSpace.space.spaceKey, archived],
    queryFn: async () => {
      const projects = await currentSpace.api.getProjects({ archived });

      return projects.map(transformProject);
    },
    staleTime: CACHE_TTL.PROJECT,
    gcTime: CACHE_TTL.PROJECT,
  });