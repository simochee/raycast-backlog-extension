import { pick } from "es-toolkit";
import { transformIssue, transformIssueComment } from "./issue";
import { transformProject } from "./project";
import { transformPullRequest, transformPullRequestComment } from "./pull-request";
import type { Entity } from "backlog-js";

export const transformNotification = (notification: Entity.Notification.Notification) => {
  return {
    ...pick(notification, ["id", "reason", "resourceAlreadyRead", "created"]),
    sender: pick(notification.sender, ["id", "name"]),
    issue: notification.issue && transformIssue(notification.issue),
    comment: notification.comment && transformIssueComment(notification.comment),
    project: transformProject(notification.project),
    pullRequest: notification.pullRequest && transformPullRequest(notification.pullRequest),
    pullRequestComment: notification.pullRequestComment && transformPullRequestComment(notification.pullRequestComment),
  } satisfies { [K in keyof Entity.Notification.Notification]?: unknown };
};

export type Notification = ReturnType<typeof transformNotification>;
