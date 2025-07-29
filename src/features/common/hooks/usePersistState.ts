import { LocalStorage } from "@raycast/api";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { DELAY } from "~common/constants/cache";
import { persistentStateOptions } from "~query/utils";

export const usePersistentState = <TValue extends string, TFallbackValue extends string | null = TValue>(
  key: string,
  fallbackValue: TFallbackValue,
) => {
  const queryClient = useQueryClient();
  const { data: state } = useSuspenseQuery(persistentStateOptions(key));

  const setState = async (newState: TValue | TFallbackValue) => {
    if (newState == null) {
      await LocalStorage.removeItem(key);
    } else {
      await LocalStorage.setItem(key, newState);
    }

    await queryClient.setQueryData(persistentStateOptions(key).queryKey, newState);
    await new Promise((resolve) => setTimeout(resolve, DELAY.NOTIFICATION_UPDATE));
  };

  return [(state ?? fallbackValue) as TValue | TFallbackValue, setState] as const;
};
