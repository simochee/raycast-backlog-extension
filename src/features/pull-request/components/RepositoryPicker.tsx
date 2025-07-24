import { Action, Color, Icon, List, useNavigation } from "@raycast/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Project } from "~common/transformers/project";
import type { Repository } from "~common/transformers/repository";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { withProviders } from "~common/utils/providers";
import { repositoriesOptions } from "~common/utils/queryOptions";
import { sortByDisplayOrder } from "~issue/utils/issue";
import { ProjectDrilldown } from "~project/components/ProjectDrilldown";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { useState } from "react";
import { useMyPullRequests } from "../hooks/useMyPullRequests";

type PickerProps = {
  project: Project;
};

const Picker = withProviders(({ project }: PickerProps) => {
  const [selectedRepositories, { toggle }] = useMyPullRequests();

  const currentSpace = useCurrentSpace();

  const { data: repositories } = useSuspenseQuery(repositoriesOptions(currentSpace, project.id));

  return (
    <List>
      {sortByDisplayOrder(repositories).map(({ id, name, projectId, description }) => {
        const isSelected = selectedRepositories.some(
          (selectedRepository) => selectedRepository.projectId === projectId && selectedRepository.repositoryId === id,
        );

        return (
          <List.Item
            key={id}
            title={name}
            subtitle={description}
            icon={
              isSelected
                ? { source: Icon.CheckCircle, tintColor: Color.Green }
                : { source: Icon.Circle, tintColor: Color.SecondaryText }
            }
            actions={
              <CommonActionPanel>
                <Action
                  title={isSelected ? "Remove" : "Add"}
                  onAction={() =>
                    toggle({
                      projectId,
                      projectKey: project.projectKey,
                      repositoryId: id,
                      repositoryName: name,
                    })
                  }
                />
              </CommonActionPanel>
            }
          />
        );
      })}
    </List>
  );
});

export const RepositoryPicker = () => {
  const [selectedRepositories] = useMyPullRequests();
  const navigation = useNavigation();

  return (
    <ProjectDrilldown
      renderAccessories={(project) => {
        const count = selectedRepositories.filter((repository) => repository.projectId === project.id).length;

        if (count === 0) return [];

        return [{ text: `${count} repositor${count > 1 ? "ies" : "y"} selected` }];
      }}
      onSelect={(project) => navigation.push(<Picker project={project} />)}
    />
  );
};
