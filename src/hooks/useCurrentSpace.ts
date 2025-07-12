import { useCachedState } from "@raycast/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Backlog } from "backlog-js";
import { useMemo } from "react";
import { getSpaceHost } from "../utils/space";
import { useCredentials } from "./useCredentials";

export const useCurrentSpace = () => {
  const { credentials } = useCredentials();
  const [currentSpaceKey, setCurrentSpaceKey] = useCachedState<string | undefined>("current-space-key");

  const credential = credentials.find(({ spaceKey }) => spaceKey === currentSpaceKey) || credentials[0];

  if (!credential) {
    throw new Error("No credential found");
  }

  const { spaceKey, apiKey, domain } = credential;
  const host = `${spaceKey}.${domain}`;

  const api = useMemo(() => new Backlog({ host: getSpaceHost(credential), apiKey }), [credential]);

  const { data: space } = useSuspenseQuery({
    queryKey: ["space", credential.spaceKey],
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () => api.getSpace(),
  });

  const setSpaceKey = (newSpaceKey: string) => {
    setCurrentSpaceKey(newSpaceKey);
  };

  return { credential, spaceKey, host, apiKey, api, space, setSpaceKey };
};
