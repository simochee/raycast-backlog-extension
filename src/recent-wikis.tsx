import { CommonActionPanel } from "./components/CommonActionPanel";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { WikiItem } from "./components/WikiItem";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { groupByDate } from "./utils/group";
import { withProviders } from "./utils/providers";
import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

const PER_PAGE = 25;

const Command = () => {
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.spaceKey, "wikis"],
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 30, // 30 seconds
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedWikis({
        count: PER_PAGE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? (pages.flat().length ?? null) : null),
  });

  return (
    <List
      navigationTitle={currentSpace.space?.name}
      searchBarAccessory={<SearchBarAccessory />}
      actions={<CommonActionPanel />}
    >
      {groupByDate("updated", data.pages.flat()).map(({ label, items }) => (
        <List.Section key={label} title={label}>
          {items.map((item) => (
            <WikiItem key={item.page.id} page={item.page} />
          ))}
        </List.Section>
      ))}
    </List>
  );
};

export default withProviders(Command);
