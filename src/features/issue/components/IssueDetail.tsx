import { IssueMetadata } from "./IssueMetadata";
import type { Detail, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import type { Issue, Project } from "~common/utils/transformers";
import { useMarkdown } from "~common/hooks/useMarkdown";

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  issue: Issue | undefined;
  project: Project | undefined;
  comment?: Entity.Issue.Comment;
};

export const IssueDetail = ({ component: Component, issue, project, comment }: Props) => {
  const { formatMarkdown } = useMarkdown();

  if (!issue) return null;

  return (
    <Component
      markdown={formatMarkdown(issue, comment)}
      metadata={<IssueMetadata component={Component.Metadata} issue={issue} project={project} comment={comment} />}
    />
  );
};
