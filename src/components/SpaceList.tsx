import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api"
import { SpaceForm } from "./SpaceForm"
import { useCredentials } from "../hooks/useCredentials"
import { usePromise } from "@raycast/utils"
import { getSpaceWithCache } from "../utils/space"
import { SpaceCredentials } from "../types/space"

export const SpaceList = () => {
  const { pop } = useNavigation()
  const { credentials, addCredential, updateCredential } = useCredentials()

  const { isLoading, data } = usePromise(
    async (credentials: SpaceCredentials[]) => await Promise.all(credentials.map(async ({ spaceKey, domain, apiKey }) => {
      const space = await getSpaceWithCache(spaceKey, domain, apiKey)
      return {
        space,
        domain,
        apiKey,
      }
    })),
    [credentials],
  )
  
  return (
    <List isLoading={isLoading} actions={
      <ActionPanel>
        <Action.Push title="Add Space" target={<SpaceForm onSubmit={async (credential) => {await addCredential(credential); pop()}} />} />
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
            <Action.Push title="Manage" target={<SpaceForm initialValues={{ spaceKey, apiKey, domain }} onSubmit={async (credential) => {await updateCredential(credential); pop()}} />} />
            <Action.Push title="Add Space" target={<SpaceForm onSubmit={async (credential) => {await addCredential(credential); pop()}} />} />
          </ActionPanel>
        }
      />
      ))}
    </List>
  )
}