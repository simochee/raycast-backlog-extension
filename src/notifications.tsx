import { List } from "@raycast/api";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { NotificationItem } from "./components/NotificationItem";
import { useMemo } from "react";
import { withProviders } from "./utils/providers";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import type { Entity } from "backlog-js";

const PER_PAGE = 25;

const Command = () => {
  const currentSpace = useCurrentSpace();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["notifications", currentSpace.spaceKey],
    staleTime: 1000 * 30, // 30 seconds
    queryFn: ({ pageParam }) =>
      currentSpace.api.getNotifications({
        count: PER_PAGE,
        maxId: pageParam !== -1 ? pageParam : undefined,
      }),
    initialPageParam: -1,
    getNextPageParam: (lastPage) => (lastPage.length === PER_PAGE ? (lastPage.slice().pop()?.id ?? null) : null),
  });

  const groupedItems = useMemo(() => {
    return data.pages
      .flat()
      .reduce<{ label: string; items: Entity.Notification.Notification[] }[]>((acc, notification) => {
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
  }, [data.pages]);

  return (
    <List
      isShowingDetail
      isLoading={isFetchingNextPage}
      pagination={{
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        pageSize: PER_PAGE,
      }}
      actions={<CommonActionPanel />}
    >
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
