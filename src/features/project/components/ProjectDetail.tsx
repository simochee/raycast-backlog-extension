import { useCurrentSpace } from "../../../hooks/useCurrentSpace";
import { getProjectImageUrl } from "../../../utils/image";
import type { Detail, List } from "@raycast/api";
import type { Entity } from "backlog-js";

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  project: Entity.Project.Project;
};

export const ProjectDetail = ({ component: Component, project }: Props) => {
  const currentSpace = useCurrentSpace();

  return (
    <Component
      metadata={
        <Component.Metadata>
          <Component.Metadata.Link
            title="Project Key"
            text={project.projectKey}
            target={currentSpace.toUrl(`/projects/${project.projectKey}`)}
          />
          <Component.Metadata.Label
            title="Name"
            text={project.name}
            icon={getProjectImageUrl(currentSpace.credential, project.projectKey)}
          />
        </Component.Metadata>
      }
    />
  );
};
