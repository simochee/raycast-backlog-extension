import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { useProject } from "../hooks/useProject";
import { getProjectImageUrl, getUserIconUrl } from "../utils/image";
import { CommonActionPanel } from "./CommonActionPanel";
import { Action, ActionPanel, Color, Icon, Image, List } from "@raycast/api";
import type { Entity } from "backlog-js";

type Props = {
  issue: Entity.Issue.Issue;
  actions?: React.ReactNode;
  onToggleShowingDetail(): void;
};

export const IssueItem = ({ issue, actions, onToggleShowingDetail }: Props) => {
  const currentSpace = useCurrentSpace();
  const project = useProject(issue.projectId);

  const accessories: List.Item.Accessory[] = [];

  // Due Date
  if (issue.dueDate) {
    const dueDate = new Date(issue.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const color = diffDays < 0 ? Color.Red : Color.SecondaryText;
    const value =
      diffDays === 0
        ? "Today"
        : diffDays === 1
          ? "Tomorrow"
          : diffDays === -1
            ? "Yesterday"
            : `${["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."][dueDate.getMonth()]} ${dueDate.getDate()}`;
    accessories.push({
      text: { value, color },
      icon: diffDays < 0 ? { source: Icon.Alarm, tintColor: Color.Red } : null,
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

  return (
    <List.Item
      title={issue.summary}
      subtitle={issue.issueKey}
      icon={getProjectImageUrl(currentSpace.credential, issue.projectId)}
      detail={
        <List.Item.Detail
          markdown={issue.description}
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Label title="Subject" text={issue.summary} />
              <List.Item.Detail.Metadata.Label title="Issue Key" text={issue.issueKey} />
              <List.Item.Detail.Metadata.Label
                title="Type"
                text={issue.issueType.name}
                icon={{ source: Icon.CircleFilled, tintColor: issue.issueType.color }}
              />
              <List.Item.Detail.Metadata.Label
                title="Status"
                text={issue.status.name}
                icon={{ source: Icon.CircleFilled, tintColor: issue.status.color }}
              />
              <List.Item.Detail.Metadata.Label
                title="Assignee"
                text={issue.assignee?.name ?? "Unassigned"}
                icon={
                  issue.assignee
                    ? {
                        source: getUserIconUrl(currentSpace.credential, issue.assignee.id),
                        mask: Image.Mask.Circle,
                      }
                    : null
                }
              />
              <List.Item.Detail.Metadata.Label
                title="Due Date"
                text={issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : "No due date"}
                icon={issue.dueDate ? { source: Icon.Calendar } : null}
              />
              {project?.useDevAttributes && (
                <List.Item.Detail.Metadata.Label
                  title="Priority"
                  text={issue.priority.name}
                  icon={{
                    source: Icon.ArrowDown,
                    tintColor: issue.priority.id === 4 ? Color.Green : issue.priority.id === 2 ? Color.Red : Color.Blue,
                  }}
                />
              )}
              <List.Item.Detail.Metadata.Label title="Category" text={issue.category.map((c) => c.name).join(", ")} />
              {project?.useDevAttributes && (
                <>
                  <List.Item.Detail.Metadata.Label
                    title="Milestone"
                    text={issue.milestone.map((m) => m.name).join(", ")}
                  />
                  <List.Item.Detail.Metadata.Label
                    title="Version"
                    text={issue.versions.map((v) => v.name).join(", ")}
                  />
                </>
              )}
              <List.Item.Detail.Metadata.Label title="Resolution" text={issue.resolution?.name} />
              {issue.customFields.length > 0 && (
                <>
                  <List.Item.Detail.Metadata.Separator />
                  {issue.customFields.map((field) => {
                    const value = Array.isArray(field.value)
                      ? field.value
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .map(({ name }) => name)
                          .join(", ")
                      : field.fieldTypeId === 4 && field.value
                        ? new Date(field.value).toLocaleDateString()
                        : field.value || "";

                    return <List.Item.Detail.Metadata.Label key={field.id} title={field.name} text={value} />;
                  })}
                </>
              )}
            </List.Item.Detail.Metadata>
          }
        />
      }
      accessories={accessories}
      actions={
        <CommonActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={`https://${currentSpace.host}/view/${issue.issueKey}`} />

          {actions}
          <ActionPanel.Section title="Actions">
            <Action.CopyToClipboard
              title="Copy Issue Key"
              content={issue.issueKey}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
            <Action.CopyToClipboard
              title="Copy Issue Key and Subject"
              content={`${issue.issueKey} ${issue.summary}`}
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            />
            <Action.CopyToClipboard
              title="Copy Issue URL"
              content={`https://${currentSpace.host}/view/${issue.issueKey}`}
              shortcut={{ modifiers: ["cmd", "shift"], key: "u" }}
            />
            <Action
              title="Toggle Details"
              icon={Icon.AppWindowSidebarRight}
              shortcut={{ modifiers: ["cmd", "shift"], key: "f" }}
              onAction={onToggleShowingDetail}
            />
          </ActionPanel.Section>
        </CommonActionPanel>
      }
    />
  );
};
