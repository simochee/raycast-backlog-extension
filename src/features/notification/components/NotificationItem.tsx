import { Action, ActionPanel, Color, Image, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { getUserIconUrl } from "~common/utils/image";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { IssueDetail } from "~issue/components/IssueDetail";
import { ProjectDetail } from "~project/components/ProjectDetail";
import { PullRequestDetail } from "~pull-request/components/PullRequestDetail";
import { ICONS } from "~common/constants/icon";

type Props = {
  notification: Entity.Notification.Notification;
};

export const NotificationItem = ({
  notification: { id, sender, issue, reason, resourceAlreadyRead, comment, project, pullRequest, pullRequestComment },
}: Props) => {
  const currentSpace = useCurrentSpace();

  const accessories: Array<List.Item.Accessory> = [
    {
      icon: {
        source: getUserIconUrl(currentSpace.credential, sender.id),
        mask: Image.Mask.Circle,
      },
      tooltip: sender.name,
    },
  ];
  const tintColor = resourceAlreadyRead ? Color.SecondaryText : Color.Orange;
  const url = currentSpace.toUrl(`/globalbar/notifications/redirect/${id}`);
  const actions = (
    <CommonActionPanel>
      <Action.OpenInBrowser title="Open in Browser" url={url} />
      <ActionPanel.Section title="Actions">
        <Action.CopyToClipboard
          title="Copy Issue URL"
          content={url}
          shortcut={{ modifiers: ["cmd", "shift"], key: "u" }}
        />
        {issue && (
          <>
            <Action.CopyToClipboard
              title="Copy Issue Key"
              content={issue.issueKey}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
            <Action.CopyToClipboard
              title="Copy Issue Key and Subject"
              content={`${issue.issueKey} ${issue.summary}`}
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            />
          </>
        )}
      </ActionPanel.Section>
    </CommonActionPanel>
  );

  switch (reason) {
    // Assigned to Issue
    case 1: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: issue?.summary || "",
            tooltip: `${sender.name} assigned you to "${issue?.summary}" (${issue?.issueKey})`,
          }}
          icon={{
            source: ICONS.NOTIFICATION_ASSIGNED,
            tintColor,
          }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} comment={comment} />}
        />
      );
    }
    // Issue Commented
    case 2: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: comment?.content || "",
            tooltip: `${sender.name} commented on "${issue?.summary}" (${issue?.issueKey})\n\n${comment?.content}`,
          }}
          icon={{ source: ICONS.NOTIFICATION_COMMENT, tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} comment={comment} />}
        />
      );
    }
    // Issue Created
    case 3: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: issue?.summary || "",
            tooltip: `${sender.name} created issue "${issue?.summary}" (${issue?.issueKey})`,
          }}
          icon={{ source: ICONS.NOTIFICATION_CREATED, tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} comment={comment} />}
        />
      );
    }
    // Issue Updated
    case 4: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: issue?.summary || "",
            tooltip: `${sender.name} updated issue "${issue?.summary}" (${issue?.issueKey})`,
          }}
          icon={{ source: ICONS.NOTIFICATION_UPDATED, tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} comment={comment} />}
        />
      );
    }
    // File Added
    case 5: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: issue?.summary || "",
            tooltip: `${sender.name} attached a file to issue "${issue?.summary}" (${issue?.issueKey})`,
          }}
          icon={{ source: ICONS.NOTIFICATION_FILE_ADDED, tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} comment={comment} />}
        />
      );
    }
    // Project User Added
    case 6: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: project.name,
            tooltip: `You were invited to project "${project.name}" (${project.projectKey})`,
          }}
          icon={{ source: ICONS.NOTIFICATION_USER_ADDED, tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<ProjectDetail component={List.Item.Detail} project={project} />}
        />
      );
    }
    // Assigned to Pull Request
    case 10: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: `${pullRequest?.number} ${pullRequest?.summary}`,
            tooltip: `${sender.name} assigned you to #${pullRequest?.number} "${pullRequest?.summary}"`,
          }}
          icon={{
            source: ICONS.NOTIFICATION_PULL_REQUEST_ASSIGNED,
            tintColor,
          }}
          accessories={accessories}
          actions={actions}
          detail={
            <PullRequestDetail
              component={List.Item.Detail}
              pullRequest={pullRequest}
              project={project}
              comment={pullRequestComment}
            />
          }
        />
      );
    }
    // Comment Added on Pull Request
    case 11: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: pullRequest?.summary || "",
            tooltip: `${sender.name} commented on #${pullRequest?.number} "${pullRequest?.summary}"\n\n${comment?.content}`,
          }}
          icon={{ source: ICONS.NOTIFICATION_PULL_REQUEST_COMMENT, tintColor }}
          accessories={accessories}
          actions={actions}
          detail={
            <PullRequestDetail
              component={List.Item.Detail}
              project={project}
              pullRequest={pullRequest}
              comment={pullRequestComment}
            />
          }
        />
      );
    }
    // Pull Request Added
    case 12: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: `#${pullRequest?.number} ${pullRequest?.summary}`,
            tooltip: `${sender.name} created pull request #${pullRequest?.number} "${pullRequest?.summary}"`,
          }}
          icon={{ source: ICONS.NOTIFICATION_PULL_REQUEST_CREATED, tintColor }}
          accessories={accessories}
          actions={actions}
          detail={
            <PullRequestDetail
              component={List.Item.Detail}
              project={project}
              pullRequest={pullRequest}
              comment={pullRequestComment}
            />
          }
        />
      );
    }
    // Pull Request Updated
    case 13: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: `#${pullRequest?.number} ${pullRequest?.summary}`,
            tooltip: `${sender.name} updated pull request #${pullRequest?.number} "${pullRequest?.summary}"`,
          }}
          icon={{ source: ICONS.NOTIFICATION_PULL_REQUEST_UPDATED, tintColor }}
          accessories={accessories}
          actions={actions}
          detail={
            <PullRequestDetail
              component={List.Item.Detail}
              project={project}
              pullRequest={pullRequest}
              comment={pullRequestComment}
            />
          }
        />
      );
    }
    // Other (maybe reason = 9)
    default: {
      return (
        <List.Item
          id={`${id}`}
          title={{
            value: "Notification",
            tooltip: `${sender.name} sent you a notification`,
          }}
          icon={{ source: ICONS.NOTIFICATION_OTHER, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
  }
};
