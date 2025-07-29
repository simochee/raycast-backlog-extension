import { queryOptions } from "@tanstack/react-query";
import type { CurrentSpace } from "~space/hooks/useCurrentSpace";
import type { CurrentUser } from "~common/hooks/useCurrentUser";
import { transformRepository } from "~transformer/repository";
import { transformPullRequest } from "~transformer/pull-request";
import { CACHE_TTL } from "~common/constants/cache";

export const repositoriesOptions = (currentSpace: CurrentSpace, projectId: number) =>
  queryOptions({
    queryKey: ["repositories", currentSpace.space.spaceKey, projectId],
    queryFn: async () => {
      const repositories = await currentSpace.api.getGitRepositories(projectId);

      return repositories.map(transformRepository);
    },
  });

export const repositoryOptions = (currentSpace: CurrentSpace, projectId: number, repositoryId: number | undefined) =>
  queryOptions({
    queryKey: ["repository", projectId, repositoryId],
    queryFn: async () => {
      if (repositoryId == null) return null;

      const repository = await currentSpace.api.getGitRepository(projectId, repositoryId.toString());

      return transformRepository(repository);
    },
    staleTime: CACHE_TTL.REPOSITORY,
    gcTime: CACHE_TTL.REPOSITORY,
  });

export const myPullRequestsOptions = (
  currentSpace: CurrentSpace,
  projectId: number | undefined,
  repositoryId: number | undefined,
  currentUser: CurrentUser,
  filter: string,
) =>
  queryOptions({
    queryKey: ["pull-requests", projectId, repositoryId, currentUser.id, filter],
    queryFn: async () => {
      if (projectId == null || repositoryId == null) return null;

      const pullRequests = await currentSpace.api.getPullRequests(projectId, repositoryId.toString(), {
        [filter]: [currentUser.id],
        statusId: [1],
        // @ts-expect-error
        sort: "updated",
        order: "desc",
      });

      return pullRequests.map(transformPullRequest);
    },
    enabled: projectId != null && repositoryId != null,
    staleTime: CACHE_TTL.PULL_REQUESTS,
    gcTime: CACHE_TTL.PULL_REQUESTS,
  });