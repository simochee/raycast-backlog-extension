import { ActionPanel, Detail, List, Action, Icon } from "@raycast/api";
import { SpaceProvider } from "./components/SpaceProvider";

export default function Command() {
  return (
    <SpaceProvider>
      
    <List>
      <List.Item
        icon={Icon.Bird}
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
    </SpaceProvider>
  );
}
    