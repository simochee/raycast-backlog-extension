import { useSuspenseQuery } from "@tanstack/react-query";
import { getBacklogApi } from "../utils/backlog";
import { useCredentials } from "./useCredentials";

export const useSpaces = () => {
  const { credentials } = useCredentials();

  const { data } = useSuspenseQuery({
    queryKey: ["spaces", ...credentials.map(({ spaceKey }) => spaceKey).sort()],
    staleTime: 1000 * 60 * 10, // 10 minutes
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
  });

  return data;
};
