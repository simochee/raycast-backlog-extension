import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { getUserIconUrl } from "../utils/image";
import { CommonActionPanel } from "./CommonActionPanel";
import { IssueDetail } from "./IssueDetail";
import { ProjectDetail } from "./ProjectDetail";
import { PullRequestDetail } from "./PullRequestDetail";
import { Action, ActionPanel, Color, Image, List } from "@raycast/api";
import type { Entity } from "backlog-js";

type Props = {
  notification: Entity.Notification.Notification;
};

export const NotificationItem = ({
  notification: { id, sender, issue, reason, resourceAlreadyRead, comment, project, pullRequest },
}: Props) => {
  const currentSpace = useCurrentSpace();

  const accessories: List.Item.Accessory[] = [
    {
      icon: {
        source: getUserIconUrl(currentSpace.credential, sender.id),
        mask: Image.Mask.Circle,
      },
      tooltip: sender.name,
    },
  ];
  const tintColor = resourceAlreadyRead ? Color.SecondaryText : Color.Orange;
  const url = `https://${currentSpace.host}/globalbar/notifications/redirect/${id}`;
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
            source: "tabler/user-square-rounded.svg",
            tintColor,
          }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} />}
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
          icon={{ source: "tabler/messages.svg", tintColor }}
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
          icon={{ source: "tabler/square-rounded-plus-2.svg", tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} />}
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
          icon={{ source: "tabler/info-square-rounded.svg", tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} />}
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
          icon={{ source: "tabler/file-plus.svg", tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<IssueDetail component={List.Item.Detail} issue={issue} project={project} />}
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
          icon={{ source: "tabler/users-plus.svg", tintColor }}
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
            source: "tabler/user-plus.svg",
            tintColor,
          }}
          accessories={accessories}
          actions={actions}
          detail={
            <PullRequestDetail
              component={List.Item.Detail}
              pullRequest={pullRequest}
              project={project}
              comment={comment}
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
          icon={{ source: "tabler/message.svg", tintColor }}
          accessories={accessories}
          actions={actions}
          detail={
            <PullRequestDetail
              component={List.Item.Detail}
              project={project}
              pullRequest={pullRequest}
              comment={comment}
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
          icon={{ source: "tabler/git-pull-request.svg", tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<PullRequestDetail component={List.Item.Detail} project={project} pullRequest={pullRequest} />}
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
          icon={{ source: "tabler/git-pull-request-draft.svg", tintColor }}
          accessories={accessories}
          actions={actions}
          detail={<PullRequestDetail component={List.Item.Detail} project={project} pullRequest={pullRequest} />}
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
          icon={{ source: "tabler/point.svg", tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
  }
};
