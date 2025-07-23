import type { Detail, List } from "@raycast/api";
import type { Project } from "~common/utils/transformers";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { getProjectImageUrl } from "~common/utils/image";

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  project: Project;
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
