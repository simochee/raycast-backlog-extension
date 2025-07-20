import { Action, List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useCachedState } from "@raycast/utils";
import type { FilterKey } from "~issue/components/MyIssuesActionPanel";
import { withProviders } from "~common/utils/providers";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { searchFromKeyword } from "~common/utils/search";
import { IssueItem } from "~issue/components/IssueItem";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { MyIssuesActionPanel } from "~issue/components/MyIssuesActionPanel";
import { useQueryOptions } from "~common/hooks/useQueryOptions";

const Command = () => {
  const currentSpace = useCurrentSpace();
  const queryOptions = useQueryOptions();

  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useCachedState<FilterKey>("my-issues-filter", "assigneeId");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    queryOptions.myIssues(filter),
  );

  const filteredData = useMemo(
    () => searchFromKeyword(data.pages.flat(), (issue) => `${issue.summary} ${issue.issueKey}`, searchText),
    [data, searchText],
  );

  const navigationTitle = useMemo(() => {
    const loadedCount = filteredData.length;
    const count = loadedCount || "No";
    const unit = loadedCount === 1 ? "issue" : "issues";
    const target = filter === "assigneeId" ? "assigned to me" : "created by me";
    const suffix = loadedCount === 0 ? "found" : hasNextPage ? "loaded" : "total";

    return `${count} ${target} ${unit} ${suffix}`;
  }, [filteredData, filter, hasNextPage]);

  const searchIssueKey = useMemo(() => {
    if (filteredData.length !== 0) return;

    return /[A-Z0-9_]+-[0-9]+/.exec(searchText.toUpperCase())?.[0];
  }, [filteredData, searchText]);

  const commandActions = <MyIssuesActionPanel filter={filter} onFilterChange={setFilter} />;

  return (
    <List
      navigationTitle={navigationTitle}
      isShowingDetail={isShowingDetail}
      isLoading={isFetchingNextPage}
      pagination={{
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        pageSize: 3,
      }}
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
      searchBarAccessory={<SearchBarAccessory />}
      onSearchTextChange={setSearchText}
    >
      {filteredData.map((item) => (
        <IssueItem
          key={item.id}
          issue={item}
          actions={commandActions}
          isShowingDetail={isShowingDetail}
          onToggleShowingDetail={() => setIsShowingDetail((v) => !v)}
        />
      ))}
    </List>
  );
};

export default withProviders(Command);
