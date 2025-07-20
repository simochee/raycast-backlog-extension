import { Color, Icon, Image } from "@raycast/api";
import type { Detail, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import { ICONS } from "~common/constants/icon";
import { getProjectImageUrl, getUserIconUrl } from "~common/utils/image";
import { buildDueDate, formatDate, sortByDisplayOrder } from "~issue/utils/issue";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";

type Props = {
  component: typeof List.Item.Detail.Metadata | typeof Detail.Metadata;
  issue: Entity.Issue.Issue;
  project: Entity.Project.Project | undefined;
  comment: Entity.Issue.Comment | undefined;
};

export const IssueMetadata = ({ component: Component, issue, project, comment }: Props) => {
  const currentSpace = useCurrentSpace();

  const stars = issue.stars.length;
  const dueDate = buildDueDate(issue.dueDate);

  return (
    <Component>
      <Component.TagList title="">
        <Component.TagList.Item text={issue.issueType.name} color={issue.issueType.color} />
        <Component.TagList.Item
          text={issue.issueKey}
          color="#fff"
          icon={getProjectImageUrl(currentSpace.credential, issue.projectId)}
        />
        <Component.TagList.Item text={issue.status.name} color={issue.status.color} />
      </Component.TagList>
      <Component.Link title="" text={issue.summary} target={currentSpace.toUrl(`/view/${issue.issueKey}`)} />
      <Component.Separator />
      <Component.TagList title="">
        <Component.TagList.Item
          text={issue.startDate ? formatDate(issue.startDate) : "-"}
          icon={{ source: ICONS.DATE_START, tintColor: "#fff" }}
          color={"#fff"}
        />
        <Component.TagList.Item
          text={dueDate?.formatted || "-"}
          icon={
            dueDate?.past && issue.status.id !== 4
              ? { source: ICONS.ISSUE_EXPIRED, tintColor: Color.Red }
              : { source: ICONS.DATE_DUE, tintColor: "#fff" }
          }
          color={dueDate?.past && issue.status.id !== 4 ? Color.Red : "#fff"}
        />
        <Component.TagList.Item
          text={stars.toString()}
          icon={
            stars === 0
              ? { source: ICONS.STAR_EMPTY, tintColor: "#fff" }
              : { source: ICONS.STAR_FILLED, tintColor: Color.Yellow }
          }
          color={stars === 0 ? "#fff" : Color.Yellow}
        />
      </Component.TagList>
      <Component.TagList title="">
        <Component.TagList.Item
          text={issue.priority.name}
          icon={issue.priority.id === 4 ? Icon.ArrowDown : issue.priority.id === 2 ? Icon.ArrowUp : Icon.ArrowRight}
          color={issue.priority.id === 4 ? Color.Green : issue.priority.id === 2 ? Color.Red : Color.Blue}
        />
        <Component.TagList.Item
          text={issue.assignee ? issue.assignee.name : "Unassigned"}
          icon={
            issue.assignee
              ? { source: getUserIconUrl(currentSpace.credential, issue.assignee.id), mask: Image.Mask.Circle }
              : undefined
          }
          color="#fff"
        />
      </Component.TagList>
      {issue.category.length > 0 ||
        issue.milestone.length > 0 ||
        (issue.versions.length > 0 && (
          <Component.TagList title="">
            {sortByDisplayOrder(issue.category).map(({ id, name }) => (
              <Component.TagList.Item
                key={id}
                text={name}
                icon={{ source: ICONS.CATEGORY, tintColor: Color.Magenta }}
                color={Color.Magenta}
              />
            ))}
            {sortByDisplayOrder(issue.milestone).map(({ id, name }) => (
              <Component.TagList.Item
                key={id}
                text={name}
                icon={{ source: ICONS.MILESTONE, tintColor: Color.Blue }}
                color={Color.Blue}
              />
            ))}
            {sortByDisplayOrder(issue.versions).map(({ id, name, archived }) => (
              <Component.TagList.Item
                key={id}
                text={name}
                icon={{ source: ICONS.VERSION, tintColor: archived ? Color.SecondaryText : Color.Green }}
                color={archived ? Color.SecondaryText : Color.Green}
              />
            ))}
          </Component.TagList>
        ))}
      {(issue.estimatedHours != null || issue.actualHours != null || issue.resolution != null) && (
        <Component.TagList title="">
          {issue.estimatedHours != null && (
            <Component.TagList.Item text={`${issue.estimatedHours} hours`} icon={ICONS.ESTIMATED_HOURS} />
          )}
          {issue.actualHours != null && (
            <Component.TagList.Item text={`${issue.actualHours} hours`} icon={ICONS.ACTUAL_HOURS} />
          )}
          {issue.resolution != null && <Component.TagList.Item text={issue.resolution.name} icon={ICONS.RESOLUTION} />}
        </Component.TagList>
      )}
      <Component.Separator />
      {issue.customFields.map((field) => {
        if (field.value == null) return null;

        if (Array.isArray(field.value)) {
          if (field.value.length === 0) return null;

          return (
            <Component.Label key={field.id} title={field.name} text={field.value.map(({ name }) => name).join(" , ")} />
          );
        }

        if (typeof field.value === "object") {
          return <Component.Label key={field.id} title={field.name} text={field.value.name} />;
        }

        if (field.fieldTypeId === 4) {
          return <Component.Label key={field.id} title={field.name} text={formatDate(field.value)} />;
        }

        return <Component.Label key={field.id} title={field.name} text={field.value.toString()} />;
      })}
    </Component>
  );
};
