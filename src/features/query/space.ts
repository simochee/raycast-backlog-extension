import { queryOptions } from "@tanstack/react-query";
import type { SpaceCredentials } from "~space/utils/credentials";
import { transformNotificationCount } from "~transformer/notification";
import { type Space, transformSpace } from "~transformer/space";
import { CACHE_TTL } from "~common/constants/cache";
import { getBacklogApi } from "~space/utils/backlog";

export const notificationCountOptions = (credential: SpaceCredentials) =>
  queryOptions({
    queryKey: ["notification-count", credential.spaceKey],
    queryFn: () =>
      getBacklogApi(credential).getNotificationsCount({
        alreadyRead: false,
        resourceAlreadyRead: false,
      }),
    select: transformNotificationCount,
    staleTime: CACHE_TTL.NOTIFICATION_COUNT,
    gcTime: CACHE_TTL.NOTIFICATION_COUNT,
  });

export const spaceOptions = (credential: SpaceCredentials) =>
  queryOptions({
    queryKey: ["space", credential.spaceKey],
    queryFn: async () => {
      try {
        return transformSpace(await getBacklogApi(credential).getSpace());
      } catch {
        return {
          name: credential.spaceKey,
          spaceKey: credential.spaceKey,
        } satisfies Space;
      }
    },
    staleTime: CACHE_TTL.SPACE,
    gcTime: CACHE_TTL.SPACE,
  });
