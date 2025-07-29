import { infiniteQueryOptions } from "@tanstack/react-query";
import type { CurrentSpace } from "~space/hooks/useCurrentSpace";
import { transformRecentlyViewedWiki } from "~transformer/wiki";
import { CACHE_TTL } from "~common/constants/cache";

const PER_PAGE = 25;

export const recentWikisOptions = (currentSpace: CurrentSpace) =>
  infiniteQueryOptions({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "wikis"],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedWikis({
        count: PER_PAGE,
        offset: pageParam,
      }),
    select: ({ pages, pageParams }) => ({
      pageParams,
      pages: pages.map((page) => page.map(transformRecentlyViewedWiki)),
    }),
    staleTime: CACHE_TTL.RECENT_VIEWED_WIKIS,
    gcTime: CACHE_TTL.RECENT_VIEWED_WIKIS,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });
