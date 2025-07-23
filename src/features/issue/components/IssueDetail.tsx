import { IssueMetadata } from "./IssueMetadata";
import type { Detail, List } from "@raycast/api";
import type { Issue, IssueComment, Project } from "~common/utils/transformers";
import { useMarkdown } from "~common/hooks/useMarkdown";

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  issue: Issue | undefined;
  project: Project | undefined;
  comment?: IssueComment;
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
