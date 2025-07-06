import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { useProject } from "../hooks/useProject";
import { getProjectImageUrl } from "../utils/image";
import { CommonActionPanel } from "./CommonActionPanel";
import { Action, Color, List } from "@raycast/api";
import type { Entity } from "backlog-js";

type Props = {
  page: Entity.Wiki.WikiListItem;
};

export const WikiItem = ({ page }: Props) => {
  const currentSpace = useCurrentSpace();
  const project = useProject(page.projectId);

  return (
    <List.Item
      title={page.name}
      subtitle={project?.projectKey}
      icon={getProjectImageUrl(currentSpace.credential, page.projectId)}
      accessories={[
        ...page.tags.map(({ name }) => ({ tag: { value: name, color: Color.Green } })),
        { date: new Date(page.updated) },
      ]}
      actions={
        <CommonActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={`https://${currentSpace.host}/alias/wiki/${page.id}`} />
          <Action.CopyToClipboard
            title="Copy Wiki URL"
            shortcut={{ modifiers: ["cmd", "shift"], key: "u" }}
            content={`https://${currentSpace.host}/alias/wiki/${page.id}`}
          />
        </CommonActionPanel>
      }
    />
  );
};
