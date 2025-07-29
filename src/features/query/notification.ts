import { infiniteQueryOptions } from "@tanstack/react-query";
import type { SpaceCredentials } from "~space/utils/credentials";
import { transformNotification } from "~transformer/notification";
import { CACHE_TTL } from "~common/constants/cache";
import { getBacklogApi } from "~space/utils/backlog";

const PER_PAGE = 25;

export const notificationsOptions = (credential: SpaceCredentials) =>
  infiniteQueryOptions({
    queryKey: ["notifications", credential.spaceKey],
    queryFn: ({ pageParam }) =>
      getBacklogApi(credential).getNotifications({
        count: PER_PAGE,
        maxId: pageParam !== -1 ? pageParam : undefined,
      }),
    select: ({ pages, pageParams }) => ({
      pageParams,
      pages: pages.map((page) => page.map(transformNotification)),
    }),
    staleTime: CACHE_TTL.NOTIFICATIONS,
    gcTime: CACHE_TTL.NOTIFICATIONS,
    initialPageParam: -1,
    getNextPageParam: (lastPage) => (lastPage.length === PER_PAGE ? (lastPage.slice().pop()?.id ?? null) : null),
  });
