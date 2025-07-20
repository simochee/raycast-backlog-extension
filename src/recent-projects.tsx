import { useMemo, useState } from "react";
import { List } from "@raycast/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { ProjectItem } from "~project/components/ProjectItem";
import { SearchBarAccessory } from "~space/components/SearchBarAccessory";
import { withProviders } from "~common/utils/providers";
import { getRecentViewTitle, searchFromKeyword } from "~common/utils/search";
import { recentProjectsOptions } from "~common/utils/queryOptions";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";

const Command = () => {
  const currentSpace = useCurrentSpace();
  const [searchText, setSearchText] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    recentProjectsOptions(currentSpace),
  );

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
