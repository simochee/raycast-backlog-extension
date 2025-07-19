import { LaunchType, List, launchCommand } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { NotificationItem } from "./components/NotificationItem";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { groupByDate } from "./utils/group";
import { withProviders } from "./utils/providers";
import { resetNotificationsMarkAsRead } from "./utils/notification";

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

  const handleSelectionChange = async (id: string | null) => {
    const notification = data.pages.flat().find((page) => page.id === Number(id));

    if (notification?.resourceAlreadyRead === false) {
      await currentSpace.api.markAsReadNotification(notification.id);
    }
  };

  useEffect(() => {
    resetNotificationsMarkAsRead(currentSpace)
      .then((isReset) => {
        if (isReset) {
          launchCommand({ name: "menu-bar", type: LaunchType.Background })
        }
      });
  }, [currentSpace]);

  return (
    <List
      isShowingDetail
      isLoading={isFetchingNextPage}
      searchBarAccessory={<SearchBarAccessory />}
      pagination={{
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        pageSize: PER_PAGE,
      }}
      actions={<CommonActionPanel />}
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
