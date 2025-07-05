import { List } from "@raycast/api";
import { WithCredentials } from "./components/WithCredentials";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { usePromise } from "@raycast/utils";
import type { Backlog, Option } from "backlog-js";
import { useState } from "react";
import { IssueItem } from "./components/IssueItem";
import { WikiItem } from "./components/WikiItem";
import { ProjectItem } from "./components/ProjectItem";
import { CommonActionPanel } from "./components/CommonActionPanel";

export default function Command() {
  const [type, setType] = useState<string>("issue");
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const currentSpace = useCurrentSpace();

  const { data, isLoading } = usePromise(
    async (type: string, api: Backlog | undefined) => {
      if (!api) return [];

      const params: Option.User.GetRecentlyViewedParams = {
        count: 100,
      };

      switch (type) {
        case "project":
          return api.getRecentlyViewedProjects(params);
        case "wiki":
          return api.getRecentlyViewedWikis(params);
        default:
          return api.getRecentlyViewedIssues(params);
      }
    },
    [type, currentSpace.api],
  );

  return (
    <WithCredentials>
      <List
        isLoading={isLoading}
        isShowingDetail={isShowingDetail}
        navigationTitle={currentSpace.space?.name}
        searchBarAccessory={
          <List.Dropdown tooltip="Recent Viewed Type" storeValue={true} onChange={setType}>
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
    </WithCredentials>
  );
}
