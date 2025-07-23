import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";
import { WikiItem } from "~wiki/components/WikiItem";
import { withProviders } from "~common/utils/providers";
import { getRecentViewTitle } from "~common/utils/search";
import { recentWikisOptions } from "~common/utils/queryOptions";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";

const Command = () => {
  const currentSpace = useCurrentSpace();

  const { data, fetchNextPage, hasNextPage, isFetching } = useSuspenseInfiniteQuery(recentWikisOptions(currentSpace));

  const navigationTitle = getRecentViewTitle(data.pages.flat(), hasNextPage, "wiki");

  return (
    <List
      navigationTitle={navigationTitle}
      isLoading={isFetching}
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
