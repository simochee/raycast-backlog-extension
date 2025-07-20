import { useSuspenseQuery } from "@tanstack/react-query";
import { useCredentials } from "./useCredentials";
import { getBacklogApi } from "~space/utils/backlog";
import { CACHE_TTL } from "~common/constants/cache";

export const useSpaces = () => {
  const { credentials } = useCredentials();

  const { data } = useSuspenseQuery({
    queryKey: ["spaces", ...credentials.map(({ spaceKey }) => spaceKey).sort()],
    queryFn: () =>
      Promise.all(
        credentials.map(async (credential) => {
          const api = getBacklogApi(credential);
          const space = await api.getSpace();
          return {
            credential,
            space,
          };
        }),
      ),
    staleTime: CACHE_TTL.SPACE,
    gcTime: CACHE_TTL.SPACE,
  });

  return data;
};
