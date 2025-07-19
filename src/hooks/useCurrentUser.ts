import { useSuspenseQuery } from "@tanstack/react-query";
import { useCurrentSpace } from "./useCurrentSpace";

export const useCurrentUser = () => {
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseQuery({
    queryKey: ["project", currentSpace.space.spaceKey, "myself"],
    queryFn: async () => currentSpace.api.getMyself(),
    staleTime: 1000 * 60 * 60 * 24 * 24, // 24 days
    gcTime: 1000 * 60 * 60 * 24 * 24, // 24 days
  });

  return data;
};
