import { infiniteQueryOptions } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { CACHE_TTL } from "~common/constants/cache";

const PER_PAGE = 25;

export const useQueryOptions = () => {
  const currentSpace = useCurrentSpace();
  const currentUser = useCurrentUser();

  return {
    myIssues: (filter: string) =>
      infiniteQueryOptions({
        queryKey: ["my-issues", currentSpace.space.spaceKey, currentUser.id, filter],
        queryFn: ({ pageParam }) =>
          currentSpace.api.getIssues({
            [filter]: [currentUser.id],
            sort: "updated",
            order: "desc",
            count: PER_PAGE,
            offset: pageParam,
          }),
        staleTime: CACHE_TTL.MY_ISSUES,
        gcTime: CACHE_TTL.MY_ISSUES,
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
      }),
    notifications: () =>
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
      }),
    recentIssues: () =>
      infiniteQueryOptions({
        queryKey: ["recent-viewed", currentSpace.space.spaceKey, "issues"],
        queryFn: ({ pageParam }) =>
          currentSpace.api.getRecentlyViewedIssues({
            count: PER_PAGE,
            offset: pageParam,
          }),
        staleTime: CACHE_TTL.RECENT_VIEWED_ISSUES,
        gcTime: CACHE_TTL.RECENT_VIEWED_ISSUES,
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
      }),
    recentProjects: () =>
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
      }),
    recentWikis: () =>
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
      }),
  };
};
