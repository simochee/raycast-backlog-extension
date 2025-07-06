import { getSpaceWithCache } from "../utils/space";
import { useCredentials } from "./useCredentials";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { SpaceCredentials } from "../utils/credentials";

export const useSpaces = () => {
  const { credentials } = useCredentials();

  const { data } = useSuspenseQuery({
    queryKey: ["spaces"],
    queryFn: () =>
      Promise.all(
        credentials.map(async (credential: SpaceCredentials) => {
          const space = await getSpaceWithCache(credential);
          return {
            credential,
            space,
          };
        }),
      ),
  });

  return data;
};
