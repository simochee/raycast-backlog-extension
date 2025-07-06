import { useCachedState } from "@raycast/utils";
import { useCredentials } from "./useCredentials";
import { Backlog } from "backlog-js";
import { getSpaceHost, getSpaceWithCache } from "../utils/space";
import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useCurrentSpace = () => {
  const { credentials } = useCredentials();
  const [currentSpaceId, setCurrentSpaceId] = useCachedState<string | undefined>("current-space-id");

  const credential = credentials.find((credential) => credential.spaceKey === currentSpaceId) || credentials[0];

  if (!credential) {
    throw new Error("No credential found");
  }

  const spaceKey = credential?.spaceKey;
  const apiKey = credential?.apiKey;
  const domain = credential?.domain;
  const host = `${spaceKey}.${domain}`;

  const api = useMemo(() => new Backlog({ host: getSpaceHost(credential), apiKey }), [credential]);

  const { data: space } = useSuspenseQuery({
    queryKey: ["space", credential.spaceKey],
    queryFn: () => getSpaceWithCache(credential),
  });

  const setSpaceKey = (spaceKey: string) => {
    setCurrentSpaceId(spaceKey);
  };

  return { credential, spaceKey, host, apiKey, api, space, setSpaceKey };
};
