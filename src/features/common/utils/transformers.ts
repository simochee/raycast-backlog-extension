import { pick } from "es-toolkit";
import type { Entity } from "backlog-js";

export const transformIssue = (issue: Entity.Issue.Issue) => {
  return {
    ...pick(issue, [
      "id",
      "description",
      "projectId",
      "issueKey",
      "dueDate",
      "summary",
      "startDate",
      "estimatedHours",
      "actualHours",
    ]),
    status: pick(issue.status, ["id", "name", "color"]),
    priority: pick(issue.priority, ["id", "name"]),
    issueType: pick(issue.issueType, ["id", "name", "color"]),
    assignee: issue.assignee && pick(issue.assignee, ["id", "name"]),
    resolution: issue.resolution && pick(issue.resolution, ["id", "name"]),
    stars: issue.stars.map((v) => pick(v, ["id"])),
    attachments: issue.attachments.map((v) => pick(v, ["id", "name"])),
    category: issue.category.map((v) => pick(v, ["id", "name", "displayOrder"])),
    milestone: issue.milestone.map((v) => pick(v, ["id", "name", "displayOrder"])),
    versions: issue.versions.map((v) => pick(v, ["id", "name", "displayOrder", "archived"])),
    customFields: issue.customFields.map((v) => pick(v, ["id", "fieldTypeId", "name", "value"])),
  } satisfies { [K in keyof Entity.Issue.Issue]?: unknown };
};

export const transformRecentlyViewedIssue = (RecentlyViewedIssue: Entity.Issue.RecentlyViewedIssue) => {
  return {
    issue: transformIssue(RecentlyViewedIssue.issue),
  } satisfies { [K in keyof Entity.Issue.RecentlyViewedIssue]?: unknown };
};

export type Issue = ReturnType<typeof transformIssue>;
export type RecentlyViewedIssue = ReturnType<typeof transformRecentlyViewedIssue>;

export const transformIssueComment = (comment: Entity.Issue.Comment) => {
  return {
    ...pick(comment, ["id", "content"]),
    notifications: comment.notifications.map(
      ({ user }) =>
        ({
          user: pick(user, ["id", "name", "userId"]),
        }) satisfies { [K in keyof Entity.CommentNotification.CommentNotification]?: unknown },
    ),
  } satisfies { [K in keyof Entity.Issue.Comment]?: unknown };
};

export type IssueComment = ReturnType<typeof transformIssueComment>;

export const transformProject = (project: Entity.Project.Project) => {
  return {
    ...pick(project, [
      "id",
      "name",
      "projectKey",
      "useDevAttributes",
      "chartEnabled",
      "useFileSharing",
      "useWiki",
      "useSubversion",
      "useGit",
      "archived",
      "displayOrder",
    ]),
  };
};

export const transformRecentlyViewedProject = (project: Entity.Project.RecentlyViewedProject) => {
  return {
    project: transformProject(project.project),
  } satisfies { [K in keyof Entity.Project.RecentlyViewedProject]?: unknown };
};

export type Project = ReturnType<typeof transformProject>;
export type RecentlyViewedProject = ReturnType<typeof transformRecentlyViewedProject>;

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

export type PullRequest = ReturnType<typeof transformPullRequest>;

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

export type PullRequestComment = ReturnType<typeof transformPullRequestComment>;

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

export const transformWikiListItem = (wikiListItem: Entity.Wiki.WikiListItem) => {
  return {
    ...pick(wikiListItem, ["id", "name", "projectId", "updated"]),
    tags: wikiListItem.tags.map((v) => pick(v, ["id", "name"])),
  } satisfies { [K in keyof Entity.Wiki.WikiListItem]?: unknown };
};

export const transformRecentlyViewedWiki = (wikiListItem: Entity.Wiki.RecentlyViewedWiki) => {
  return {
    page: transformWikiListItem(wikiListItem.page),
  } satisfies { [K in keyof Entity.Wiki.RecentlyViewedWiki]?: unknown };
};

export type WikiListItem = ReturnType<typeof transformWikiListItem>;
export type RecentlyViewedWiki = ReturnType<typeof transformRecentlyViewedWiki>;
