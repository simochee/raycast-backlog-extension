import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { useCachedState } from "@raycast/utils";
import type { Entity, Option } from "backlog-js";
import { useEffect, useState } from "react";
import { IssueItem } from "./components/IssueItem";
import { WikiItem } from "./components/WikiItem";
import { ProjectItem } from "./components/ProjectItem";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { withProviders } from "./utils/providers";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { SearchBarAccessory } from "./components/SearchBarAccessory";

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

  useEffect(() => {
    if (type !== "issue") {
      setIsShowingDetail(false);
    }
  }, [type]);

  const actions = (
    <ActionPanel.Submenu title="Switch Type" icon={Icon.Switch} shortcut={{ modifiers: ["cmd"], key: "s" }}>
      {[
        { title: "Issues", value: "issue" },
        { title: "Projects", value: "project" },
        { title: "Wikis", value: "wiki" },
      ]
        .sort((a) => (a.value === type ? -1 : 1))
        .map(({ title, value }) => (
          <Action
            key={value}
            title={title}
            icon={
              type === value
                ? { source: Icon.CheckCircle, tintColor: Color.Green }
                : { source: Icon.Circle, tintColor: Color.SecondaryText }
            }
            onAction={() => setType(value)}
          />
        ))}
    </ActionPanel.Submenu>
  );

  return (
    <List
      isShowingDetail={isShowingDetail}
      navigationTitle={currentSpace.space?.name}
      searchBarAccessory={<SearchBarAccessory />}
      actions={<CommonActionPanel />}
    >
      {data.pages.flat().map((item) => {
        // Projects
        if ("project" in item) {
          return <ProjectItem key={item.project.id} project={item.project} actions={actions} />;
        }
        // Wikis
        if ("page" in item) {
          return <WikiItem key={item.page.id} page={item.page} actions={actions} />;
        }
        // Issues
        if ("issue" in item) {
          return (
            <IssueItem
              key={item.issue.id}
              issue={item.issue}
              actions={actions}
              onToggleShowingDetail={() => setIsShowingDetail((v) => !v)}
            />
          );
        }
        return null;
      })}
    </List>
  );
};

export default withProviders(Command);
