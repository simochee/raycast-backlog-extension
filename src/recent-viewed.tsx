import { List } from "@raycast/api";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { useCachedState } from "@raycast/utils";
import type { Entity, Option } from "backlog-js";
import { useEffect, useMemo, useState } from "react";
import { IssueItem } from "./components/IssueItem";
import { WikiItem } from "./components/WikiItem";
import { ProjectItem } from "./components/ProjectItem";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { withProviders } from "./utils/providers";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

const PER_PAGE = 25;

const Command = () => {
  const [type, setType] = useCachedState<string>("recent-viewed-type", "issue");
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.spaceKey, type],
    staleTime: 1000 * 30, // 30 seconds
    queryFn: ({
      pageParam,
    }): Promise<
      Entity.Project.RecentlyViewedProject[] | Entity.Wiki.RecentlyViewedWiki[] | Entity.Issue.RecentlyViewedIssue[]
    > => {
      const params: Option.User.GetRecentlyViewedParams = {
        count: PER_PAGE,
        offset: pageParam,
      };

      switch (type) {
        case "project":
          return currentSpace.api.getRecentlyViewedProjects(params);
        case "wiki":
          return currentSpace.api.getRecentlyViewedWikis(params);
        default:
          return currentSpace.api.getRecentlyViewedIssues(params);
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? (pages.flat().length ?? null) : null),
  });

  const groupedItems = useMemo(() => {
    return data.pages.flat().reduce<
      {
        label: string;
        items: (
          | Entity.Project.RecentlyViewedProject
          | Entity.Wiki.RecentlyViewedWiki
          | Entity.Issue.RecentlyViewedIssue
        )[];
      }[]
    >((acc, item) => {
      const date = new Date(item.updated);
      const label = `${["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."][date.getMonth()]} ${date.getDate()}`;

      const existingGroup = acc.find((g) => g.label === label);
      if (existingGroup) {
        existingGroup.items.push(item);
        return acc;
      }
      return acc.concat({
        label,
        items: [item],
      });
    }, []);
  }, [data.pages]);

  useEffect(() => {
    if (type !== "issue") {
      setIsShowingDetail(false);
    }
  }, [type]);

  return (
    <List
      isShowingDetail={isShowingDetail}
      navigationTitle={currentSpace.space?.name}
      searchBarAccessory={
        <List.Dropdown tooltip="Filter by Type" defaultValue={type} onChange={setType}>
          <List.Dropdown.Item value="issue" title="Issues" />
          <List.Dropdown.Item value="project" title="Projects" />
          <List.Dropdown.Item value="wiki" title="Wiki Pages" />
        </List.Dropdown>
      }
      actions={<CommonActionPanel />}
    >
      {groupedItems.map(({ label, items }) => (
        <List.Section key={label} title={label}>
          {items.map((item) => {
            // Projects
            if ("project" in item) {
              return <ProjectItem key={item.project.id} project={item.project} />;
            }
            // Wikis
            if ("page" in item) {
              return <WikiItem key={item.page.id} page={item.page} />;
            }
            // Issues
            if ("issue" in item) {
              return (
                <IssueItem
                  key={item.issue.id}
                  issue={item.issue}
                  onToggleShowingDetail={() => setIsShowingDetail((v) => !v)}
                />
              );
            }
            return null;
          })}
        </List.Section>
      ))}
    </List>
  );
};

export default withProviders(Command);
