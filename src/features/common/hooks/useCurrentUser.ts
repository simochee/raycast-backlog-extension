import { useSuspenseQuery } from "@tanstack/react-query";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { myselfOptions } from "~query/auth";

export type CurrentUser = ReturnType<typeof useCurrentUser>;

export const useCurrentUser = () => {
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseQuery(myselfOptions(currentSpace));

  return data;
};
