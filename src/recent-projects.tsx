import { CommonActionPanel } from "./components/CommonActionPanel";
import { IssueItem } from "./components/IssueItem";
import { ProjectItem } from "./components/ProjectItem";
import { SearchBarAccessory } from "./components/SearchBarAccessory";
import { WikiItem } from "./components/WikiItem";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { withProviders } from "./utils/providers";
import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import type { Entity, Option } from "backlog-js";
import { useEffect, useMemo, useState } from "react";

const PER_PAGE = 25;

const Command = () => {
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseInfiniteQuery({
    queryKey: ["recent-viewed", currentSpace.spaceKey, "projects"],
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 30, // 30 seconds
    queryFn: ({ pageParam }) =>
      currentSpace.api.getRecentlyViewedProjects({
        count: PER_PAGE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PER_PAGE ? (pages.flat().length ?? null) : null),
  });

  const groupedItems = useMemo(() => {
    return data.pages.flat().reduce<
      {
        label: string;
        items: Entity.Project.RecentlyViewedProject[];
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

  return (
    <List
      navigationTitle={currentSpace.space?.name}
      searchBarAccessory={<SearchBarAccessory />}
      actions={<CommonActionPanel />}
    >
      {groupedItems.map(({ label, items }) => (
        <List.Section key={label} title={label}>
          {items.map((item) => (
            <ProjectItem key={item.project.id} project={item.project} />
          ))}
        </List.Section>
      ))}
    </List>
  );
};

export default withProviders(Command);
