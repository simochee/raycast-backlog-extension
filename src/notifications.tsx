import { List, Action, Icon } from "@raycast/api";
import { WithCredentials } from "./components/WithCredentials";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { usePromise } from "@raycast/utils";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { NotificationItem } from "./components/NotificationItem";
import { useMemo } from "react";

export default function Command() {
  const currentSpace = useCurrentSpace()

  const { data, isLoading } = usePromise(
    async (api: typeof currentSpace.api,) => {
      if (!api) return

      const notifications = await api.getNotifications({
        count: 100,
      })

      return notifications;
    },
    [currentSpace.api]
  )

  const groupedItems = useMemo(() => {
    if (!data) return []

    return data.reduce<{ label: string, items: typeof data }[]>((acc, notification) => {
      const date = new Date(notification.created)
      const label = `${["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."][date.getMonth()]} ${date.getDate()}`

      const existingGroup = acc.find(g => g.label === label)
      if (existingGroup) {
        existingGroup.items.push(notification)
        return acc;
      }
      return acc.concat({
        label,
        items: [notification]
      })
    }, [])
  }, [data])

  return (
    <WithCredentials>
      <List
        isShowingDetail
        isLoading={isLoading}
        actions={<CommonActionPanel>
        </CommonActionPanel>}
      >
        {groupedItems.map(({ label, items }) => (
          <List.Section key={label} title={label}>
            {items.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List.Section>
        ))}
      </List>
    </WithCredentials>
  );
}
