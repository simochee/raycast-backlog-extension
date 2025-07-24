import { Action, ActionPanel, Color, Icon, Image, List } from "@raycast/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { withProviders } from "~common/utils/providers";
import { myPullRequestsOptions, projectsOptions } from "~common/utils/queryOptions";
import { RepositoryPicker } from "~pull-request/components/RepositoryPicker";
import { useMyPullRequests } from "~pull-request/hooks/useMyPullRequests";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { PullRequestDetail } from "~pull-request/components/PullRequestDetail";
import { getProjectImageUrl, getUserIconUrl } from "~common/utils/image";
import { useCurrentUser } from "~common/hooks/useCurrentUser";
import { usePersistentState } from "~common/hooks/usePersistState";
import { ICONS } from "~common/constants/icon";
import { indexToShortcut } from "~common/utils/shortcut";

const FILTER_OPTIONS = [
  { label: "Assigned to me", value: "assigneeId" as const },
  { label: "Created by me", value: "createdUserId" as const },
];

const Command = () => {
  const currentUser = useCurrentUser();
  const currentSpace = useCurrentSpace();
  const { currentRepository, selectedRepositories, changeCurrentRepositoryId } = useMyPullRequests();
  const [filter, setFilter] = usePersistentState<"createdUserId" | "assigneeId">(
    "my-pull-requests-filter",
    "assigneeId",
  );

  const { data: pullRequests } = useSuspenseQuery(
    myPullRequestsOptions(
      currentSpace,
      currentRepository?.projectId,
      currentRepository?.repositoryId,
      currentUser,
      filter,
    ),
  );
  const { data: projects } = useSuspenseQuery(projectsOptions(currentSpace));

  const commonActions = (
    <>
      <Action.Push title="Select Repository" target={<RepositoryPicker />} />
      <ActionPanel.Submenu title="Filter" shortcut={{ modifiers: ["cmd", "shift"], key: "f" }}>
        {FILTER_OPTIONS.map(({ label, value }, i) => (
          <Action
            key={value}
            title={label}
            icon={
              filter === value
                ? { source: Icon.CheckCircle, tintColor: Color.Green }
                : {
                    source: Icon.Circle,
                    tintColor: Color.SecondaryText,
                  }
            }
            shortcut={indexToShortcut(i)}
            onAction={() => setFilter(value)}
          />
        ))}
      </ActionPanel.Submenu>
      <ActionPanel.Submenu title="Select Repository" shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}>
        {selectedRepositories.map(({ projectKey, repositoryId, repositoryName }) => (
          <Action
            key={repositoryId}
            title={`${projectKey}/${repositoryName}`}
            onAction={() => changeCurrentRepositoryId(repositoryId)}
          />
        ))}
      </ActionPanel.Submenu>
    </>
  );

  if (!currentRepository) return null;

  return (
    <List
      searchBarPlaceholder={`Search ${currentRepository.projectKey}/${currentRepository.repositoryName}`}
      navigationTitle={`${currentRepository.projectKey}/${currentRepository.repositoryName}`}
      actions={<CommonActionPanel>{commonActions}</CommonActionPanel>}
    >
      {pullRequests?.map((pullRequest) => {
        return (
          <List.Item
            key={pullRequest.id}
            title={pullRequest.summary}
            subtitle={`#${pullRequest.number}`}
            icon={getProjectImageUrl(currentSpace.credential, pullRequest.projectId)}
            accessories={[
              {
                date: new Date(pullRequest.updated),
              },
              {
                text: pullRequest.base,
                icon: {
                  source: ICONS.PULL_REQUEST_BRANCH,
                  tintColor: "#ed8077",
                },
              },
              pullRequest.assignee
                ? {
                    icon: {
                      source: getUserIconUrl(currentSpace.credential, pullRequest.assignee.id),
                      mask: Image.Mask.Circle,
                    },
                    tooltip: `@${pullRequest.assignee.name}`,
                  }
                : {
                    icon: Icon.Person,
                  },
            ]}
            detail={
              <PullRequestDetail
                component={List.Item.Detail}
                project={projects.find((project) => project.id === pullRequest.projectId)!}
                pullRequest={pullRequest}
              />
            }
            actions={
              <CommonActionPanel>
                <Action.OpenInBrowser
                  url={currentSpace.toUrl(
                    `/git/${currentRepository.projectKey}/${currentRepository.repositoryName}/pullRequests/${pullRequest.number}`,
                  )}
                />
                <Action.CopyToClipboard
                  title={`${pullRequest.branch}`}
                  content={pullRequest.branch}
                  shortcut={{
                    modifiers: ["ctrl"],
                    key: "c",
                  }}
                />
                <Action.CopyToClipboard
                  title={`${pullRequest.base}`}
                  content={pullRequest.branch}
                  shortcut={{
                    modifiers: ["ctrl", "shift"],
                    key: "c",
                  }}
                />
                {commonActions}
              </CommonActionPanel>
            }
          />
        );
      })}
    </List>
  );
};

export default withProviders(Command);
