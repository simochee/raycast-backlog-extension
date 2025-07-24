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

const useRepositoriesState = () => {
  const [repositories, setRepositories] = usePersistentState("my-pull-requests-repositories", null);
  const parsed = v.safeParse(v.pipe(v.string(), v.parseJson(), listSchema), repositories);

  return [parsed.success ? parsed.output : [], setRepositories] as const;
};

const useCurrentRepository = () => {
  const [currentRepository, setCurrentRepository] = usePersistentState("my-pull-requests-current-repository", null);
  const parsed = v.safeParse(
    v.pipe(
      v.string(),
      v.transform((input) => Number.parseInt(input, 10)),
      v.integer(),
    ),
    currentRepository,
  );

  return [parsed.success ? parsed.output : null, setCurrentRepository] as const;
};

export const useMyPullRequests = () => {
  const [selectedRepositories, setRepositories] = useRepositoriesState();
  const [currentRepositoryId, changeCurrentRepositoryId] = useCurrentRepository();

  const currentRepository =
    selectedRepositories.find((repository) => repository.repositoryId === currentRepositoryId) ||
    selectedRepositories[0];

  const toggleSelectedRepository = useCallback(
    async (repository: v.InferOutput<typeof itemSchema>) => {
      const newValue = selectedRepositories.some(
        (item) => item.projectId === repository.projectId && item.repositoryId === repository.repositoryId,
      )
        ? selectedRepositories.filter(
            (item) => item.projectId !== repository.projectId && item.repositoryId !== repository.repositoryId,
          )
        : selectedRepositories.concat(repository);

      await setRepositories(JSON.stringify(newValue));
    },
    [selectedRepositories],
  );

  return {
    selectedRepositories,
    currentRepository,
    changeCurrentRepositoryId: (id: number) => changeCurrentRepositoryId(id.toString()),
    toggleSelectedRepository,
  };
};
