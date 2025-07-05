import { Action, ActionPanel, List } from "@raycast/api"
import { SpaceForm } from "./SpaceForm"

export const SpaceList = () => {
  return (
    <List>
      <List.Item
        title="Space No.1"
        actions={
          <ActionPanel>
            <Action title="Switch" onAction={() => {}} />
            <Action title="Manage" onAction={() => {}} />
            <Action.Push title="Add Space" target={<SpaceForm onSubmit={console.log} />} />
          </ActionPanel>
        }
      />
    </List>
  )
}