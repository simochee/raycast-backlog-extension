import { queryOptions } from "@tanstack/react-query";
import type { CurrentSpace } from "~space/hooks/useCurrentSpace";
import { transformUser } from "~transformer/user";
import { CACHE_TTL } from "~common/constants/cache";
import { getCredentials } from "~space/utils/credentials";

export const credentialsOptions = () =>
  queryOptions({
    queryKey: ["credentials"],
    queryFn: () => getCredentials(),
  });

export const myselfOptions = (currentSpace: CurrentSpace) =>
  queryOptions({
    queryKey: ["project", currentSpace.space.spaceKey, "myself"],
    queryFn: () => currentSpace.api.getMyself(),
    select: transformUser,
    staleTime: CACHE_TTL.USER,
    gcTime: CACHE_TTL.USER,
  });
