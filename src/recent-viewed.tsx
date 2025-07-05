import { ActionPanel, Detail, List, Action, Icon } from "@raycast/api";
import { WithCredentials } from "./components/WithCredentials";

export default function Command() {
  return (
    <WithCredentials>
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
    </WithCredentials>
  );
}
