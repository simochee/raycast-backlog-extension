import { useSuspenseQueries } from "@tanstack/react-query";
import { useCredentials } from "./useCredentials";
import { spaceOptions } from "~common/utils/queryOptions";

export const useSpaces = () => {
  const { credentials } = useCredentials();

  const results = useSuspenseQueries({
    queries: credentials.map((credential) => spaceOptions(credential)),
  });

  const data = credentials.map((credential) => {
    const space = results.find((result) => result.data.spaceKey === credential.spaceKey);

    if (!space) {
      throw new Error(`Space not found: ${credential.spaceKey}`);
    }

    return {
      credential,
      space: space.data,
    };
  });

  return data;
};
