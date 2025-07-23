import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import * as v from "valibot";
import { LocalStorage } from "@raycast/api";
import { createCache } from "./cache";
import { dedupe } from "./promise-dedupe";
import { transformIssue, transformRecentlyViewedIssue } from "./transformers";
import type { CurrentUser } from "~common/hooks/useCurrentUser";
import type { CurrentSpace } from "~space/hooks/useCurrentSpace";
import type { SpaceCredentials } from "~space/utils/credentials";
import { CACHE_TTL } from "~common/constants/cache";
import { getCredentials } from "~space/utils/credentials";
import { getBacklogApi } from "~space/utils/backlog";

const PER_PAGE = 25;

export const credentialsOptions = () =>
  queryOptions({
    queryKey: ["credentials"],
    queryFn: () => getCredentials(),
  });

export const myselfOptions = (currentSpace: CurrentSpace) =>
  queryOptions({
    queryKey: ["project", currentSpace.space.spaceKey, "myself"],
    queryFn: async () => currentSpace.api.getMyself(),
    staleTime: CACHE_TTL.USER,
    gcTime: CACHE_TTL.USER,
  });

export const spaceOptions = (credential: SpaceCredentials) =>
  queryOptions({
    queryKey: ["space", credential.spaceKey],
    queryFn: () => getBacklogApi(credential).getSpace(),
    staleTime: CACHE_TTL.SPACE,
    gcTime: CACHE_TTL.SPACE,
  });

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
        }),
      );
      const cached = cache.get();

      if (cached) return cached;

      const project = await dedupe(currentSpace.api.getProject.bind(currentSpace.api), projectId);

      cache.set(project);

      return project;
    },
    staleTime: CACHE_TTL.PROJECT,
    gcTime: CACHE_TTL.PROJECT,
  });

export const myIssuesOptions = (currentSpace: CurrentSpace, currentUser: CurrentUser, filter: string) =>
  infiniteQueryOptions({
    queryKey: ["my-issues", currentSpace.space.spaceKey, currentUser.id, filter],
    queryFn: async ({ pageParam }) => {
      const issues = await currentSpace.api.getIssues({
        [filter]: [currentUser.id],
        sort: "updated",
        order: "desc",
        count: PER_PAGE,
        offset: pageParam,
      });

      return issues.map(transformIssue);
    },
    staleTime: CACHE_TTL.MY_ISSUES,
    gcTime: CACHE_TTL.MY_ISSUES,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

export const notificationsOptions = (currentSpace: CurrentSpace) =>
  infiniteQueryOptions({
    queryKey: ["notifications", currentSpace.credential.spaceKey],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getNotifications({
        count: PER_PAGE,
        maxId: pageParam !== -1 ? pageParam : undefined,
      }),
    staleTime: CACHE_TTL.NOTIFICATIONS,
    gcTime: CACHE_TTL.NOTIFICATIONS,
    initialPageParam: -1,
    getNextPageParam: (lastPage) => (lastPage.length === PER_PAGE ? (lastPage.slice().pop()?.id ?? null) : null),
  });

export const recentIssuesOptions = (currentSpace: CurrentSpace) =>
  infiniteQueryOptions({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "issues"],
    queryFn: async ({ pageParam }) => {
      const issues = await currentSpace.api.getRecentlyViewedIssues({
        count: PER_PAGE,
        offset: pageParam,
      });

      return issues.map(transformRecentlyViewedIssue);
    },
    staleTime: CACHE_TTL.RECENT_VIEWED_ISSUES,
    gcTime: CACHE_TTL.RECENT_VIEWED_ISSUES,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

export const recentProjectsOptions = (currentSpace: CurrentSpace) =>
  infiniteQueryOptions({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "projects"],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedProjects({
        count: PER_PAGE,
        offset: pageParam,
      }),
    staleTime: CACHE_TTL.RECENT_VIEWED_PROJECTS,
    gcTime: CACHE_TTL.RECENT_VIEWED_PROJECTS,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

export const recentWikisOptions = (currentSpace: CurrentSpace) =>
  infiniteQueryOptions({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "wikis"],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedWikis({
        count: PER_PAGE,
        offset: pageParam,
      }),
    staleTime: CACHE_TTL.RECENT_VIEWED_WIKIS,
    gcTime: CACHE_TTL.RECENT_VIEWED_WIKIS,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

export const repositoryOptions = (currentSpace: CurrentSpace, projectId: number, repositoryId: number | undefined) =>
  queryOptions({
    queryKey: ["repository", projectId, repositoryId],
    queryFn: async () => {
      if (repositoryId == null) return null;

      return currentSpace.api.getGitRepository(projectId, repositoryId.toString());
    },
    staleTime: CACHE_TTL.REPOSITORY,
    gcTime: CACHE_TTL.REPOSITORY,
  });

export const persistentStateOptions = (key: string) =>
  queryOptions({
    queryKey: ["persistent-state", key],
    queryFn: async () => {
      const value = await LocalStorage.getItem(key);

      if (typeof value !== "string") {
        return null;
      }

      return value;
    },
  });
