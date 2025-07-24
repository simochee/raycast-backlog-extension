import * as v from "valibot";
import { useCallback } from "react";
import { usePersistentState } from "~common/hooks/usePersistState";

const itemSchema = v.object({
  projectId: v.number(),
  projectKey: v.string(),
  repositoryId: v.number(),
  repositoryName: v.string(),
});

const listSchema = v.array(itemSchema);

export const useMyPullRequests = () => {
  const [selectedRepositories, setRepositories] = usePersistentState("my-pull-requests-repositories", null);
  const parsed = v.safeParse(v.pipe(v.string(), v.parseJson(), listSchema), selectedRepositories);
  const repositories = parsed.success ? parsed.output : [];

  const toggle = useCallback(
    async (repository: v.InferOutput<typeof itemSchema>) => {
      const newValue = repositories.some(
        (item) => item.projectId === repository.projectId && item.repositoryId === repository.repositoryId,
      )
        ? repositories.filter(
            (item) => item.projectId !== repository.projectId && item.repositoryId !== repository.repositoryId,
          )
        : repositories.concat(repository);

      await setRepositories(JSON.stringify(newValue));
    },
    [repositories],
  );

  return [repositories, { toggle }] as const;
};
