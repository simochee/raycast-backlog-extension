import React from "react";
import { List } from "@raycast/api";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { NotificationItem } from "./components/NotificationItem";
import { useMemo } from "react";
import { withProviders } from "./utils/providers";
import { useSuspenseQuery } from "@tanstack/react-query";

const Command = () => {
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseQuery({
    queryKey: ["notifications", currentSpace.spaceKey],
    queryFn: () =>
      currentSpace.api.getNotifications({
        count: 100,
      }),
  });

  const groupedItems = useMemo(() => {
    if (!data) return [];

    return data.reduce<{ label: string; items: typeof data }[]>((acc, notification) => {
      const date = new Date(notification.created);
      const label = `${["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."][date.getMonth()]} ${date.getDate()}`;

      const existingGroup = acc.find((g) => g.label === label);
      if (existingGroup) {
        existingGroup.items.push(notification);
        return acc;
      }
      return acc.concat({
        label,
        items: [notification],
      });
    }, []);
  }, [data]);

  return (
    <List isShowingDetail actions={<CommonActionPanel></CommonActionPanel>}>
      {groupedItems.map(({ label, items }) => (
        <List.Section key={label} title={label}>
          {items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </List.Section>
      ))}
    </List>
  );
};

export default withProviders(Command);
