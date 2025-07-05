import { useCachedState, usePromise } from "@raycast/utils";
import { useCredentials } from "./useCredentials";
import { Backlog } from "backlog-js";
import { getSpaceWithCache } from "../utils/space";
import { useMemo } from "react";

export const useCurrentSpace = () => {
  const { credentials } = useCredentials();
  const [currentSpaceId, setCurrentSpaceId] = useCachedState<string | undefined>('current-space-id')

  const credential = credentials.find((credential) => credential.spaceKey === currentSpaceId) || credentials[0];

  const spaceKey = credential?.spaceKey;
  const apiKey = credential?.apiKey;
  const domain = credential?.domain;
  const host = `${spaceKey}.${domain}`;

  const api = useMemo(() => {
    if (!spaceKey || !apiKey || !domain) return

    return new Backlog({ host: `${spaceKey}.${domain}`, apiKey })
  }, [spaceKey, apiKey, domain])

  const { data: space } = usePromise(
    async (spaceKey: string | undefined, domain: string | undefined, apiKey: string | undefined) => {
      if (!spaceKey || !domain || !apiKey) {
        return;
      }

      return await getSpaceWithCache(spaceKey, domain, apiKey);
    },
    [spaceKey, domain, apiKey],
  );

  const setSpaceKey = (spaceKey: string) => {
    if (!credentials.some((credential) => credential.spaceKey === spaceKey)) {
      throw new Error("Space not found");
    }

    setCurrentSpaceId(spaceKey);
  };

  return { spaceKey, host, apiKey, api, space, setSpaceKey };
};
