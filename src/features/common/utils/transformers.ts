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
  };
};

export const transformRecentlyViewedIssue = (RecentlyViewedIssue: Entity.Issue.RecentlyViewedIssue) => {
  return {
    issue: transformIssue(RecentlyViewedIssue.issue),
  };
};

export type Issue = ReturnType<typeof transformIssue>;
export type RecentlyViewedIssue = ReturnType<typeof transformRecentlyViewedIssue>;
