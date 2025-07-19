import { Action, ActionPanel, Color, Icon, Image, List } from "@raycast/api";
import { differenceInDays, format, parseISO } from "date-fns";
import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { useProject } from "../hooks/useProject";
import { getProjectImageUrl, getUserIconUrl } from "../utils/image";
import { CommonActionPanel } from "./CommonActionPanel";
import type { Entity } from "backlog-js";

type Props = {
  issue: Entity.Issue.Issue;
  actions?: React.ReactNode;
  isShowingDetail: boolean;
  onToggleShowingDetail: () => void;
};

const buildDueDate = (date: string | undefined) => {
  if (!date) return;

  const now = new Date();
  const dueDate = parseISO(date);
  const diffDays = differenceInDays(dueDate, now);

  return {
    formatted:
      diffDays === 0
        ? "Today"
        : diffDays === 1
          ? "Tomorrow"
          : diffDays === -1
            ? "Yesterday"
            : format(dueDate, "MMM. i, yyyy"),
    past: diffDays < 0,
  };
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
      detail={
        <List.Item.Detail
          markdown={issue.description}
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Label title={issue.issueKey} text={issue.summary} />
              <List.Item.Detail.Metadata.TagList title="">
                {dueDate && (
                  <List.Item.Detail.Metadata.TagList.Item
                    text={dueDate.formatted}
                    color={dueDate.past ? Color.Red : Color.PrimaryText}
                    icon={dueDate.past ? { source: "tabler/flame.svg", tintColor: Color.Red } : undefined}
                  />
                )}
                <List.Item.Detail.Metadata.TagList.Item text={issue.issueType.name} color={issue.issueType.color} />
                <List.Item.Detail.Metadata.TagList.Item text={issue.status.name} color={issue.status.color} />
                {project.useDevAttributes && (
                  <List.Item.Detail.Metadata.TagList.Item
                    text={issue.priority.name}
                    icon={
                      issue.priority.id === 4
                        ? Icon.ArrowDown
                        : issue.priority.id === 2
                          ? Icon.ArrowUp
                          : Icon.ArrowRight
                    }
                    color={issue.priority.id === 4 ? Color.Green : issue.priority.id === 2 ? Color.Red : Color.Blue}
                  />
                )}
              </List.Item.Detail.Metadata.TagList>
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
              {issue.category.length > 0 && (
                <List.Item.Detail.Metadata.TagList title="Category">
                  {issue.category.map(({ id, name }) => (
                    <List.Item.Detail.Metadata.TagList.Item key={id} text={name} color={Color.SecondaryText} />
                  ))}
                </List.Item.Detail.Metadata.TagList>
              )}
              {project.useDevAttributes && (
                <>
                  {issue.milestone.length > 0 && (
                    <List.Item.Detail.Metadata.TagList title="Milestone">
                      {issue.milestone.map(({ id, name }) => (
                        <List.Item.Detail.Metadata.TagList.Item key={id} text={name} color={Color.SecondaryText} />
                      ))}
                    </List.Item.Detail.Metadata.TagList>
                  )}
                  {issue.versions.length > 0 && (
                    <List.Item.Detail.Metadata.TagList title="Version">
                      {issue.versions.map(({ id, name, archived }) => (
                        <List.Item.Detail.Metadata.TagList.Item
                          key={id}
                          text={name}
                          color={archived ? "white" : Color.SecondaryText}
                        />
                      ))}
                    </List.Item.Detail.Metadata.TagList>
                  )}
                </>
              )}
              {issue.resolution && <List.Item.Detail.Metadata.Label title="Resolution" text={issue.resolution.name} />}
              <List.Item.Detail.Metadata.Separator />
              {issue.customFields.length > 0 && (
                <>
                  {issue.customFields.map((field) => {
                    console.log(issue.issueKey, field.name, field.value);

                    if (field.value == null) return null;

                    if (Array.isArray(field.value)) {
                      if (field.value.length === 0) return null;

                      return (
                        <List.Item.Detail.Metadata.TagList title={field.name}>
                          {field.value.map(({ name }) => (
                            <List.Item.Detail.Metadata.TagList.Item key={name} text={name} />
                          ))}
                        </List.Item.Detail.Metadata.TagList>
                      );
                    }

                    if (typeof field.value === "object") {
                      return (
                        <List.Item.Detail.Metadata.TagList title={field.name}>
                          <List.Item.Detail.Metadata.TagList.Item text={field.value.name} />
                        </List.Item.Detail.Metadata.TagList>
                      );
                    }

                    if (field.fieldTypeId === 4) {
                      return (
                        <List.Item.Detail.Metadata.Label
                          title={field.name}
                          text={format(parseISO(field.value), "MMM. i, yyyy")}
                        />
                      );
                    }

                    return <List.Item.Detail.Metadata.Label title={field.name} text={field.value.toString()} />;
                  })}
                </>
              )}
            </List.Item.Detail.Metadata>
          }
        />
      }
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
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
            <Action.CopyToClipboard
              title="Copy Issue Key and Subject"
              content={`${issue.issueKey} ${issue.summary}`}
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
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
