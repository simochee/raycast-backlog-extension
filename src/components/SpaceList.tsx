import { Action, ActionPanel, Icon, List } from "@raycast/api"
import { SpaceForm } from "./SpaceForm"
import { useSpaces } from "../hooks/useSpaces"
import { usePromise } from "@raycast/utils"
import { getSpaceWithCache } from "../utils/space"
import { SpaceCredentials } from "../types/space"

export const SpaceList = () => {
  const { spaces, addSpace } = useSpaces()

  const { isLoading, data } = usePromise(
    async (spaces: SpaceCredentials[]) => await Promise.all(spaces.map(async ({ spaceKey, domain, apiKey }) => {
      const space = await getSpaceWithCache(spaceKey, domain, apiKey)
      return {
        space,
        domain,
        apiKey,
      }
    })),
    [spaces],
  )
  
  return (
    <List isLoading={isLoading} actions={
      <ActionPanel>
        <Action.Push title="Add Space" target={<SpaceForm onSubmit={addSpace} />} />
      </ActionPanel>
    }>
      {data?.map(({ space: { spaceKey, name }, apiKey, domain }) => (
      <List.Item
      key={spaceKey}
        title={name}
        subtitle={spaceKey}
        icon={`https://${spaceKey}.${domain}/api/v2/space/image?apiKey=${apiKey}`}
        accessories={[
          { icon: Icon.Check }
        ]}
        actions={
          <ActionPanel>
            <Action title="Switch" onAction={() => {}} />
            <Action.Push title="Manage" target={<SpaceForm initialValues={{ spaceKey, apiKey, domain }} onSubmit={addSpace} />} />
            <Action.Push title="Add Space" target={<SpaceForm onSubmit={addSpace} />} />
          </ActionPanel>
        }
      />
      ))}
    </List>
  )
}