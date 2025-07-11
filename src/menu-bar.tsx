import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { useSpaces } from "./hooks/useSpaces";
import { getSpaceImageUrl } from "./utils/image";
import { withProviders } from "./utils/providers";
import { getSpaceHost } from "./utils/space";
import { Color, Keyboard, launchCommand, LaunchType, MenuBarExtra } from "@raycast/api";
import { useQuery } from "@tanstack/react-query";
import { Backlog } from "backlog-js";
import { useEffect, useState } from "react";

const Command = () => {
  const spaces = useSpaces();
  const currentSpace = useCurrentSpace();

  const { data, isStale, isFetched, isFetching } = useQuery({
    queryKey: ["unread-counts"],
    queryFn: async () =>
      Promise.all(
        spaces.map(async ({ space, credential }) => {
          const api = new Backlog({ host: getSpaceHost(credential), apiKey: credential.apiKey });
          // @ts-expect-error invalid type definition
          const { count } = await api.getNotificationsCount({ alreadyRead: false });

          return { space, count };
        }),
      ),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const totalCount = data?.reduce((acc, curr) => acc + curr.count, 0) ?? 0;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isStale || (isFetched && !isFetching)) {
      // Wait for the next tick to ensure the query cache is updated
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isStale, isFetched, isFetching]);

  if (spaces.length === 0) return null;

  return (
    <MenuBarExtra
      isLoading={isLoading}
      icon={{ source: totalCount > 0 ? "icon-brand.svg" : { dark: "icon@dark.svg", light: "icon.svg" } }}
      title={totalCount === 0 ? "No new" : `${totalCount.toLocaleString()} unread`}
    >
      <MenuBarExtra.Section title="Spaces">
        {spaces.map(({ space: { spaceKey, name }, credential }, index) => {
          const unreadCount = data?.find(({ space }) => spaceKey === space.spaceKey)?.count;
          const shortcut: Keyboard.Shortcut | undefined =
            index === 0
              ? { modifiers: ["cmd"], key: "1" }
              : index === 1
                ? { modifiers: ["cmd"], key: "2" }
                : index === 2
                  ? { modifiers: ["cmd"], key: "3" }
                  : index === 3
                    ? { modifiers: ["cmd"], key: "4" }
                    : index === 4
                      ? { modifiers: ["cmd"], key: "5" }
                      : index === 5
                        ? { modifiers: ["cmd"], key: "6" }
                        : index === 6
                          ? { modifiers: ["cmd"], key: "7" }
                          : index === 7
                            ? { modifiers: ["cmd"], key: "8" }
                            : index === 8
                              ? { modifiers: ["cmd"], key: "9" }
                              : undefined;

          return (
            <MenuBarExtra.Item
              key={spaceKey}
              title={name}
              icon={getSpaceImageUrl(credential)}
              subtitle={unreadCount ? `${unreadCount.toLocaleString()} unread` : undefined}
              tooltip={`${name} (${spaceKey})`}
              onAction={() => {
                currentSpace.setSpaceKey(spaceKey);
                launchCommand({ name: "notifications", type: LaunchType.UserInitiated });
              }}
              shortcut={shortcut}
            />
          );
        })}
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Issues"
          subtitle="Recent Viewed"
          icon={{ source: "tabler/checklist.svg", tintColor: Color.SecondaryText }}
          onAction={() => launchCommand({ name: "recent-issues", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item
          title="Projects"
          subtitle="Recent Viewed"
          icon={{ source: "tabler/buildings.svg", tintColor: Color.SecondaryText }}
          onAction={() => launchCommand({ name: "recent-projects", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item
          title="Wikis"
          subtitle="Recent Viewed"
          icon={{ source: "tabler/article.svg", tintColor: Color.SecondaryText }}
          onAction={() => launchCommand({ name: "recent-wikis", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item
          title="Notifications"
          icon={{ source: "tabler/bell-ringing-2.svg", tintColor: Color.SecondaryText }}
          onAction={() => launchCommand({ name: "notifications", type: LaunchType.UserInitiated })}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
};

export default withProviders(Command);
