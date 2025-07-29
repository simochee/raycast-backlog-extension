import { Color, Icon, Image } from "@raycast/api";
import type { Detail, List } from "@raycast/api";
import type { Issue, IssueComment } from "~common/transformers/issue";
import type { Project } from "~common/transformers/project";
import { ICONS } from "~common/constants/icon";
import { getProjectImageUrl, getUserIconUrl } from "~common/utils/image";
import { buildDueDate, formatDate, sortByDisplayOrder } from "~issue/utils/issue";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { ISSUE_PRIORITY, ISSUE_STATUS } from "~issue/constants";
import { useCurrentUser } from "~common/hooks/useCurrentUser";

type Props = {
  component: typeof List.Item.Detail.Metadata | typeof Detail.Metadata;
  issue: Issue;
  project: Project | undefined;
  comment: IssueComment | undefined;
};

export const IssueMetadata = ({ component: Component, issue, comment }: Props) => {
  const currentUser = useCurrentUser();
  const currentSpace = useCurrentSpace();

  const stars = comment ? comment.stars : issue.stars;
  const starCount = stars.length;
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
            dueDate?.past && issue.status.id !== ISSUE_STATUS.CLOSED
              ? { source: ICONS.ISSUE_EXPIRED, tintColor: Color.Red }
              : { source: ICONS.DATE_DUE, tintColor: "#fff" }
          }
          color={dueDate?.past && issue.status.id !== ISSUE_STATUS.CLOSED ? Color.Red : "#fff"}
        />
        <Component.TagList.Item
          text={starCount.toString()}
          icon={{
            source: stars.some(({ presenter }) => presenter.id === currentUser.id)
              ? ICONS.STAR_FILLED
              : ICONS.STAR_EMPTY,
            tintColor: starCount === 0 ? "#fff" : Color.Yellow,
          }}
          color={starCount === 0 ? "#fff" : Color.Yellow}
        />
      </Component.TagList>
      <Component.TagList title="">
        <Component.TagList.Item
          text={issue.priority.name}
          icon={
            issue.priority.id === ISSUE_PRIORITY.LOW
              ? Icon.ArrowDown
              : issue.priority.id === ISSUE_PRIORITY.HIGH
                ? Icon.ArrowUp
                : Icon.ArrowRight
          }
          color={
            issue.priority.id === ISSUE_PRIORITY.LOW
              ? Color.Green
              : issue.priority.id === ISSUE_PRIORITY.HIGH
                ? Color.Red
                : Color.Blue
          }
        />
        <Component.TagList.Item
          text={issue.assignee ? issue.assignee.name : "Unassigned"}
          icon={
            issue.assignee
              ? { source: getUserIconUrl(currentSpace.credential, issue.assignee.id), mask: Image.Mask.Circle }
              : undefined
          }
          color="#ffd700"
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
                icon={{ source: ICONS.CATEGORY, tintColor: "#ba55d3" }}
                color={"#ba55d3"}
              />
            ))}
            {sortByDisplayOrder(issue.milestone).map(({ id, name }) => (
              <Component.TagList.Item
                key={id}
                text={name}
                icon={{ source: ICONS.MILESTONE, tintColor: "#4682b4" }}
                color={"#4682b4"}
              />
            ))}
            {sortByDisplayOrder(issue.versions).map(({ id, name, archived }) => (
              <Component.TagList.Item
                key={id}
                text={name}
                icon={{ source: ICONS.VERSION, tintColor: archived ? Color.SecondaryText : "#ffb6ca" }}
                color={archived ? Color.SecondaryText : "#ffb6ca"}
              />
            ))}
          </Component.TagList>
        ))}
      {(issue.estimatedHours != null || issue.actualHours != null || issue.resolution != null) && (
        <Component.TagList title="">
          {issue.estimatedHours != null && (
            <Component.TagList.Item
              text={`${issue.estimatedHours} hours`}
              icon={{ source: ICONS.ESTIMATED_HOURS, tintColor: "#ffdab9" }}
              color="#ffdab9"
            />
          )}
          {issue.actualHours != null && (
            <Component.TagList.Item
              text={`${issue.actualHours} hours`}
              icon={{ source: ICONS.ACTUAL_HOURS, tintColor: "#20b2aa" }}
              color="#20b2aa"
            />
          )}
          {issue.resolution != null && (
            <Component.TagList.Item
              text={issue.resolution.name}
              icon={{ source: ICONS.RESOLUTION, tintColor: "#a9a9a9" }}
              color="#a9a9a9"
            />
          )}
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
