import { LaunchType, List, launchCommand } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CommonActionPanel } from "./features/common/components/CommonActionPanel";
import { NotificationItem } from "./features/notification/components/NotificationItem";
import { SearchBarAccessory } from "./features/space/components/SearchBarAccessory";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { groupByDate } from "./features/common/utils/group";
import { withProviders } from "./features/common/utils/providers";
import { resetNotificationsMarkAsRead } from "./features/notification/utils/notification";

const PER_PAGE = 25;

const Command = () => {
  const currentSpace = useCurrentSpace();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["notifications", currentSpace.credential.spaceKey],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getNotifications({
        count: PER_PAGE,
        maxId: pageParam !== -1 ? pageParam : undefined,
      }),
    staleTime: 1000 * 60, // 1 min
    gcTime: 1000 * 60, // 1 min
    initialPageParam: -1,
    getNextPageParam: (lastPage) => (lastPage.length === PER_PAGE ? (lastPage.slice().pop()?.id ?? null) : null),
  });

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
