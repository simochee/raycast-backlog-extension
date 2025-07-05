import { Detail, List, Action, Icon } from "@raycast/api";
import { WithCredentials } from "./components/WithCredentials";
import { CommonActionPanel } from "./components/CommonActionPanel";

export default function Command() {
  return (
    <WithCredentials>
      <List>
        <List.Item
          icon={Icon.Bird}
          title="Greeting"
          actions={
            <CommonActionPanel>
              <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
            </CommonActionPanel>
          }
        />
      </List>
    </WithCredentials>
  );
}
