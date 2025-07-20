import { LaunchType, List, launchCommand } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { NotificationItem } from "~notification/components/NotificationItem";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { groupByDate } from "~common/utils/group";
import { withProviders } from "~common/utils/providers";
import { resetNotificationsMarkAsRead } from "~notification/utils/notification";
import { notificationsOptions } from "~common/utils/queryOptions";

const Command = () => {
  const currentSpace = useCurrentSpace();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    notificationsOptions(currentSpace),
  );

  const loadedCount = data.pages.flat().length;
  const navigationTitle =
    loadedCount === 0
      ? "No notifications found"
      : `${loadedCount} notification${loadedCount === 1 ? "" : "s"} ${hasNextPage ? "loaded" : "total"}`;

  const handleSelectionChange = async (id: string | null) => {
    const notification = data.pages.flat().find((page) => page.id === Number(id));

    if (notification?.resourceAlreadyRead === false) {
      await currentSpace.api.markAsReadNotification(notification.id);
    }
  };

  useEffect(() => {
    resetNotificationsMarkAsRead(currentSpace).then((isReset) => {
      if (isReset) {
        launchCommand({ name: "menu-bar", type: LaunchType.Background });
      }
    });
  }, [currentSpace]);

  return (
    <List
      isShowingDetail
      isLoading={isFetchingNextPage}
      navigationTitle={navigationTitle}
      pagination={{
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        pageSize: 3,
      }}
      actions={<CommonActionPanel />}
      searchBarAccessory={<SearchBarAccessory />}
      onSelectionChange={handleSelectionChange}
    >
      {groupByDate("created", data.pages.flat()).map(({ label, items }) => (
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
