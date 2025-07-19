import { Action, List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { IssueItem } from "./components/IssueItem";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { groupByDate } from "./utils/group";
import { withProviders } from "./utils/providers";

const PER_PAGE = 25;

const Command = () => {
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [searchText, setSearchText] = useState("");

  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "issues"],
    gcTime: 1000 * 30, // 30 seconds
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedIssues({
        count: PER_PAGE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

  const filteredData = useMemo(
    () => data.pages.flat().filter(({ issue }) => issue.summary.includes(searchText)),
    [data, searchText],
  );

  const searchIssueKey = useMemo(() => {
    if (filteredData.length !== 0) return;

    return /[A-Z0-9_]+-[0-9]+/.exec(searchText.toUpperCase())?.[0];
  }, [filteredData, searchText]);

  return (
    <List
      isShowingDetail={isShowingDetail}
      navigationTitle="Recent Issues"
      searchBarAccessory={<SearchBarAccessory />}
      actions={
        <CommonActionPanel>
          {searchIssueKey && (
            <Action.OpenInBrowser
              title={`Open ${searchIssueKey} in Browser`}
              url={currentSpace.toUrl(`/view/${searchIssueKey}`)}
            />
          )}
        </CommonActionPanel>
      }
      onSearchTextChange={setSearchText}
    >
      {groupByDate("updated", filteredData).map(({ label, items }) => (
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
