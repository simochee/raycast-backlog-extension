import { queryOptions } from "@tanstack/react-query";
import { LocalStorage } from "@raycast/api";

export const persistentStateOptions = (key: string) =>
  queryOptions({
    queryKey: ["persistent-state", key],
    queryFn: async () => {
      const value = await LocalStorage.getItem(key);

      if (typeof value !== "string") {
        return null;
      }

      return value;
    },
  });