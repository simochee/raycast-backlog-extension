import { List } from "@raycast/api";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { useCachedState } from "@raycast/utils";
import type { Entity, Option } from "backlog-js";
import { useEffect, useState } from "react";
import { IssueItem } from "./components/IssueItem";
import { WikiItem } from "./components/WikiItem";
import { ProjectItem } from "./components/ProjectItem";
import { CommonActionPanel } from "./components/CommonActionPanel";
import { withProviders } from "./utils/providers";
import { useSuspenseQuery } from "@tanstack/react-query";

const Command = () => {
  const [type, setType] = useCachedState<string>("recent-viewed-type", "issue");
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseQuery({
    queryKey: ["recent-viewed", currentSpace.spaceKey, type],
    queryFn: (): Promise<
      Entity.Project.RecentlyViewedProject[] | Entity.Wiki.RecentlyViewedWiki[] | Entity.Issue.RecentlyViewedIssue[]
    > => {
      const params: Option.User.GetRecentlyViewedParams = {
        count: 100,
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
  });

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
        <List.Dropdown tooltip="Recent Viewed Type" defaultValue={type} onChange={setType}>
          <List.Dropdown.Item value="issue" title="Issues" />
          <List.Dropdown.Item value="project" title="Projects" />
          <List.Dropdown.Item value="wiki" title="Wikis" />
        </List.Dropdown>
      }
      actions={<CommonActionPanel />}
    >
      {data?.map((item) => {
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
    </List>
  );
};

export default withProviders(Command);
