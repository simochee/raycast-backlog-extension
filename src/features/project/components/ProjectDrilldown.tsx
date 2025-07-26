import { Action, Icon, List } from "@raycast/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Project } from "~common/transformers/project";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { getProjectImageUrl } from "~common/utils/image";
import { projectsOptions } from "~common/utils/queryOptions";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";

type Props = {
  renderAccessories?: (project: Project) => Array<List.Item.Accessory>;
  onSelect: (project: Project) => void;
};

export const ProjectDrilldown = ({ renderAccessories, onSelect }: Props) => {
  const currentSpace = useCurrentSpace();

  const { data: projects } = useSuspenseQuery(projectsOptions(currentSpace));

  return (
    <List searchBarAccessory={<SearchBarAccessory />}>
      {projects.map((project) => (
        <List.Item
          key={project.id}
          title={project.name}
          subtitle={project.projectKey}
          icon={getProjectImageUrl(currentSpace.credential, project.id)}
          accessories={[...(renderAccessories?.(project) || []), { icon: Icon.ChevronRight }]}
          actions={
            <CommonActionPanel>
              <Action title={`Select ${project.name}`} onAction={() => onSelect(project)} />
            </CommonActionPanel>
          }
        />
      ))}
    </List>
  );
};
