import { useCachedState } from "@raycast/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getBacklogApi } from "../utils/backlog";
import { useCredentials } from "./useCredentials";
import { getSpaceHost } from "../utils/space";

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
    gcTime: 1000 * 60 * 10, // 10 minutes
    queryFn: () => api.getSpace(),
  });

  const setSpaceKey = (newSpaceKey: string) => {
    setCurrentSpaceKey(newSpaceKey);
  };

  const toUrl = (path: string, searchParams?: URLSearchParams): string => {
    const url = new URL(path, `https://${getSpaceHost(credential)}`);

    if (searchParams) {
      url.search = `?${searchParams.toString()}}`
    }

    return url.href;
  }

  return { credential, api, space, setSpaceKey, toUrl };
};
