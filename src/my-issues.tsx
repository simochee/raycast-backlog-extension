import { List } from "@raycast/api";
import { withProviders } from "./utils/providers";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { useMemo, useState } from "react";
import { getRecentViewTitle, searchFromKeyword } from "./utils/search";
import { IssueItem } from "./components/IssueItem";

const PER_PAGE = 25;

const Command = () => {
  const currentSpace = useCurrentSpace()
  const myself = useCurrentUser();

  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [searchText, setSearchText] = useState("");

  const {  data, fetchNextPage, hasNextPage, isFetchingNextPage  } = useSuspenseInfiniteQuery({
    queryKey: ['my-issues', currentSpace.space.spaceKey],
    queryFn: ({ pageParam }) => currentSpace.api.getIssues({
      createdUserId: [myself.id],
      sort: 'updated',
      order: 'desc',
      count: PER_PAGE,
      offset: pageParam,
    }),
    staleTime: 1000 * 60 * 3, // 3 min
    gcTime: 1000 * 60 * 3, // 3 min
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  })

  // FIXME
  const navigationTitle = getRecentViewTitle(data.pages.flat(), hasNextPage, "issue");

  const filteredData = useMemo(
    () => searchFromKeyword(data.pages.flat(), (issue) => `${issue.summary} ${issue.issueKey}`, searchText),
    [data, searchText],
  );

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
      searchBarAccessory={<SearchBarAccessory />}
      onSearchTextChange={setSearchText}
      >
      {filteredData.map((item) => (
        <IssueItem key={item.id} issue={item} onToggleShowingDetail={() => setIsShowingDetail((v) => !v)} />
      ))}
    </List>
  )
}

export default withProviders(Command);