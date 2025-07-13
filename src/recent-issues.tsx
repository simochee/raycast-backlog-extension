import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { IssueItem } from "./components/IssueItem";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { groupByDate } from "./utils/group";
import { withProviders } from "./utils/providers";

const PER_PAGE = 25;

const Command = () => {
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "issues"],
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 30, // 30 seconds
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedIssues({
        count: PER_PAGE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

  return (
    <List
      isShowingDetail={isShowingDetail}
      navigationTitle="Recent Issues"
      searchBarAccessory={<SearchBarAccessory />}
      actions={<CommonActionPanel />}
    >
      {groupByDate("updated", data.pages.flat()).map(({ label, items }) => (
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
