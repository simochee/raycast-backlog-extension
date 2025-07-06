import { Action, Color, Icon, Image, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import { CommonActionPanel } from "./CommonActionPanel";
import { useCurrentSpace } from "../hooks/useCurrentSpace";

type Props = {
  notification: Entity.Notification.Notification;
};

export const NotificationItem = ({
  notification: { sender, issue, reason, alreadyRead, comment, project, pullRequest },
}: Props) => {
  const currentSpace = useCurrentSpace();

  const accessories: List.Item.Accessory[] = [
    {
      icon: {
        source: `https://${currentSpace.host}/api/v2/users/${sender.id}/icon?apiKey=${currentSpace.apiKey}`,
        mask: Image.Mask.Circle,
      },
      tooltip: sender.name,
    },
  ];
  const tintColor = alreadyRead ? Color.SecondaryText : Color.Orange;
  const url = pullRequest
    ? `https://${currentSpace.host}/git/${project.projectKey}/app/pullRequests/${pullRequest.number}`
    : issue
      ? comment
        ? `https://${currentSpace.host}/view/${issue.issueKey}#comment-${comment.id}`
        : `https://${currentSpace.host}/view/${issue.issueKey}`
      : `https://${currentSpace.host}/projects/${project.projectKey}`;
  const actions = (
    <CommonActionPanel>
      <Action.OpenInBrowser title="Open in Browser" url={url} />
      <Action.CopyToClipboard title="Copy Issue URL" content={url} shortcut={{ modifiers: ["cmd", "shift"], key: "u" }} />
      {issue && (
        <>
          <Action.CopyToClipboard
            title="Copy Issue Key"
            content={issue.issueKey}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
          />
          <Action.CopyToClipboard
            title="Copy Issue Key and Summary"
            content={`${issue.issueKey} ${issue.summary}`}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
        </>
      )}
    </CommonActionPanel>
  );

  switch (reason) {
    case 1:
    case 10: {
      return (
        <List.Item
          title={{
            value: issue?.summary || "",
            tooltip: `${sender.name} assigned you to "${issue?.summary}" (${issue?.issueKey})`,
          }}
          icon={{ source: Icon.AddPerson, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
    case 2:
    case 11: {
      return (
        <List.Item
          title={{
            value: comment?.content || "",
            tooltip: `${sender.name} commented on "${issue?.summary}" (${issue?.issueKey})\n\n${comment?.content}`,
          }}
          icon={{ source: Icon.Bubble, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
    case 3: {
      return (
        <List.Item
          title={{
            value: issue?.summary || "",
            tooltip: `${sender.name} created issue "${issue?.summary}" (${issue?.issueKey})`,
          }}
          icon={{ source: Icon.Plus, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
    case 4: {
      return (
        <List.Item
          title={{
            value: issue?.summary || "",
            tooltip: `${sender.name} updated issue "${issue?.summary}" (${issue?.issueKey})`,
          }}
          icon={{ source: Icon.Pencil, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
    case 5: {
      return (
        <List.Item
          title={{
            value: issue?.summary || "",
            tooltip: `${sender.name} attached a file to issue "${issue?.summary}" (${issue?.issueKey})`,
          }}
          icon={{ source: Icon.NewDocument, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
    case 6: {
      return (
        <List.Item
          title={{
            value: project.name,
            tooltip: `You were invited to project "${project.name}" (${project.projectKey})`,
          }}
          icon={{ source: Icon.Ticket, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
    case 12: {
      return (
        <List.Item
          title={{
            value: `#${pullRequest?.number} ${pullRequest?.summary}`,
            tooltip: `${sender.name} created pull request #${pullRequest?.number} "${pullRequest?.summary}"`,
          }}
          icon={{ source: Icon.Plus, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
    case 13: {
      return (
        <List.Item
          title={{
            value: `#${pullRequest?.number} ${pullRequest?.summary}`,
            tooltip: `${sender.name} updated pull request #${pullRequest?.number} "${pullRequest?.summary}"`,
          }}
          icon={{ source: Icon.Upload, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
    default: {
      return (
        <List.Item
          title={{
            value: "Notification",
            tooltip: `${sender.name} sent you a notification`,
          }}
          icon={{ source: Icon.Bell, tintColor }}
          accessories={accessories}
          actions={actions}
        />
      );
    }
  }
};
