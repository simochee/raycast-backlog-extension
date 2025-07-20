import { useSuspenseQuery } from "@tanstack/react-query";
import { useCredentials } from "./useCredentials";
import { getBacklogApi } from "~space/utils/backlog";

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
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    gcTime: 1000 * 60 * 60 * 24, // 1 day
  });

  return data;
};
