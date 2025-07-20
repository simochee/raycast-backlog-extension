import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { LocalStorage } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useCredentials } from "./useCredentials";
import { getBacklogApi } from "~space/utils/backlog";
import { getSpaceHost } from "~space/utils/space";
import { currentSpaceKeyOptions, spaceOptions } from "~common/utils/queryOptions";
import { DELAY } from "~common/constants/cache";

export type CurrentSpace = ReturnType<typeof useCurrentSpace>;

export const useCurrentSpace = () => {
  const { credentials } = useCredentials();
  const { data: initialCurrentSpaceKey } = useSuspenseQuery(currentSpaceKeyOptions());
  const [currentSpaceKey, setCurrentSpaceKey] = useCachedState("cached-current-space-key", initialCurrentSpaceKey);

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
