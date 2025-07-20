import { useSuspenseQuery } from "@tanstack/react-query";
import { useCredentials } from "./useCredentials";
import { spacesOptions } from "~common/utils/queryOptions";

export const useSpaces = () => {
  const { credentials } = useCredentials();

  const { data } = useSuspenseQuery(spacesOptions(credentials));

  return data;
};
