import { pick } from "es-toolkit";
import type { Entity } from "backlog-js";

export const transformPullRequest = (pullRequest: Entity.PullRequest.PullRequest) => {
  return {
    ...pick(pullRequest, ["id", "description", "number", "summary", "repositoryId", "projectId"]),
    attachments: pullRequest.attachments.map((v) => pick(v, ["id", "name"])),
    status: pick(pullRequest.status, ["id", "name"]),
    assignee: pullRequest.assignee && pick(pullRequest.assignee, ["id", "name"]),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    issue: pullRequest.issue && pick(pullRequest.issue, ["id", "issueKey", "summary"]),
  } satisfies { [K in keyof Entity.PullRequest.PullRequest]?: unknown };
};

export const transformPullRequestComment = (pullRequestComment: Entity.PullRequest.Comment) => {
  return {
    ...pick(pullRequestComment, ["id", "content"]),
    notifications: pullRequestComment.notifications.map(
      ({ user }) =>
        ({
          user: pick(user, ["id", "name", "userId"]),
        }) satisfies { [K in keyof Entity.CommentNotification.CommentNotification]?: unknown },
    ),
  } satisfies { [K in keyof Entity.PullRequest.Comment]?: unknown };
};

export type PullRequest = ReturnType<typeof transformPullRequest>;
export type PullRequestComment = ReturnType<typeof transformPullRequestComment>;
