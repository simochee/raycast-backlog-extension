import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { LocalStorage } from "@raycast/api";
import { useCredentials } from "./useCredentials";
import { getBacklogApi } from "~space/utils/backlog";
import { getSpaceHost } from "~space/utils/space";
import { spaceOptions } from "~query/space";
import { DELAY } from "~common/constants/cache";
import { usePersistentState } from "~common/hooks/usePersistState";

export type CurrentSpace = ReturnType<typeof useCurrentSpace>;

export const useCurrentSpace = () => {
  const { credentials } = useCredentials();
  const [currentSpaceKey, setCurrentSpaceKey] = usePersistentState("current-space-key", null);

  const credential = credentials.find(({ spaceKey }) => spaceKey === currentSpaceKey) || credentials[0];

  if (!credential) {
    throw new Error("No credential found");
  }

  const api = useMemo(() => getBacklogApi(credential), [credential]);

  const { data: space } = useSuspenseQuery(spaceOptions(credential));

  const setSpaceKey = async (newSpaceKey: string) => {
    setCurrentSpaceKey(newSpaceKey);

    await LocalStorage.setItem("current-space-key", newSpaceKey);

    await new Promise((resolve) => setTimeout(resolve, DELAY.NOTIFICATION_UPDATE));
  };

  const toUrl = (path: string, searchParams?: URLSearchParams): string => {
    const url = new URL(path, `https://${getSpaceHost(credential)}`);

    if (searchParams) {
      url.search = `?${searchParams.toString()}}`;
    }

    return url.href;
  };

  return { credential, api, space, setSpaceKey, toUrl };
};
