import { Action, ActionPanel, Color, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { getProjectImageUrl } from "~common/utils/image";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { ICONS } from "~common/constants/icon";
import { indexToShortcut } from "~common/utils/shortcut";

type Props = {
  project: Entity.Project.Project;
};

export const ProjectItem = ({ project }: Props) => {
  const currentSpace = useCurrentSpace();

  const submenuActions = [
    {
      title: "Add Issue",
      url: currentSpace.toUrl(`/add/${project.projectKey}`),
      icon: ICONS.ISSUE_ADD,
    },
    {
      title: "Issues",
      url: currentSpace.toUrl(`/find/${project.projectKey}`),
      icon: ICONS.ISSUE,
    },
    {
      title: "Board",
      url: currentSpace.toUrl(`/board/${project.projectKey}`),
      icon: ICONS.BOARD,
      disabled: !project.chartEnabled,
    },
    {
      title: "Gantt Chart",
      url: currentSpace.toUrl(`/gantt/${project.projectKey}`),
      icon: ICONS.GANTT,
      disabled: !project.chartEnabled,
    },
    {
      title: "Documents",
      url: currentSpace.toUrl(`/document/${project.projectKey}`),
      icon: ICONS.DOCUMENT,
      disabled: !project.useFileSharing,
    },
    {
      title: "Wiki",
      url: currentSpace.toUrl(`/wiki/${project.projectKey}/Home`),
      icon: ICONS.WIKI,
      disabled: !project.useWiki,
    },
    {
      title: "Files",
      url: currentSpace.toUrl(`/file/${project.projectKey}`),
      icon: ICONS.FILE_SHARING,
      disabled: !project.useFileSharing,
    },
    {
      title: "Subversion",
      url: currentSpace.toUrl(`/subversion/${project.projectKey}`),
      icon: ICONS.SUBVERSION,
      disabled: !project.useSubversion,
    },
    {
      title: "Git",
      url: currentSpace.toUrl(`/git/${project.projectKey}`),
      icon: ICONS.GIT,
      disabled: !project.useGit,
    },
  ];

  return (
    <List.Item
      title={project.name}
      subtitle={project.projectKey}
      icon={getProjectImageUrl(currentSpace.credential, project.projectKey)}
      actions={
        <CommonActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={currentSpace.toUrl(`/projects/${project.projectKey}`)} />
          <ActionPanel.Submenu
            title="Open with Project …"
            icon={ICONS.EXTERNAL}
            shortcut={{ modifiers: ["cmd"], key: "enter" }}
          >
            {submenuActions.map(
              ({ title, url, icon, disabled }, i) =>
                !disabled && (
                  <Action.OpenInBrowser
                    key={title}
                    title={title}
                    url={url}
                    icon={{ source: icon, tintColor: Color.SecondaryText }}
                    shortcut={indexToShortcut(i, ["cmd"])}
                  />
                ),
            )}
          </ActionPanel.Submenu>
        </CommonActionPanel>
      }
    />
  );
};
