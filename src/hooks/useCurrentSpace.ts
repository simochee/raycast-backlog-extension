import { useLocalStorage, usePromise } from "@raycast/utils";
import { useCredentials } from "./useCredentials";
import { Backlog } from "backlog-js";
import { getSpaceWithCache } from "../utils/space";

export const useCurrentSpace = () => {
  const { credentials } = useCredentials();
  const { value: currentSpaceId, setValue: setCurrentSpaceId } = useLocalStorage<string>("current-space-id");

  const credential = credentials.find((credential) => credential.spaceKey === currentSpaceId) || credentials[0];

  const spaceKey = credential?.spaceKey;
  const apiKey = credential?.apiKey;
  const domain = credential?.domain;

  const api = spaceKey && apiKey && domain && new Backlog({ host: `${spaceKey}.${domain}`, apiKey });

  const { data: space } = usePromise(
    async (spaceKey: string | undefined, domain: string | undefined, apiKey: string | undefined) => {
      if (!spaceKey || !domain || !apiKey) {
        return;
      }

      return await getSpaceWithCache(spaceKey, domain, apiKey);
    },
    [spaceKey, apiKey, domain],
  );

  const setSpaceKey = (spaceKey: string) => {
    if (!credentials.some((credential) => credential.spaceKey === spaceKey)) {
      throw new Error("Space not found");
    }

    setCurrentSpaceId(spaceKey);
  };

  return { spaceKey, apiKey, api, space, setSpaceKey };
};
