import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { getUserIconUrl } from "../utils/image";
import { formatMarkdown } from "../utils/markdown";
import { Color, Detail, Icon, Image, List } from "@raycast/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Entity } from "backlog-js";

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  project: Entity.Project.Project;
  pullRequest?: Entity.PullRequest.PullRequest;
  comment?: Entity.PullRequest.Comment;
};

const getStatusColor = (status: Entity.PullRequest.Status) => {
  switch (status.id) {
    case 1:
      return "#ed8077";
    case 2:
      return "#707070";
    case 3:
      return "#5eb5a9";
  }
};

export const PullRequestDetail = ({ component: Component, project, pullRequest, comment }: Props) => {
  const currentSpace = useCurrentSpace();

  const { data: repository } = useSuspenseQuery({
    queryKey: ["repository", pullRequest?.repositoryId],
    staleTime: 1000 * 60 * 60 * 3, // 3 hours
    queryFn: async () => {
      if (!pullRequest?.repositoryId) return null;

      return currentSpace.api.getGitRepository(project.id, `${pullRequest.repositoryId}`);
    },
  });

  if (!pullRequest || !repository) return null;

  return (
    <Component
      markdown={formatMarkdown(comment ? comment.content : pullRequest.description)}
      metadata={
        <Component.Metadata>
          <Component.Metadata.Link
            title="Number"
            text={`${project.projectKey}/${repository.name}#${pullRequest.number}`}
            target={`https://${currentSpace.host}/git/${project.projectKey}/${repository.name}/pullRequests/${pullRequest.number}`}
          />
          <Component.Metadata.Separator />
          <Component.Metadata.Label title="Summary" text={pullRequest.summary} />
          <Component.Metadata.Label title="Description" text={pullRequest.description} />
          <Component.Metadata.Separator />
          <Component.Metadata.TagList title="Status">
            <Component.Metadata.TagList.Item
              text={pullRequest.status.name}
              color={getStatusColor(pullRequest.status)}
            />
          </Component.Metadata.TagList>
          {pullRequest.assignee && (
            <Component.Metadata.Label
              title="Assignee"
              text={pullRequest.assignee.name}
              icon={{
                source: getUserIconUrl(currentSpace.credential, pullRequest.assignee.id),
                mask: Image.Mask.Circle,
              }}
            />
          )}
          {pullRequest.issue && (
            <>
              <Component.Metadata.Separator />
              <Component.Metadata.Link
                title="Issue"
                text={pullRequest.issue.issueKey}
                target={`https://${currentSpace.host}/view/${pullRequest.issue.issueKey}`}
              />
              <Component.Metadata.Label title="Summary" text={pullRequest.issue.summary} />
            </>
          )}
        </Component.Metadata>
      }
    />
  );
};
