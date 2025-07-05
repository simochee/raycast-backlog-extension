import { Action, Color, List } from "@raycast/api";
import type { Entity } from "backlog-js";
import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { useProject } from "../hooks/useProject";
import { CommonActionPanel } from "./CommonActionPanel";

type Props = {
  page: Entity.Wiki.WikiListItem;
};

export const WikiItem = ({ page }: Props) => {
  const currentSpace = useCurrentSpace();
  const [project] = useProject(page.projectId);

  return (
    <List.Item
      title={page.name}
      subtitle={project?.projectKey}
      icon={`https://${currentSpace.host}/api/v2/projects/${page.projectId}/image?apiKey=${currentSpace.apiKey}`}
      accessories={[
        ...page.tags.map(({ name }) => ({ tag: { value: name, color: Color.Green } })),
        { date: new Date(page.updated) },
      ]}
      actions={
        <CommonActionPanel>
          <Action.OpenInBrowser url={`https://${currentSpace.host}/alias/wiki/${page.id}`} />
          <Action.CopyToClipboard
            title="Copy URL"
            shortcut={{ modifiers: ["cmd", "shift"], key: "u" }}
            content={`https://${currentSpace.host}/alias/wiki/${page.id}`}
          />
        </CommonActionPanel>
      }
    />
  );
};
