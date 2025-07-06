import { Backlog } from "backlog-js";
import { getSpaceHost } from "../utils/space";
import { useCredentials } from "./useCredentials";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSpaces = () => {
  const { credentials } = useCredentials();

  const { data } = useSuspenseQuery({
    queryKey: ["spaces", ...credentials.map(({ spaceKey }) => spaceKey).sort()],
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () =>
      Promise.all(
        credentials.map(async (credential) => {
          const api = new Backlog({ host: getSpaceHost(credential), apiKey: credential.apiKey });
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
