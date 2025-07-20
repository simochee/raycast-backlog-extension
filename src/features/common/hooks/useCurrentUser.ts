import { useSuspenseQuery } from "@tanstack/react-query";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { CACHE_TTL } from "~common/constants/cache";

export const useCurrentUser = () => {
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseQuery({
    queryKey: ["project", currentSpace.space.spaceKey, "myself"],
    queryFn: async () => currentSpace.api.getMyself(),
    staleTime: CACHE_TTL.USER,
    gcTime: CACHE_TTL.USER,
  });

  return data;
};
