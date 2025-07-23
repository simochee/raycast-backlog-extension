import { Image } from "@raycast/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Detail, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import type { Project } from "~common/transformers/project";
import type { PullRequest, PullRequestComment } from "~common/transformers/pull-request";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { getUserIconUrl } from "~common/utils/image";
import { repositoryOptions } from "~common/utils/queryOptions";
import { useMarkdown } from "~common/hooks/useMarkdown";
import { PULL_REQUEST_STATUS } from "~pull-request/constants";

type Props = {
  component: typeof List.Item.Detail | typeof Detail;
  project: Project;
  pullRequest?: PullRequest;
  comment?: PullRequestComment;
};

const getStatusColor = (status: Entity.PullRequest.Status) => {
  switch (status.id) {
    case PULL_REQUEST_STATUS.OPEN:
      return "#ed8077";
    case PULL_REQUEST_STATUS.CLOSED:
      return "#707070";
    case PULL_REQUEST_STATUS.MERGED:
      return "#5eb5a9";
  }
};

export const PullRequestDetail = ({ component: Component, project, pullRequest, comment }: Props) => {
  const currentSpace = useCurrentSpace();
  const { formatMarkdown } = useMarkdown();

  const { data: repository } = useSuspenseQuery(repositoryOptions(currentSpace, project.id, pullRequest?.repositoryId));

  if (!pullRequest || !repository) return null;

  return (
    <Component
      markdown={formatMarkdown(pullRequest, comment)}
      metadata={
        <Component.Metadata>
          <Component.Metadata.Link
            title="Number"
            text={`${project.projectKey}/${repository.name}#${pullRequest.number}`}
            target={currentSpace.toUrl(
              `/git/${project.projectKey}/${repository.name}/pullRequests/${pullRequest.number}`,
            )}
          />
          <Component.Metadata.Separator />
          <Component.Metadata.Label title="Summary" text={pullRequest.summary} />
          {comment && <Component.Metadata.Label title="Description" text={pullRequest.description} />}
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
          {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            pullRequest.issue && (
              <>
                <Component.Metadata.Separator />
                <Component.Metadata.Link
                  title="Issue"
                  text={pullRequest.issue.issueKey}
                  target={currentSpace.toUrl(`/view/${pullRequest.issue.issueKey}`)}
                />
                <Component.Metadata.Label title="Summary" text={pullRequest.issue.summary} />
              </>
            )
          }
        </Component.Metadata>
      }
    />
  );
};
