import { Color, Icon, Image } from "@raycast/api";
import { format, parseISO } from "date-fns";
import type { Detail, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { getUserIconUrl } from "~common/utils/image";
import { buildDueDate } from "~issue/utils/issue";
import { ICONS } from "~common/constants/icon";
import { useMarkdown } from "~common/hooks/useMarkdown";

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  issue: Entity.Issue.Issue | undefined;
  project: Entity.Project.Project | undefined;
  comment?: Entity.Issue.Comment;
};

export const IssueDetail = ({ component: Component, issue, project, comment }: Props) => {
  const currentSpace = useCurrentSpace();
  const { formatMarkdown } = useMarkdown();

  const dueDate = buildDueDate(issue?.dueDate);

  if (!issue) return null;

  return (
    <Component
      markdown={formatMarkdown(issue, comment)}
      metadata={
        <Component.Metadata>
          <Component.Metadata.Label title={issue.issueKey} text={issue.summary} />
          <Component.Metadata.TagList title="">
            {dueDate && (
              <Component.Metadata.TagList.Item
                text={dueDate.formatted}
                color={dueDate.past ? Color.Red : Color.PrimaryText}
                icon={dueDate.past ? { source: ICONS.ISSUE_EXPIRED, tintColor: Color.Red } : undefined}
              />
            )}
            <Component.Metadata.TagList.Item text={issue.issueType.name} color={issue.issueType.color} />
            <Component.Metadata.TagList.Item text={issue.status.name} color={issue.status.color} />
            {project?.useDevAttributes && (
              <Component.Metadata.TagList.Item
                text={issue.priority.name}
                icon={
                  issue.priority.id === 4 ? Icon.ArrowDown : issue.priority.id === 2 ? Icon.ArrowUp : Icon.ArrowRight
                }
                color={issue.priority.id === 4 ? Color.Green : issue.priority.id === 2 ? Color.Red : Color.Blue}
              />
            )}
          </Component.Metadata.TagList>
          <Component.Metadata.Label
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
            <Component.Metadata.TagList title="Category">
              {issue.category.map(({ id, name }) => (
                <Component.Metadata.TagList.Item key={id} text={name} color={Color.SecondaryText} />
              ))}
            </Component.Metadata.TagList>
          )}
          {project?.useDevAttributes && (
            <>
              {issue.milestone.length > 0 && (
                <Component.Metadata.TagList title="Milestone">
                  {issue.milestone.map(({ id, name }) => (
                    <Component.Metadata.TagList.Item key={id} text={name} color={Color.SecondaryText} />
                  ))}
                </Component.Metadata.TagList>
              )}
              {issue.versions.length > 0 && (
                <Component.Metadata.TagList title="Version">
                  {issue.versions.map(({ id, name, archived }) => (
                    <Component.Metadata.TagList.Item
                      key={id}
                      text={name}
                      color={archived ? "white" : Color.SecondaryText}
                    />
                  ))}
                </Component.Metadata.TagList>
              )}
            </>
          )}
          {issue.resolution && <Component.Metadata.Label title="Resolution" text={issue.resolution.name} />}
          <Component.Metadata.Separator />
          {issue.customFields.length > 0 && (
            <>
              {issue.customFields.map((field) => {
                if (field.value == null) return null;

                if (Array.isArray(field.value)) {
                  if (field.value.length === 0) return null;

                  return (
                    <Component.Metadata.TagList title={field.name}>
                      {field.value.map(({ name }) => (
                        <Component.Metadata.TagList.Item key={name} text={name} />
                      ))}
                    </Component.Metadata.TagList>
                  );
                }

                if (typeof field.value === "object") {
                  return (
                    <Component.Metadata.TagList title={field.name}>
                      <Component.Metadata.TagList.Item text={field.value.name} />
                    </Component.Metadata.TagList>
                  );
                }

                if (field.fieldTypeId === 4) {
                  return (
                    <Component.Metadata.Label title={field.name} text={format(parseISO(field.value), "MMM. i, yyyy")} />
                  );
                }

                return <Component.Metadata.Label title={field.name} text={field.value.toString()} />;
              })}
            </>
          )}
        </Component.Metadata>
      }
    />
  );
};
