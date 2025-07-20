import { Action, ActionPanel } from "@raycast/api";
import { cache } from "../utils/cache";

export const DebugActionPanel = () => {
  return (
    <ActionPanel.Section title="Debug">
      <Action title="Clear Cache" onAction={cache.clear} />
    </ActionPanel.Section>
  );
};
