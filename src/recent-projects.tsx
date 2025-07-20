import { useMemo, useState } from "react";
import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { ProjectItem } from "~project/components/ProjectItem";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { withProviders } from "~common/utils/providers";
import { getRecentViewTitle, searchFromKeyword } from "~common/utils/search";
import { CACHE_TTL } from "~common/constants/cache";

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
    staleTime: CACHE_TTL.RECENT_VIEWED_PROJECTS,
    gcTime: CACHE_TTL.RECENT_VIEWED_PROJECTS,
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
