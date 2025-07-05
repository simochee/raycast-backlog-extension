import { useCachedPromise } from "@raycast/utils";
import { getSpaceWithCache } from "../utils/space";
import { useCredentials } from "./useCredentials";

export const useSpaces = () => {
  const { credentials } = useCredentials()

  const { isLoading, data } = useCachedPromise(
    async (creds: typeof credentials) =>
      await Promise.all(
        creds.map(async ({ spaceKey, domain, apiKey }) => {
          const space = await getSpaceWithCache(spaceKey, domain, apiKey);
          return {
            space,
            domain,
            apiKey,
          };
        }),
      ),
    [credentials],
  );

  return [data, { isLoading }] as const;
}