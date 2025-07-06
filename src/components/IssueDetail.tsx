import { Color, Detail, Icon, Image, List } from "@raycast/api"
import type { Entity } from "backlog-js"
import { getUserIconUrl } from "../utils/image"
import { useCurrentSpace } from "../hooks/useCurrentSpace"

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  issue: Entity.Issue.Issue | undefined
  project: Entity.Project.Project | undefined
  comment?: Entity.Issue.Comment
}

export const IssueDetail = ({ component: Component, issue, project, comment }: Props) => {
  const currentSpace = useCurrentSpace();

  if (!issue) return null;
  
  return (
    <Component
      markdown={comment ? comment.content : issue.description}
      metadata={
        <Component.Metadata>
          <Component.Metadata.Label title="Subject" text={issue.summary} />
          <Component.Metadata.Label title="Issue Key" text={issue.issueKey} />
          <Component.Metadata.Label
            title="Type"
            text={issue.issueType.name}
            icon={{ source: Icon.CircleFilled, tintColor: issue.issueType.color }}
          />
          <Component.Metadata.Label
            title="Status"
            text={issue.status.name}
            icon={{ source: Icon.CircleFilled, tintColor: issue.status.color }}
          />
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
          <Component.Metadata.Label
            title="Due Date"
            text={issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : "No due date"}
            icon={issue.dueDate ? { source: Icon.Calendar } : null}
          />
          {project?.useDevAttributes && (
            <Component.Metadata.Label
              title="Priority"
              text={issue.priority.name}
              icon={{
                source: Icon.ArrowDown,
                tintColor: issue.priority.id === 4 ? Color.Green : issue.priority.id === 2 ? Color.Red : Color.Blue,
              }}
            />
          )}
          <Component.Metadata.Label title="Category" text={issue.category.map((c) => c.name).join(", ")} />
          {project?.useDevAttributes && (
            <>
              <Component.Metadata.Label
                title="Milestone"
                text={issue.milestone.map((m) => m.name).join(", ")}
              />
              <Component.Metadata.Label
                title="Version"
                text={issue.versions.map((v) => v.name).join(", ")}
              />
            </>
          )}
          <Component.Metadata.Label title="Resolution" text={issue.resolution?.name} />
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
                    : field.value || "";

                return <Component.Metadata.Label key={field.id} title={field.name} text={value} />;
              })}
            </>
          )}
        </Component.Metadata>
      }
    />
  )
}