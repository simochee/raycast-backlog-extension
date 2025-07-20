import { infiniteQueryOptions } from "@tanstack/react-query";
import type { CurrentUser } from "~common/hooks/useCurrentUser";
import type { CurrentSpace } from "~space/hooks/useCurrentSpace";
import { CACHE_TTL } from "~common/constants/cache";

const PER_PAGE = 25;

export const myIssuesOptions = (currentSpace: CurrentSpace, currentUser: CurrentUser, filter: string) =>
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
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedIssues({
        count: PER_PAGE,
        offset: pageParam,
      }),
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
