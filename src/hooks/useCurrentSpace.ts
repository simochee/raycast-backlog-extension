import { useCachedState } from "@raycast/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getBacklogApi } from "../utils/backlog";
import { useCredentials } from "./useCredentials";

export const useCurrentSpace = () => {
  const { credentials } = useCredentials();
  const [currentSpaceKey, setCurrentSpaceKey] = useCachedState<string | undefined>("current-space-key");

  const credential = credentials.find(({ spaceKey }) => spaceKey === currentSpaceKey) || credentials[0];

  if (!credential) {
    throw new Error("No credential found");
  }

  const api = useMemo(() => getBacklogApi(credential), [credential]);

  const { data: space } = useSuspenseQuery({
    queryKey: ["space", credential.spaceKey],
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () => api.getSpace(),
  });

  const setSpaceKey = (newSpaceKey: string) => {
    setCurrentSpaceKey(newSpaceKey);
  };

  return { credential, api, space, setSpaceKey };
};
