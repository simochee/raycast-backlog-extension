import { useSuspenseQuery } from "@tanstack/react-query";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { projectOptions } from "~common/utils/queryOptions";

export const useProject = (projectId: number) => {
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseQuery(projectOptions(currentSpace, projectId));

  return data;
};
