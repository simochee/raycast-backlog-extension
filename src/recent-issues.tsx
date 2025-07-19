import { Action, List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { IssueItem } from "./components/IssueItem";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { groupByDate } from "./utils/group";
import { withProviders } from "./utils/providers";
import { getRecentViewTitle, searchFromKeyword } from "./utils/search";

const PER_PAGE = 25;

const Command = () => {
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [searchText, setSearchText] = useState("");

  const currentSpace = useCurrentSpace();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "issues"],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedIssues({
        count: PER_PAGE,
        offset: pageParam,
      }),
    staleTime: 1000 * 60 * 3, // 3 min
    gcTime: 1000 * 60 * 3, // 3 min
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

  const navigationTitle = getRecentViewTitle(data.pages.flat(), hasNextPage, 'issue');

  const filteredData = useMemo(
    () => searchFromKeyword(data.pages.flat(), ({ issue }) => `${issue.summary} ${issue.issueKey}`, searchText),
    [data, searchText],
  );

  const searchIssueKey = useMemo(() => {
    if (filteredData.length !== 0) return;

    return /[A-Z0-9_]+-[0-9]+/.exec(searchText.toUpperCase())?.[0];
  }, [filteredData, searchText]);

  return (
    <List
      isShowingDetail={isShowingDetail}
      navigationTitle={navigationTitle}
      isLoading={isFetchingNextPage}
      pagination={{
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        pageSize: 3,
      }}
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
      {filteredData.map((item) => (
        <IssueItem key={item.issue.id} issue={item.issue} onToggleShowingDetail={() => setIsShowingDetail((v) => !v)} />
      ))}
    </List>
  );
};

export default withProviders(Command);
