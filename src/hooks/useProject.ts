import { usePromise } from "@raycast/utils"
import { useCurrentSpace } from "./useCurrentSpace"
import { createCache } from "../utils/cache"
import * as v from "valibot";
import { dedupe } from "../utils/promise-dedupe";

const schema = v.object({
  id: v.number(),
  projectKey: v.string(),
  name: v.string(),
  chartEnabled: v.optional(v.boolean()),
  useResolvedForChart: v.optional(v.boolean()),
  subtaskingEnabled: v.optional(v.boolean()),
  projectLeaderCanEditProjectLeader: v.optional(v.boolean()),
  useWiki: v.optional(v.boolean()),
  useFileSharing: v.optional(v.boolean()),
  useWikiTreeView: v.optional(v.boolean()),
  useOriginalImageSizeAtWiki: v.optional(v.boolean()),
  useSubversion: v.optional(v.boolean()),
  useGit: v.optional(v.boolean()),
  textFormattingRule: v.optional(v.string()),
  archived: v.optional(v.boolean()),
  displayOrder: v.optional(v.number()),
  useDevAttributes: v.optional(v.boolean()),
})

export const useProject = (projectId: number) => {
  const currentSpace = useCurrentSpace()

  const { data, isLoading } = usePromise(
    async (api: typeof currentSpace.api, spaceKey: typeof currentSpace.spaceKey, projectId: number) => {
      if (!api || !spaceKey) return;
      
      const cache = createCache([spaceKey, 'project', projectId.toString()], schema)
      const cached = cache.get();

      if (cached) return cached;

      const project = await dedupe(api.getProject.bind(api), projectId);

      cache.set(project);

      return project;
    },
    [currentSpace.api, currentSpace.spaceKey, projectId],
  )

  return [data, { isLoading }] as const;
}