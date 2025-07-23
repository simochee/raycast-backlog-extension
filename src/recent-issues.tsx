import { Action, List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { IssueItem } from "~issue/components/IssueItem";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { withProviders } from "~common/utils/providers";
import { getRecentViewTitle, searchFromKeyword } from "~common/utils/search";
import { recentIssuesOptions } from "~common/utils/queryOptions";

const Command = () => {
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [searchText, setSearchText] = useState("");

  const currentSpace = useCurrentSpace();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useSuspenseInfiniteQuery(
    recentIssuesOptions(currentSpace),
  );

  const navigationTitle = getRecentViewTitle(data.pages.flat(), hasNextPage, "issue");

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
      isLoading={isFetching || isFetchingNextPage}
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
        <IssueItem
          key={item.issue.id}
          issue={item.issue}
          isShowingDetail={isShowingDetail}
          onToggleShowingDetail={() => setIsShowingDetail((v) => !v)}
        />
      ))}
    </List>
  );
};

export default withProviders(Command);
