import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { withProviders } from "./utils/providers";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { searchFromKeyword } from "./utils/search";
import { IssueItem } from "./components/IssueItem";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { MyIssuesActionPanel } from "./components/MyIssuesActionPanel";
import type { FilterKey } from "./components/MyIssuesActionPanel";

const PER_PAGE = 25;

const Command = () => {
  const currentSpace = useCurrentSpace();
  const myself = useCurrentUser();

  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<FilterKey>("assigneeId");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["my-issues", currentSpace.space.spaceKey, filter],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getIssues({
        [filter]: [myself.id],
        sort: "updated",
        order: "desc",
        count: PER_PAGE,
        offset: pageParam,
      }),
    staleTime: 1000 * 60 * 3, // 3 min
    gcTime: 1000 * 60 * 3, // 3 min
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

  const navigationTitle = useMemo(() => {
    const loadedCount = data.pages.flat().length;
    const unit = loadedCount === 1 ? "issue" : "issues";
    const target = filter === "assigneeId" ? "assigned to me" : "created by me";
    const suffix = hasNextPage ? "loaded" : "total";

    return `${loadedCount} ${target} ${unit} ${suffix}`;
  }, [data, filter, hasNextPage]);

  const filteredData = useMemo(
    () => searchFromKeyword(data.pages.flat(), (issue) => `${issue.summary} ${issue.issueKey}`, searchText),
    [data, searchText],
  );

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
      actions={<CommonActionPanel>{commandActions}</CommonActionPanel>}
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
