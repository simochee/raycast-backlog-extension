import { Color, LaunchType, MenuBarExtra, launchCommand } from "@raycast/api";
import { useEffect, useState } from "react";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { useSpaces } from "./hooks/useSpaces";
import { getSpaceImageUrl } from "./utils/image";
import { withProviders } from "./utils/providers";
import { getNotificationCount } from "./utils/notification";
import type { NotificationCountSchema } from "./utils/notification";
import type { Keyboard } from "@raycast/api";
import type { InferOutput } from "valibot";

const Command = () => {
  console.log(`*${environment.commandName}* [Lifecycle] command started`);

  const spaces = useSpaces();
  const currentSpace = useCurrentSpace();

  const [unreadCounts, setUnreadCounts] = useState<Array<InferOutput<typeof NotificationCountSchema>>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalCount = Math.max(
    0,
    unreadCounts.reduce((acc, curr) => acc + curr.count, 0),
  );

  useEffect(() => {
    setIsLoading(true);

    getNotificationCount(spaces)
      .then(setUnreadCounts)
      .finally(() => setIsLoading(false));
  }, []);

  if (spaces.length === 0) return null;

  return (
    <MenuBarExtra
      isLoading={isLoading}
      icon={{ source: totalCount > 0 ? "icon-brand.png" : { dark: "icon@dark.png", light: "icon.png" } }}
      title={totalCount === 0 ? "No new" : `${totalCount.toLocaleString()} unread`}
    >
      <MenuBarExtra.Section title="Spaces">
        {spaces.map(({ space: { spaceKey, name }, credential }, index) => {
          const unreadCount = unreadCounts.find((item) => spaceKey === item.spaceKey)?.count;
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
              subtitle={
                unreadCount == null || unreadCount === 0
                  ? undefined
                  : unreadCount > 0
                    ? `${unreadCount.toLocaleString()} unread`
                    : "Failure"
              }
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
      {isLoading && <MenuBarExtra.Section title="Fetching..." />}
    </MenuBarExtra>
  );
};

export default withProviders(Command);
