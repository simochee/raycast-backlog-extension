import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";
import { WikiItem } from "~wiki/components/WikiItem";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { withProviders } from "~common/utils/providers";
import { getRecentViewTitle } from "~common/utils/search";

const PER_PAGE = 25;

const Command = () => {
  const currentSpace = useCurrentSpace();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "wikis"],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedWikis({
        count: PER_PAGE,
        offset: pageParam,
      }),
    staleTime: 1000 * 60 * 10, // 10 min
    gcTime: 1000 * 60 * 10, // 10 min
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

  const navigationTitle = getRecentViewTitle(data.pages.flat(), hasNextPage, "wiki");

  return (
    <List
      navigationTitle={navigationTitle}
      isLoading={isFetchingNextPage}
      pagination={{
        onLoadMore: fetchNextPage,
        hasMore: hasNextPage,
        pageSize: 3,
      }}
      searchBarAccessory={<SearchBarAccessory />}
      actions={<CommonActionPanel />}
    >
      {data.pages.flat().map((item) => (
        <WikiItem key={item.page.id} page={item.page} />
      ))}
    </List>
  );
};

export default withProviders(Command);
