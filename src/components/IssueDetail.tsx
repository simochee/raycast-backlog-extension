import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { getUserIconUrl } from "../utils/image";
import { Color, Detail, Icon, Image, List } from "@raycast/api";
import type { Entity } from "backlog-js";

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  issue: Entity.Issue.Issue | undefined;
  project: Entity.Project.Project | undefined;
  comment?: Entity.Issue.Comment;
};

export const IssueDetail = ({ component: Component, issue, project, comment }: Props) => {
  const currentSpace = useCurrentSpace();

  if (!issue) return null;

  return (
    <Component
      markdown={comment ? comment.content : issue.description}
      metadata={
        <Component.Metadata>
          <Component.Metadata.Label title="Subject" text={issue.summary} />
          <Component.Metadata.Separator />
          <Component.Metadata.Link
            title="Issue Key"
            text={issue.issueKey}
            target={`https://${currentSpace.host}/view/${issue.issueKey}`}
          />
          <Component.Metadata.TagList title="Type">
            <Component.Metadata.TagList.Item text={issue.issueType.name} color={issue.issueType.color} />
          </Component.Metadata.TagList>
          <Component.Metadata.TagList title="Status">
            <Component.Metadata.TagList.Item text={issue.status.name} color={issue.status.color} />
          </Component.Metadata.TagList>
          {issue.assignee && (
            <Component.Metadata.Label
              title="Assignee"
              text={issue.assignee.name}
              icon={{
                source: getUserIconUrl(currentSpace.credential, issue.assignee.id),
                mask: Image.Mask.Circle,
              }}
            />
          )}
          {issue.dueDate && (
            <Component.Metadata.Label
              title="Due Date"
              text={new Date(issue.dueDate).toLocaleDateString()}
              icon={{ source: Icon.Calendar }}
            />
          )}
          {project?.useDevAttributes && issue.priority.id != null && (
            <Component.Metadata.TagList title="Priority">
              <Component.Metadata.TagList.Item
                text={issue.priority.name}
                color={issue.priority.id === 4 ? Color.Green : issue.priority.id === 2 ? Color.Red : Color.Blue}
              />
            </Component.Metadata.TagList>
          )}
          {issue.category.length > 0 && (
            <Component.Metadata.TagList title="Category">
              {issue.category.map(({ id, name }) => (
                <Component.Metadata.TagList.Item key={id} text={name} />
              ))}
            </Component.Metadata.TagList>
          )}
          {project?.useDevAttributes && issue.milestone.length > 0 && (
            <Component.Metadata.TagList title="Milestone">
              {issue.milestone.map(({ id, name }) => (
                <Component.Metadata.TagList.Item key={id} text={name} />
              ))}
            </Component.Metadata.TagList>
          )}
          {project?.useDevAttributes && issue.versions.length > 0 && (
            <Component.Metadata.TagList title="Version">
              {issue.versions.map(({ id, name }) => (
                <Component.Metadata.TagList.Item key={id} text={name} />
              ))}
            </Component.Metadata.TagList>
          )}
          {issue.resolution && <Component.Metadata.Label title="Resolution" text={issue.resolution.name} />}
          {issue.customFields.length > 0 && (
            <>
              <Component.Metadata.Separator />
              {issue.customFields.map((field) => {
                const value = Array.isArray(field.value)
                  ? field.value
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map(({ name }) => name)
                      .join(", ")
                  : field.fieldTypeId === 4 && field.value
                    ? new Date(field.value).toLocaleDateString()
                    : field.value;

                if (value == null) return null;

                return <Component.Metadata.Label key={field.id} title={field.name} text={value} />;
              })}
            </>
          )}
        </Component.Metadata>
      }
    />
  );
};
