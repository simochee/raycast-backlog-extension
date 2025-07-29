import { LaunchType, List, launchCommand } from "@raycast/api";
import { useQueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { NotificationItem } from "~notification/components/NotificationItem";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { groupByDate } from "~common/utils/group";
import { withProviders } from "~common/utils/providers";
import { notificationCountOptions } from "~query/space";
import { notificationsOptions } from "~query/notification";
import { DELAY } from "~common/constants/cache";

const Command = () => {
  const queryClient = useQueryClient();
  const currentSpace = useCurrentSpace();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useSuspenseInfiniteQuery(
    notificationsOptions(currentSpace.credential),
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
      queryClient.setQueryData(
        notificationsOptions(currentSpace.credential).queryKey,
        (infiniteData) =>
          infiniteData && {
            ...infiniteData,
            pages: infiniteData.pages.map((page) =>
              page.map((item) => ({
                ...item,
                resourceAlreadyRead: item.id === notification.id ? true : item.resourceAlreadyRead,
              })),
            ),
          },
      );
    }
  };

  useEffect(() => {
    if (isFetching) return;

    const { queryKey } = notificationCountOptions(currentSpace.credential);
    const queryData = queryClient.getQueryData(queryKey);

    if (!queryData || queryData.count === 0) return;

    queryClient.setQueryData(queryKey, { count: 0 });
    queryClient.invalidateQueries({ queryKey });

    setTimeout(() => {
      currentSpace.api
        .resetNotificationsMarkAsRead()
        .finally(() => launchCommand({ name: "menu-bar", type: LaunchType.Background }));
    }, DELAY.NOTIFICATION_UPDATE);
  }, [currentSpace, isFetching]);

  return (
    <List
      isShowingDetail
      isLoading={isFetching || isFetchingNextPage}
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
