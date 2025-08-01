import { infiniteQueryOptions } from "@tanstack/react-query";
import type { CurrentSpace } from "~space/hooks/useCurrentSpace";
import type { CurrentUser } from "~common/hooks/useCurrentUser";
import { transformIssue, transformRecentlyViewedIssue } from "~transformer/issue";
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
        notStatusId: [4],
        count: PER_PAGE,
        offset: pageParam,
      }),
    select: ({ pages, pageParams }) => ({
      pageParams,
      pages: pages.map((page) => page.map(transformIssue)),
    }),
    staleTime: CACHE_TTL.MY_ISSUES,
    gcTime: CACHE_TTL.MY_ISSUES,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

export const recentIssuesOptions = (currentSpace: CurrentSpace) =>
  infiniteQueryOptions({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "issues"],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedIssues({
        count: PER_PAGE,
        offset: pageParam,
      }),
    select: ({ pages, pageParams }) => ({
      pageParams,
      pages: pages.map((page) => page.map(transformRecentlyViewedIssue)),
    }),
    staleTime: CACHE_TTL.RECENT_VIEWED_ISSUES,
    gcTime: CACHE_TTL.RECENT_VIEWED_ISSUES,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });
