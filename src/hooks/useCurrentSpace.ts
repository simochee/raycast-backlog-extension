import { getSpaceHost } from "../utils/space";
import { useCredentials } from "./useCredentials";
import { useCachedState } from "@raycast/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Backlog } from "backlog-js";
import { useMemo } from "react";

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
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () => api.getSpace(),
  });

  const setSpaceKey = (spaceKey: string) => {
    setCurrentSpaceId(spaceKey);
  };

  return { credential, spaceKey, host, apiKey, api, space, setSpaceKey };
};
