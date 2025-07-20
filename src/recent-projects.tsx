import { useMemo, useState } from "react";
import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { CommonActionPanel } from "./features/common/components/CommonActionPanel";
import { ProjectItem } from "./features/project/components/ProjectItem";
import { SearchBarAccessory } from "./features/space/components/SearchBarAccessory";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { withProviders } from "./features/common/utils/providers";
import { getRecentViewTitle, searchFromKeyword } from "./features/common/utils/search";

const PER_PAGE = 25;

const Command = () => {
  const currentSpace = useCurrentSpace();
  const [searchText, setSearchText] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.space.spaceKey, "projects"],
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedProjects({
        count: PER_PAGE,
        offset: pageParam,
      }),
    staleTime: 1000 * 60, // 1 min
    gcTime: 1000 * 60, // 1 min
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? pages.flat().length : null),
  });

  const filteredData = useMemo(
    () => searchFromKeyword(data.pages.flat(), ({ project }) => `${project.name} ${project.projectKey}`, searchText),
    [data, searchText],
  );

  const navigationTitle = getRecentViewTitle(data.pages.flat(), hasNextPage, "project");

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
      onSearchTextChange={setSearchText}
    >
      {filteredData.map((item) => (
        <ProjectItem key={item.project.id} project={item.project} />
      ))}
    </List>
  );
};

export default withProviders(Command);
