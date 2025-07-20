import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { getProjectImageUrl } from "~common/utils/image";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { ICONS } from "~common/constants/icon";

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
      key: "1" as const,
    },
    {
      title: "Issues",
      url: currentSpace.toUrl(`/find/${project.projectKey}`),
      icon: ICONS.ISSUE,
      key: "2" as const,
    },
    {
      title: "Board",
      url: currentSpace.toUrl(`/board/${project.projectKey}`),
      icon: ICONS.BOARD,
      disabled: !project.chartEnabled,
      key: "3" as const,
    },
    {
      title: "Gantt Chart",
      url: currentSpace.toUrl(`/gantt/${project.projectKey}`),
      icon: ICONS.GANTT,
      disabled: !project.chartEnabled,
      key: "4" as const,
    },
    {
      title: "Documents",
      url: currentSpace.toUrl(`/document/${project.projectKey}`),
      icon: ICONS.DOCUMENT,
      disabled: !project.useFileSharing,
      key: "5" as const,
    },
    {
      title: "Wiki",
      url: currentSpace.toUrl(`/wiki/${project.projectKey}/Home`),
      icon: ICONS.WIKI,
      disabled: !project.useWiki,
      key: "6" as const,
    },
    {
      title: "Files",
      url: currentSpace.toUrl(`/file/${project.projectKey}`),
      icon: ICONS.FILE_SHARING,
      disabled: !project.useFileSharing,
      key: "7" as const,
    },
    {
      title: "Subversion",
      url: currentSpace.toUrl(`/subversion/${project.projectKey}`),
      icon: ICONS.SUBVERSION,
      disabled: !project.useSubversion,
      key: "8" as const,
    },
    {
      title: "Git",
      url: currentSpace.toUrl(`/git/${project.projectKey}`),
      icon: ICONS.GIT,
      disabled: !project.useGit,
      key: "9" as const,
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
            {submenuActions
              .filter(({ disabled }) => !disabled)
              .map(({ title, url, icon, key }) => (
                <Action.OpenInBrowser
                  key={key}
                  title={title}
                  url={url}
                  icon={{ source: icon, tintColor: Color.SecondaryText }}
                  shortcut={{ modifiers: ["cmd"], key }}
                />
              ))}
          </ActionPanel.Submenu>
        </CommonActionPanel>
      }
    />
  );
};
