import { Color, Icon, Image, type Detail, type List } from "@raycast/api";
import type { Entity } from "backlog-js";
import { ICONS } from "~common/constants/icon";
import { getProjectImageUrl, getUserIconUrl } from "~common/utils/image";
import { sortByDisplayOrder } from "~issue/utils/issue";
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
          text={stars.toString()}
          icon={
            stars === 0
              ? { source: ICONS.STAR_EMPTY, tintColor: Color.SecondaryText }
              : { source: ICONS.STAR_FILLED, tintColor: Color.Yellow }
          }
          color={stars === 0 ? "#fff" : Color.Yellow}
        />
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
    </Component>
  );
};
