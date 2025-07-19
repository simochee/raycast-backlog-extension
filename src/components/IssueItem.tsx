import { Action, ActionPanel, Color, Icon, Image, List } from "@raycast/api";
import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { useProject } from "../hooks/useProject";
import { getProjectImageUrl, getUserIconUrl } from "../utils/image";
import { buildDueDate } from "../utils/issue";
import { CommonActionPanel } from "./CommonActionPanel";
import { IssueDetail } from "./IssueDetail";
import type { Entity } from "backlog-js";

type Props = {
  issue: Entity.Issue.Issue;
  actions?: React.ReactNode;
  isShowingDetail: boolean;
  onToggleShowingDetail: () => void;
};

export const IssueItem = ({ issue, actions, isShowingDetail, onToggleShowingDetail }: Props) => {
  const currentSpace = useCurrentSpace();
  const project = useProject(issue.projectId);

  const url = currentSpace.toUrl(`/view/${issue.issueKey}`);

  const accessories: Array<List.Item.Accessory> = [];
  const dueDate = buildDueDate(issue.dueDate);

  // Due Date
  if (dueDate) {
    accessories.push({
      text: { value: dueDate.formatted, color: dueDate.past ? Color.Red : Color.SecondaryText },
      icon: dueDate.past ? { source: "tabler/flame.svg", tintColor: Color.Red } : null,
    });
  }
  // Status
  accessories.push({ tag: { value: issue.status.name, color: issue.status.color } });
  // Priority
  accessories.push({
    icon:
      issue.priority.id === 4
        ? { source: Icon.ArrowDown, tintColor: Color.Green }
        : issue.priority.id === 2
          ? { source: Icon.ArrowUp, tintColor: Color.Red }
          : { source: Icon.ArrowRight, tintColor: Color.Blue },
    tooltip: issue.priority.name,
  });
  // Assignee
  accessories.push({
    icon: issue.assignee
      ? {
          source: getUserIconUrl(currentSpace.credential, issue.assignee.id),
          mask: Image.Mask.Circle,
        }
      : { source: Icon.PersonLines, tintColor: Color.SecondaryText },
    tooltip: issue.assignee?.name ?? "Unassigned",
  });

  console.log(issue.issueKey, JSON.stringify(issue.customFields));

  return (
    <List.Item
      title={issue.summary}
      subtitle={isShowingDetail ? undefined : issue.issueKey}
      icon={getProjectImageUrl(currentSpace.credential, issue.projectId)}
      detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} />}
      accessories={isShowingDetail ? undefined : accessories}
      actions={
        <CommonActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={currentSpace.toUrl(`/view/${issue.issueKey}`)} />
          <Action
            title="Toggle Details"
            icon={Icon.AppWindowSidebarRight}
            shortcut={{ modifiers: ["cmd"], key: "f" }}
            onAction={onToggleShowingDetail}
          />
          {actions}
          <ActionPanel.Section title="Actions">
            <Action.CopyToClipboard
              title="Copy Issue Key"
              content={issue.issueKey}
              shortcut={{ modifiers: ["ctrl"], key: "c" }}
            />
            <Action.CopyToClipboard
              title="Copy Issue Key and Subject"
              content={`${issue.issueKey} ${issue.summary}`}
              shortcut={{ modifiers: ["ctrl", "shift"], key: "c" }}
            />
            <Action.CopyToClipboard
              title="Copy Issue URL"
              content={url}
              shortcut={{ modifiers: ["cmd", "shift"], key: "u" }}
            />
          </ActionPanel.Section>
        </CommonActionPanel>
      }
    />
  );
};
