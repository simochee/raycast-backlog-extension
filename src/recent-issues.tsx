import { CommonActionPanel } from "./components/CommonActionPanel";
import { IssueItem } from "./components/IssueItem";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { withProviders } from "./utils/providers";
import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import type { Entity } from "backlog-js";
import { useMemo, useState } from "react";

const PER_PAGE = 25;

const Command = () => {
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.spaceKey, "issues"],
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 30, // 30 seconds
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedIssues({
        count: PER_PAGE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? (pages.flat().length ?? null) : null),
  });

  const groupedItems = useMemo(() => {
    return data.pages.flat().reduce<
      {
        label: string;
        items: Entity.Issue.RecentlyViewedIssue[];
      }[]
    >((acc, item) => {
      const date = new Date(item.updated);
      const label = `${["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."][date.getMonth()]} ${date.getDate()}`;

      const existingGroup = acc.find((g) => g.label === label);
      if (existingGroup) {
        existingGroup.items.push(item);
        return acc;
      }
      return acc.concat({
        label,
        items: [item],
      });
    }, []);
  }, [data.pages]);

  return (
    <List
      isShowingDetail={isShowingDetail}
      navigationTitle={currentSpace.space?.name}
      searchBarAccessory={<SearchBarAccessory />}
      actions={<CommonActionPanel />}
    >
      {groupedItems.map(({ label, items }) => (
        <List.Section key={label} title={label}>
          {items.map((item) => (
            <IssueItem
              key={item.issue.id}
              issue={item.issue}
              onToggleShowingDetail={() => setIsShowingDetail((v) => !v)}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
};

export default withProviders(Command);
