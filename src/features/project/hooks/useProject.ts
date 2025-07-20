import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { createCache } from "~common/utils/cache";
import { dedupe } from "~common/utils/promise-dedupe";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";

const schema = v.object({
  id: v.number(),
  projectKey: v.string(),
  name: v.string(),
  chartEnabled: v.boolean(),
  useResolvedForChart: v.boolean(),
  subtaskingEnabled: v.boolean(),
  projectLeaderCanEditProjectLeader: v.boolean(),
  useWiki: v.boolean(),
  useFileSharing: v.boolean(),
  useWikiTreeView: v.boolean(),
  useOriginalImageSizeAtWiki: v.boolean(),
  useSubversion: v.boolean(),
  useGit: v.boolean(),
  textFormattingRule: v.union([v.literal("backlog"), v.literal("markdown")]),
  archived: v.boolean(),
  displayOrder: v.number(),
  useDevAttributes: v.boolean(),
});

export const useProject = (projectId: number) => {
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseQuery({
    queryKey: ["project", currentSpace.space.spaceKey, projectId],
    queryFn: async () => {
      const cache = createCache([currentSpace.space.spaceKey, "project", projectId.toString()], schema);
      const cached = cache.get();

      if (cached) return cached;

      const project = await dedupe(currentSpace.api.getProject.bind(currentSpace.api), projectId);

      cache.set(project);

      return project;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    gcTime: 1000 * 60 * 60 * 24, // 1 day
  });

  return data;
};
