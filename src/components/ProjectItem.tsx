import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { getProjectImageUrl } from "../utils/image";
import { CommonActionPanel } from "./CommonActionPanel";
import type { Entity } from "backlog-js";

type Props = {
  project: Entity.Project.Project;
};

export const ProjectItem = ({ project }: Props) => {
  const currentSpace = useCurrentSpace();

  return (
    <List.Item
      title={project.name}
      subtitle={project.projectKey}
      icon={getProjectImageUrl(currentSpace.credential, project.projectKey)}
      actions={
        <CommonActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={currentSpace.toUrl(`/projects/${project.projectKey}`)} />
          <ActionPanel.Submenu title="Open with Project …" shortcut={{ modifiers: ["cmd"], key: "enter" }}>
            <Action.OpenInBrowser
              title="Create Issue"
              url={currentSpace.toUrl(`/add/${project.projectKey}`)}
              icon={Icon.NewDocument}
            />
            <Action.OpenInBrowser
              title="View Issues"
              url={currentSpace.toUrl(`/find/${project.projectKey}`)}
              icon={Icon.Document}
            />
            {project.chartEnabled && (
              <>
                <Action.OpenInBrowser
                  title="View Board"
                  url={currentSpace.toUrl(`/board/${project.projectKey}`)}
                  icon={Icon.BarChart}
                />
                <Action.OpenInBrowser
                  title="View Gantt Chart"
                  url={currentSpace.toUrl(`/gantt/${project.projectKey}`)}
                  icon={Icon.BarChart}
                />
              </>
            )}
            <Action.OpenInBrowser
              title="View Documents"
              url={currentSpace.toUrl(`/document/${project.projectKey}`)}
              icon={Icon.Book}
            />
            {project.useWiki && (
              <Action.OpenInBrowser
                title="Open Wiki"
                url={currentSpace.toUrl(`/wiki/${project.projectKey}/Home`)}
                icon={Icon.Book}
              />
            )}
            {project.useFileSharing && (
              <Action.OpenInBrowser
                title="Browse Files"
                url={currentSpace.toUrl(`/file/${project.projectKey}`)}
                icon={Icon.Folder}
              />
            )}
            {project.useSubversion && (
              <Action.OpenInBrowser
                title="Subversion"
                url={currentSpace.toUrl(`/subversion/${project.projectKey}`)}
                icon={Icon.Code}
              />
            )}
            {project.useGit && (
              <Action.OpenInBrowser
                title="Git"
                url={currentSpace.toUrl(`/git/${project.projectKey}`)}
                icon={Icon.Code}
              />
            )}
          </ActionPanel.Submenu>
        </CommonActionPanel>
      }
    />
  );
};
