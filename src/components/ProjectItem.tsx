import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { getProjectImageUrl } from "../utils/image";
import { getSpaceHost } from "../utils/space";
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
          <Action.OpenInBrowser
            title="Open in Browser"
            url={`https://${getSpaceHost(currentSpace.credential)}/projects/${project.projectKey}`}
          />
          <ActionPanel.Section title="Actions">
            <Action.OpenInBrowser
              title="Create Issue"
              url={`https://${getSpaceHost(currentSpace.credential)}/add/${project.projectKey}`}
              shortcut={{ modifiers: ["cmd"], key: "n" }}
              icon={Icon.NewDocument}
            />
            <Action.OpenInBrowser
              title="View Issues"
              url={`https://${getSpaceHost(currentSpace.credential)}/find/${project.projectKey}`}
              shortcut={{ modifiers: ["cmd"], key: "i" }}
              icon={Icon.Document}
            />
            {project.chartEnabled && (
              <>
                <Action.OpenInBrowser
                  title="View Board"
                  url={`https://${getSpaceHost(currentSpace.credential)}/board/${project.projectKey}`}
                  shortcut={{ modifiers: ["cmd"], key: "b" }}
                  icon={Icon.BarChart}
                />
                <Action.OpenInBrowser
                  title="View Gantt Chart"
                  url={`https://${getSpaceHost(currentSpace.credential)}/gantt/${project.projectKey}`}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                  icon={Icon.BarChart}
                />
              </>
            )}
            <Action.OpenInBrowser
              title="View Documents"
              url={`https://${getSpaceHost(currentSpace.credential)}/document/${project.projectKey}`}
              shortcut={{ modifiers: ["cmd"], key: "d" }}
              icon={Icon.Book}
            />
            {project.useWiki && (
              <Action.OpenInBrowser
                title="Open Wiki"
                url={`https://${getSpaceHost(currentSpace.credential)}/wiki/${project.projectKey}/Home`}
                shortcut={{ modifiers: ["cmd"], key: "v" }}
                icon={Icon.Book}
              />
            )}
            {project.useFileSharing && (
              <Action.OpenInBrowser
                title="Browse Files"
                url={`https://${getSpaceHost(currentSpace.credential)}/file/${project.projectKey}`}
                shortcut={{ modifiers: ["cmd"], key: "f" }}
                icon={Icon.Folder}
              />
            )}
            {project.useSubversion && (
              <Action.OpenInBrowser
                title="Subversion"
                url={`https://${getSpaceHost(currentSpace.credential)}/subversion/${project.projectKey}`}
                shortcut={{ modifiers: ["cmd"], key: "r" }}
                icon={Icon.Code}
              />
            )}
            {project.useGit && (
              <Action.OpenInBrowser
                title="Git"
                url={`https://${getSpaceHost(currentSpace.credential)}/git/${project.projectKey}`}
                shortcut={{ modifiers: ["cmd"], key: "g" }}
                icon={Icon.Code}
              />
            )}
          </ActionPanel.Section>
        </CommonActionPanel>
      }
    />
  );
};
